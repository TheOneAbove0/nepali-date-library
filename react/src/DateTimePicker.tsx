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
import { ClockIcon, CheckIcon } from './NepaliDatePicker.icons';
import { normalizeNumerals } from './NepaliDatePicker.typeable';
import type {
  NepaliDatePickerProps,
  NepaliDatePickerValue,
  NepaliNumeralSystem,
} from './NepaliDatePicker.types';
import { formatNumericString, joinClassNames, formatPickerValue } from './NepaliDatePicker.utils';

/** Supported time formats. */
export type TimeFormat = '12h' | '24h';

/** Props for the base TimeInput component. */
export interface TimeInputProps {
  /** The controlled time value (e.g. "14:30"). */
  value?: string;
  /** The uncontrolled default time value. */
  defaultValue?: string;
  /** Callback fired when the input changes. */
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  /** Label for the time input. */
  label?: ReactNode;
  /** Description text displayed below the label. */
  description?: ReactNode;
  /** Placeholder text. */
  placeholder?: string;
  /** Disables the input. */
  disabled?: boolean;
  /** Makes the input read-only. */
  readOnly?: boolean;
  /** Minimum selectable time. */
  min?: string;
  /** Maximum selectable time. */
  max?: string;
  /** Step increment for the time input (in seconds). */
  step?: number;
  /** Whether to show and allow selecting seconds. */
  withSeconds?: boolean;
  /** Whether to show a button that opens a time picker dropdown. */
  showPickerButton?: boolean;
  /** Class name for the root element. */
  className?: string;
  /** Class name for the input element. */
  inputClassName?: string;
  /** Numeral system used for display: 'latin' (0-9) or 'nepali' (०-९). */
  numeralSystem?: NepaliNumeralSystem;
}

/** Props for the TimePicker dropdown component. */
export interface TimePickerProps {
  /** The controlled time value. */
  value?: string;
  /** The uncontrolled default time value. */
  defaultValue?: string;
  /** Callback fired when the time changes. */
  onChange?: (value: string) => void;
  /** Label for the picker. */
  label?: ReactNode;
  /** Description text. */
  description?: ReactNode;
  /** Disables the picker. */
  disabled?: boolean;
  /** Makes the picker read-only. */
  readOnly?: boolean;
  /** Time format: 12-hour or 24-hour. */
  format?: TimeFormat;
  /** Whether to include a seconds column. */
  withSeconds?: boolean;
  /** Whether to render the picker inside a dropdown/popover. */
  withDropdown?: boolean;
  /** Margin top spacing. */
  mt?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Class name for the root element. */
  className?: string;
  /** Numeral system used for display. */
  numeralSystem?: NepaliNumeralSystem;
}

/** Output value emitted by DateTimePicker. */
export interface DateTimeValue {
  /** The selected BS date. */
  date: BsDate | null;
  /** The selected time string (e.g. "14:30"). */
  time: string;
}

/** Input value accepted by DateTimePicker. */
export type DateTimeInputValue = {
  date?: BsDateInput | null;
  time?: string | null;
} | null;

/** Properties for the combined Date and Time Picker component. */
export interface DateTimePickerProps extends Omit<
  NepaliDatePickerProps,
  'pickerType' | 'type' | 'value' | 'defaultValue' | 'selected' | 'onChange'
> {
  /** The controlled date and time value. */
  value?: DateTimeInputValue;
  /** The uncontrolled default date and time value. */
  defaultValue?: DateTimeInputValue;
  /** Callback fired when the date or time changes. */
  onChange?: (value: DateTimeValue) => void;
  /** Specific props to pass down to the inner TimePicker. */
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
    numeralSystem?: NepaliNumeralSystem;
  };
  /** Alias for `timePickerProps.format`. */
  timeFormat?: TimeFormat;
  /** Alias for `timePickerProps.withSeconds`. */
  withSeconds?: boolean;
  /** Alias for `timePickerProps.label`. */
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
  numeralSystem = 'latin',
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
    commit(
      formatTime24(from12h(hour12, nextMeridiem), parsed.minutes, parsed.seconds, withSeconds),
    );
  };

  const displayValue = formatTimeDisplay(hasValue, parsed, format, withSeconds, numeralSystem);
  const selectedHours = hasValue ? (format === '12h' ? hour12 : parsed.hours24) : null;
  const selectedMinutes = hasValue ? parsed.minutes : null;
  const selectedSeconds = hasValue ? parsed.seconds : null;
  const selectedMeridiem = hasValue ? meridiem : null;
  const hoursOptions = createHourOptions(format);
  const minuteSecondOptions = createMinuteSecondOptions();
  const padNs = (v: number): string => formatNumericString(pad(v), numeralSystem);

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
                        {padNs(option)}
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
                        {padNs(option)}
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
                          {padNs(option)}
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
                          {formatMeridiemLabel(option, numeralSystem)}
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
          <TimeSegmentInput
            aria-label="Hours"
            disabled={disabled || readOnly}
            max={format === '12h' ? 12 : 23}
            min={format === '12h' ? 1 : 0}
            numeralSystem={numeralSystem}
            onCommit={onHoursChange}
            value={format === '12h' ? hour12 : parsed.hours24}
          />

          <span className="nepali-time-picker__separator">:</span>

          <TimeSegmentInput
            aria-label="Minutes"
            disabled={disabled || readOnly}
            max={59}
            min={0}
            numeralSystem={numeralSystem}
            onCommit={onMinutesChange}
            value={parsed.minutes}
          />

          {withSeconds && (
            <>
              <span className="nepali-time-picker__separator">:</span>
              <TimeSegmentInput
                aria-label="Seconds"
                disabled={disabled || readOnly}
                max={59}
                min={0}
                numeralSystem={numeralSystem}
                onCommit={onSecondsChange}
                value={parsed.seconds}
              />
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
              <option value="AM">{formatMeridiemLabel('AM', numeralSystem)}</option>
              <option value="PM">{formatMeridiemLabel('PM', numeralSystem)}</option>
            </select>
          )}
        </div>
      )}
    </div>
  );
}

interface TimeSegmentInputProps {
  'aria-label': string;
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  numeralSystem: NepaliNumeralSystem;
  onCommit: (value: string) => void;
}

function TimeSegmentInput({
  'aria-label': ariaLabel,
  value,
  min,
  max,
  disabled,
  numeralSystem,
  onCommit,
}: TimeSegmentInputProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const displayValue = formatNumericString(pad(value), numeralSystem);

  return (
    <input
      aria-label={ariaLabel}
      className="nepali-time-picker__input"
      disabled={disabled}
      inputMode="numeric"
      maxLength={2}
      onBlur={() => {
        const raw = normalizeNumerals(draft).replace(/\D/g, '');
        const n = Number(raw);
        if (raw && !Number.isNaN(n)) {
          onCommit(String(clamp(n, min, max)));
        }
        setEditing(false);
      }}
      onChange={(event) => {
        const raw = normalizeNumerals(event.currentTarget.value).replace(/\D/g, '');
        if (raw.length <= 2) {
          setDraft(formatNumericString(raw, numeralSystem));
          const n = Number(raw);
          if (raw && !Number.isNaN(n)) {
            onCommit(String(clamp(n, min, max)));
          }
        }
      }}
      onFocus={(event) => {
        setEditing(true);
        setDraft(displayValue);
        requestAnimationFrame(() => event.target.select());
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          event.preventDefault();
          const next =
            event.key === 'ArrowUp'
              ? value >= max
                ? min
                : value + 1
              : value <= min
                ? max
                : value - 1;
          onCommit(String(next));
          setDraft(formatNumericString(pad(next), numeralSystem));
        }
        if (event.key === 'Enter') {
          event.currentTarget.blur();
        }
      }}
      placeholder={formatNumericString(pad(min), numeralSystem)}
      type="text"
      value={editing ? draft : displayValue}
    />
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
  const resolvedNumeralSystem: NepaliNumeralSystem =
    timePickerProps?.numeralSystem ?? dateProps.numeralSystem ?? 'latin';

  const [uncontrolledValue, setUncontrolledValue] = useState<DateTimeValue>(() =>
    normalizeDateTimeValue(defaultValue, resolvedWithSeconds),
  );

  const currentValue =
    value === undefined ? uncontrolledValue : normalizeDateTimeValue(value, resolvedWithSeconds);

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

  const valueFormatter = useCallback(
    (v: NepaliDatePickerValue | null): string => {
      if (!v) return '';
      const singleDate = toSingleDate(v);
      if (!singleDate) return '';
      const dateStr = formatPickerValue(
        singleDate,
        'date',
        dateProps.dateFormat,
        resolvedNumeralSystem,
      );
      const parsed = parseTime(currentValue.time ?? '', resolvedWithSeconds);
      const hasValue = Boolean(currentValue.time?.trim());
      const timeStr = hasValue
        ? formatTimeDisplay(
            true,
            parsed,
            resolvedFormat,
            resolvedWithSeconds,
            resolvedNumeralSystem,
          )
        : '';
      return timeStr ? `${dateStr} ${timeStr}` : dateStr;
    },
    [
      currentValue.time,
      dateProps.dateFormat,
      resolvedFormat,
      resolvedNumeralSystem,
      resolvedWithSeconds,
    ],
  );

  return (
    <DatePickerInput
      {...dateProps}
      shouldCloseOnSelect={false}
      typeable={resolvedTypeable}
      value={currentValue.date}
      valueFormatter={valueFormatter}
      onChange={handleDateChange}
      children={({ closeCalendar }) => (
        <div className="nepali-date-time-picker__footer">
          <TimePicker
            className={timePickerProps?.className ?? 'nepali-date-time-picker__time'}
            description={timePickerProps?.description}
            disabled={dateProps.disabled}
            readOnly={dateProps.readOnly}
            format={resolvedFormat}
            label={resolvedTimeLabel}
            mt={timePickerProps?.mt}
            numeralSystem={resolvedNumeralSystem}
            value={currentValue.time}
            withDropdown={timePickerProps?.withDropdown}
            withSeconds={resolvedWithSeconds}
            onChange={handleTimeChange}
          />
          <button
            aria-label="Confirm time selection"
            className="nepali-date-time-picker__submit"
            onClick={closeCalendar}
            type="button"
          >
            <CheckIcon />
          </button>
          {typeof children === 'function' ? children({ closeCalendar }) : children}
        </div>
      )}
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
  numeralSystem: NepaliNumeralSystem = 'latin',
): string {
  const ns = (s: string): string => formatNumericString(s, numeralSystem);

  if (!hasValue) {
    if (format === '12h') {
      return withSeconds ? `${ns('--')}:${ns('--')}:${ns('--')} --` : `${ns('--')}:${ns('--')} --`;
    }

    return withSeconds ? `${ns('--')}:${ns('--')}:${ns('--')}` : `${ns('--')}:${ns('--')}`;
  }

  if (format === '12h') {
    const { hour12, meridiem } = to12h(parsed.hours24);
    const meridiemLabel = formatMeridiemLabel(meridiem, numeralSystem);
    if (withSeconds) {
      return `${ns(pad(hour12))}:${ns(pad(parsed.minutes))}:${ns(pad(parsed.seconds))} ${meridiemLabel}`;
    }

    return `${ns(pad(hour12))}:${ns(pad(parsed.minutes))} ${meridiemLabel}`;
  }

  const h = clamp(parsed.hours24, 0, 23);
  const m = clamp(parsed.minutes, 0, 59);
  const s = clamp(parsed.seconds, 0, 59);

  if (withSeconds) {
    return `${ns(pad(h))}:${ns(pad(m))}:${ns(pad(s))}`;
  }

  return `${ns(pad(h))}:${ns(pad(m))}`;
}

function formatMeridiemLabel(meridiem: 'AM' | 'PM', numeralSystem: NepaliNumeralSystem): string {
  if (numeralSystem === 'nepali') {
    return meridiem === 'AM' ? 'पूर्वाह्न' : 'अपराह्न';
  }

  return meridiem;
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

  const offset = selected.offsetTop - column.clientHeight * 0.62 + selected.clientHeight / 2;
  const maxScroll = Math.max(0, column.scrollHeight - column.clientHeight);
  const target = Math.max(0, Math.min(maxScroll, offset));

  column.scrollTo({
    top: target,
    behavior: 'smooth',
  });
}
