import { parseBsDate, type BsDate, type BsDateInput } from 'nepali-date-library';
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import { DatePickerInput } from './NepaliDatePicker';
import { ClockIcon } from './NepaliDatePicker.icons';
import type { NepaliDatePickerProps, NepaliDatePickerValue } from './NepaliDatePicker.types';
import { joinClassNames } from './NepaliDatePicker.utils';

export type TimeFormat = '12h' | '24h';

export interface TimeInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  label?: ReactNode;
  description?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  min?: string;
  max?: string;
  step?: number;
  withSeconds?: boolean;
  showPickerButton?: boolean;
  className?: string;
  inputClassName?: string;
}

export interface TimePickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  format?: TimeFormat;
  withSeconds?: boolean;
  withDropdown?: boolean;
  mt?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
}

export interface DateTimeValue {
  date: BsDate | null;
  time: string;
}

export type DateTimeInputValue =
  | {
      date?: BsDateInput | null;
      time?: string | null;
    }
  | null;

export interface DateTimePickerProps
  extends Omit<
    NepaliDatePickerProps,
    'pickerType' | 'type' | 'value' | 'defaultValue' | 'selected' | 'onChange'
  > {
  value?: DateTimeInputValue;
  defaultValue?: DateTimeInputValue;
  onChange?: (value: DateTimeValue) => void;
  timePickerProps?: {
    format?: TimeFormat;
    withSeconds?: boolean;
    label?: ReactNode;
    description?: ReactNode;
    className?: string;
    withDropdown?: boolean;
    mt?: TimePickerProps['mt'];
    popoverProps?: {
      withinPortal?: boolean;
    };
  };
  timeFormat?: TimeFormat;
  withSeconds?: boolean;
  timeLabel?: ReactNode;
}

interface ParsedTime {
  hours24: number;
  minutes: number;
  seconds: number;
}

const TIME_RE = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

export const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(function TimeInput(
  {
    value,
    defaultValue,
    onChange,
    label,
    description,
    placeholder,
    disabled,
    readOnly,
    min,
    max,
    step,
    withSeconds,
    showPickerButton,
    className,
    inputClassName,
  },
  ref,
) {
  const fallbackRef = useRef<HTMLInputElement | null>(null);

  const assignRef = useCallback(
    (node: HTMLInputElement | null): void => {
      fallbackRef.current = node;

      if (typeof ref === 'function') {
        ref(node);
        return;
      }

      if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  const resolvedStep = step ?? (withSeconds ? 1 : 60);

  return (
    <div
      className={joinClassNames('nepali-date-picker', 'nepali-date-picker--time-input', className)}
      data-show-picker-button={showPickerButton || undefined}
    >
      {label && <label className="nepali-date-picker__label">{label}</label>}
      {description && <div className="nepali-date-picker__description">{description}</div>}
      <div className="nepali-date-picker__input-shell">
        <input
          className={inputClassName ?? 'nepali-date-picker__input'}
          defaultValue={defaultValue}
          disabled={disabled}
          max={max}
          min={min}
          onChange={(event) => onChange?.(event.currentTarget.value, event)}
          placeholder={placeholder}
          readOnly={readOnly}
          ref={assignRef}
          step={resolvedStep}
          type="time"
          value={value}
        />
        {showPickerButton && (
          <button
            aria-label="Open time picker"
            className="nepali-date-picker__icon-button"
            disabled={disabled || readOnly}
            onClick={() => fallbackRef.current?.showPicker?.()}
            type="button"
          >
            <ClockIcon />
          </button>
        )}
      </div>
    </div>
  );
});

export function TimePicker({
  value,
  defaultValue,
  onChange,
  label,
  description,
  disabled,
  readOnly,
  format = '24h',
  withSeconds = false,
  withDropdown = false,
  mt,
  className,
}: TimePickerProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(() => {
    if (!defaultValue?.trim()) {
      return '';
    }

    return normalizeTimeString(defaultValue, withSeconds);
  });
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hoursColumnRef = useRef<HTMLDivElement | null>(null);
  const minutesColumnRef = useRef<HTMLDivElement | null>(null);
  const secondsColumnRef = useRef<HTMLDivElement | null>(null);
  const amPmColumnRef = useRef<HTMLDivElement | null>(null);

  const rawValue = value === undefined ? uncontrolledValue : value;
  const hasValue = Boolean(rawValue?.trim());
  const currentValue = hasValue ? normalizeTimeString(rawValue ?? '', withSeconds) : '';
  const parsed = parseTime(currentValue, withSeconds);
  const marginTop = resolveMarginTop(mt);

  const { hour12, meridiem } = useMemo(() => to12h(parsed.hours24), [parsed.hours24]);

  const commit = useCallback(
    (nextValue: string): void => {
      const normalized = normalizeTimeString(nextValue, withSeconds);

      if (value === undefined) {
        setUncontrolledValue(normalized);
      }

      onChange?.(normalized);
    },
    [onChange, value, withSeconds],
  );

  useEffect(() => {
    if (!withDropdown || !dropdownOpened) {
      return;
    }

    const onPointerDown = (event: MouseEvent): void => {
      if (!rootRef.current || rootRef.current.contains(event.target as Node)) {
        return;
      }

      setDropdownOpened(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [dropdownOpened, withDropdown]);

  useEffect(() => {
    if (!withDropdown || !dropdownOpened) {
      return;
    }

    scrollSelectedOptionIntoView(hoursColumnRef.current);
    scrollSelectedOptionIntoView(minutesColumnRef.current);

    if (withSeconds) {
      scrollSelectedOptionIntoView(secondsColumnRef.current);
    }

    if (format === '12h') {
      scrollSelectedOptionIntoView(amPmColumnRef.current);
    }
  }, [dropdownOpened, format, withDropdown, withSeconds]);

  const onHoursChange = (hoursRaw: string): void => {
    const nextHours = Number(hoursRaw);

    if (!Number.isInteger(nextHours)) {
      return;
    }

    if (format === '12h') {
      const nextHours24 = from12h(nextHours, meridiem);
      commit(formatTime24(nextHours24, parsed.minutes, parsed.seconds, withSeconds));
      return;
    }

    commit(formatTime24(nextHours, parsed.minutes, parsed.seconds, withSeconds));
  };

  const onMinutesChange = (minutesRaw: string): void => {
    const nextMinutes = Number(minutesRaw);

    if (!Number.isInteger(nextMinutes)) {
      return;
    }

    commit(formatTime24(parsed.hours24, nextMinutes, parsed.seconds, withSeconds));
  };

  const onSecondsChange = (secondsRaw: string): void => {
    const nextSeconds = Number(secondsRaw);

    if (!Number.isInteger(nextSeconds)) {
      return;
    }

    commit(formatTime24(parsed.hours24, parsed.minutes, nextSeconds, withSeconds));
  };

  const onMeridiemChange = (nextMeridiem: 'AM' | 'PM'): void => {
    commit(formatTime24(from12h(hour12, nextMeridiem), parsed.minutes, parsed.seconds, withSeconds));
  };

  const displayValue = formatTimeDisplay(hasValue, parsed, format, withSeconds);
  const selectedHours = hasValue ? (format === '12h' ? hour12 : parsed.hours24) : null;
  const selectedMinutes = hasValue ? parsed.minutes : null;
  const selectedSeconds = hasValue ? parsed.seconds : null;
  const selectedMeridiem = hasValue ? meridiem : null;
  const hoursOptions = createHourOptions(format);
  const minuteSecondOptions = createMinuteSecondOptions();

  return (
    <div
      className={joinClassNames(
        'nepali-date-picker',
        'nepali-date-picker--time-picker',
        withDropdown && 'nepali-date-picker--time-picker-dropdown',
        className,
      )}
      data-dropdown-open={dropdownOpened || undefined}
      ref={rootRef}
      style={marginTop ? ({ marginTop } as CSSProperties) : undefined}
    >
      {label && <label className="nepali-date-picker__label">{label}</label>}
      {description && <div className="nepali-date-picker__description">{description}</div>}
      {withDropdown ? (
        <div className="nepali-time-picker__dropdown-root">
          <button
            aria-expanded={dropdownOpened}
            aria-haspopup="listbox"
            className="nepali-time-picker__trigger"
            disabled={disabled || readOnly}
            onClick={() => setDropdownOpened((opened) => !opened)}
            type="button"
          >
            <span>{displayValue}</span>
            <span className="nepali-time-picker__trigger-action" aria-hidden="true">
              <ClockIcon />
            </span>
          </button>

          {dropdownOpened && (
            <div className="nepali-time-picker__dropdown">
              <div className="nepali-time-picker__columns">
                <div
                  aria-label="Hours"
                  className="nepali-time-picker__column"
                  ref={hoursColumnRef}
                  role="listbox"
                >
                  {hoursOptions.map((option) => {
                    const isSelected = selectedHours !== null && option === selectedHours;
                    return (
                      <button
                        aria-selected={isSelected}
                        className={joinClassNames(
                          'nepali-time-picker__option',
                          isSelected && 'nepali-time-picker__option--selected',
                        )}
                        data-selected={isSelected || undefined}
                        disabled={disabled || readOnly}
                        key={option}
                        onClick={() => onHoursChange(String(option))}
                        type="button"
                      >
                        {pad(option)}
                      </button>
                    );
                  })}
                </div>
                <div
                  aria-label="Minutes"
                  className="nepali-time-picker__column"
                  ref={minutesColumnRef}
                  role="listbox"
                >
                  {minuteSecondOptions.map((option) => {
                    const isSelected = selectedMinutes !== null && option === selectedMinutes;
                    return (
                      <button
                        aria-selected={isSelected}
                        className={joinClassNames(
                          'nepali-time-picker__option',
                          isSelected && 'nepali-time-picker__option--selected',
                        )}
                        data-selected={isSelected || undefined}
                        disabled={disabled || readOnly}
                        key={option}
                        onClick={() => onMinutesChange(String(option))}
                        type="button"
                      >
                        {pad(option)}
                      </button>
                    );
                  })}
                </div>
                {withSeconds && (
                  <div
                    aria-label="Seconds"
                    className="nepali-time-picker__column"
                    ref={secondsColumnRef}
                    role="listbox"
                  >
                    {minuteSecondOptions.map((option) => {
                      const isSelected = selectedSeconds !== null && option === selectedSeconds;
                      return (
                        <button
                          aria-selected={isSelected}
                          className={joinClassNames(
                            'nepali-time-picker__option',
                            isSelected && 'nepali-time-picker__option--selected',
                          )}
                          data-selected={isSelected || undefined}
                          disabled={disabled || readOnly}
                          key={option}
                          onClick={() => onSecondsChange(String(option))}
                          type="button"
                        >
                          {pad(option)}
                        </button>
                      );
                    })}
                  </div>
                )}
                {format === '12h' && (
                  <div
                    aria-label="AM or PM"
                    className="nepali-time-picker__column nepali-time-picker__column--ampm"
                    ref={amPmColumnRef}
                    role="listbox"
                  >
                    {(['AM', 'PM'] as const).map((option) => {
                      const isSelected = selectedMeridiem !== null && option === selectedMeridiem;
                      return (
                        <button
                          aria-selected={isSelected}
                          className={joinClassNames(
                            'nepali-time-picker__option',
                            'nepali-time-picker__option--ampm',
                            isSelected && 'nepali-time-picker__option--selected',
                          )}
                          data-selected={isSelected || undefined}
                          disabled={disabled || readOnly}
                          key={option}
                          onClick={() => onMeridiemChange(option)}
                          type="button"
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="nepali-time-picker__row">
          <select
            aria-label="Hours"
            className="nepali-time-picker__select"
            disabled={disabled || readOnly}
            onChange={(event) => onHoursChange(event.currentTarget.value)}
            value={format === '12h' ? String(hour12) : String(parsed.hours24)}
          >
            {createHourOptions(format).map((option) => (
              <option key={option} value={option}>
                {pad(option)}
              </option>
            ))}
          </select>

          <span className="nepali-time-picker__separator">:</span>

          <select
            aria-label="Minutes"
            className="nepali-time-picker__select"
            disabled={disabled || readOnly}
            onChange={(event) => onMinutesChange(event.currentTarget.value)}
            value={String(parsed.minutes)}
          >
            {createMinuteSecondOptions().map((option) => (
              <option key={option} value={option}>
                {pad(option)}
              </option>
            ))}
          </select>

          {withSeconds && (
            <>
              <span className="nepali-time-picker__separator">:</span>
              <select
                aria-label="Seconds"
                className="nepali-time-picker__select"
                disabled={disabled || readOnly}
                onChange={(event) => onSecondsChange(event.currentTarget.value)}
                value={String(parsed.seconds)}
              >
                {createMinuteSecondOptions().map((option) => (
                  <option key={option} value={option}>
                    {pad(option)}
                  </option>
                ))}
              </select>
            </>
          )}

          {format === '12h' && (
            <select
              aria-label="AM or PM"
              className="nepali-time-picker__select nepali-time-picker__select--meridiem"
              disabled={disabled || readOnly}
              onChange={(event) => onMeridiemChange(event.currentTarget.value as 'AM' | 'PM')}
              value={meridiem}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          )}
        </div>
      )}
    </div>
  );
}

export function DateTimePicker({
  value,
  defaultValue,
  onChange,
  timePickerProps,
  timeFormat,
  withSeconds,
  timeLabel,
  children,
  ...dateProps
}: DateTimePickerProps) {
  const resolvedFormat = timePickerProps?.format ?? timeFormat ?? '24h';
  const resolvedWithSeconds = timePickerProps?.withSeconds ?? withSeconds ?? false;
  const resolvedTimeLabel = timePickerProps?.label ?? timeLabel;
  const resolvedTypeable = dateProps.typeable ?? true;

  const [uncontrolledValue, setUncontrolledValue] = useState<DateTimeValue>(() =>
    normalizeDateTimeValue(defaultValue, resolvedWithSeconds),
  );

  const currentValue =
    value === undefined
      ? uncontrolledValue
      : normalizeDateTimeValue(value, resolvedWithSeconds);

  const commit = useCallback(
    (nextValue: DateTimeValue): void => {
      if (value === undefined) {
        setUncontrolledValue(nextValue);
      }

      onChange?.(nextValue);
    },
    [onChange, value],
  );

  const handleDateChange = (next: NepaliDatePickerValue): void => {
    commit({
      date: toSingleDate(next),
      time: currentValue.time,
    });
  };

  const handleTimeChange = (nextTime: string): void => {
    commit({
      date: currentValue.date,
      time: normalizeTimeString(nextTime, resolvedWithSeconds),
    });
  };

  return (
    <DatePickerInput
      {...dateProps}
      typeable={resolvedTypeable}
      value={currentValue.date}
      onChange={handleDateChange}
      children={
        <>
          <TimePicker
            className={timePickerProps?.className ?? 'nepali-date-time-picker__time'}
            description={timePickerProps?.description}
            format={resolvedFormat}
            label={resolvedTimeLabel}
            mt={timePickerProps?.mt}
            value={currentValue.time}
            withDropdown={timePickerProps?.withDropdown}
            withSeconds={resolvedWithSeconds}
            onChange={handleTimeChange}
          />
          {children}
        </>
      }
    />
  );
}

function toSingleDate(value: NepaliDatePickerValue): BsDate | null {
  if (Array.isArray(value)) {
    return value[1] ?? value[0];
  }

  return value;
}

function normalizeDateTimeValue(
  value: DateTimeInputValue | undefined,
  withSeconds: boolean,
): DateTimeValue {
  if (!value) {
    return {
      date: null,
      time: normalizeTimeString('', withSeconds),
    };
  }

  return {
    date: value.date ? parseBsDate(value.date) : null,
    time: normalizeTimeString(value.time ?? '', withSeconds),
  };
}

function createHourOptions(format: TimeFormat): number[] {
  if (format === '12h') {
    return Array.from({ length: 12 }, (_, index) => index + 1);
  }

  return Array.from({ length: 24 }, (_, index) => index);
}

function createMinuteSecondOptions(): number[] {
  return Array.from({ length: 60 }, (_, index) => index);
}

function normalizeTimeString(value: string, withSeconds: boolean): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return withSeconds ? '00:00:00' : '00:00';
  }

  if (!TIME_RE.test(trimmed)) {
    return withSeconds ? '00:00:00' : '00:00';
  }

  const parsed = parseTime(trimmed, withSeconds);
  return formatTime24(parsed.hours24, parsed.minutes, parsed.seconds, withSeconds);
}

function parseTime(value: string, withSeconds: boolean): ParsedTime {
  const normalized = TIME_RE.test(value) ? value : withSeconds ? '00:00:00' : '00:00';
  const [hoursText = '0', minutesText = '0', secondsText = '0'] = normalized.split(':');

  return {
    hours24: Number(hoursText) || 0,
    minutes: Number(minutesText) || 0,
    seconds: Number(secondsText) || 0,
  };
}

function formatTime24(
  hours24: number,
  minutes: number,
  seconds: number,
  withSeconds: boolean,
): string {
  const h = clamp(hours24, 0, 23);
  const m = clamp(minutes, 0, 59);
  const s = clamp(seconds, 0, 59);

  if (withSeconds) {
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  return `${pad(h)}:${pad(m)}`;
}

function to12h(hours24: number): { hour12: number; meridiem: 'AM' | 'PM' } {
  const clamped = clamp(hours24, 0, 23);
  const meridiem = clamped >= 12 ? 'PM' : 'AM';
  const hour12 = clamped % 12 || 12;

  return { hour12, meridiem };
}

function from12h(hour12: number, meridiem: 'AM' | 'PM'): number {
  const safeHour = clamp(hour12, 1, 12);

  if (meridiem === 'AM') {
    return safeHour === 12 ? 0 : safeHour;
  }

  return safeHour === 12 ? 12 : safeHour + 12;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function formatTimeDisplay(
  hasValue: boolean,
  parsed: ParsedTime,
  format: TimeFormat,
  withSeconds: boolean,
): string {
  if (!hasValue) {
    if (format === '12h') {
      return withSeconds ? '--:--:-- --' : '--:-- --';
    }

    return withSeconds ? '--:--:--' : '--:--';
  }

  if (format === '12h') {
    const { hour12, meridiem } = to12h(parsed.hours24);
    if (withSeconds) {
      return `${pad(hour12)}:${pad(parsed.minutes)}:${pad(parsed.seconds)} ${meridiem}`;
    }

    return `${pad(hour12)}:${pad(parsed.minutes)} ${meridiem}`;
  }

  return formatTime24(parsed.hours24, parsed.minutes, parsed.seconds, withSeconds);
}

function resolveMarginTop(mt: TimePickerProps['mt']): number | undefined {
  if (mt === undefined) {
    return undefined;
  }

  if (typeof mt === 'number') {
    return mt;
  }

  switch (mt) {
    case 'xs':
      return 8;
    case 'sm':
      return 12;
    case 'md':
      return 16;
    case 'lg':
      return 20;
    case 'xl':
      return 24;
    default:
      return undefined;
  }
}

function scrollSelectedOptionIntoView(column: HTMLDivElement | null): void {
  if (!column) {
    return;
  }

  const selected = column.querySelector<HTMLElement>('[data-selected="true"]');
  if (!selected) {
    return;
  }

  const offset =
    selected.offsetTop - column.clientHeight * 0.62 + selected.clientHeight / 2;
  const maxScroll = Math.max(0, column.scrollHeight - column.clientHeight);
  const target = Math.max(0, Math.min(maxScroll, offset));

  column.scrollTo({
    top: target,
    behavior: 'smooth',
  });
}
