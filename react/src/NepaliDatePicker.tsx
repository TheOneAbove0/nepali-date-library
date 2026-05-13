import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  compareBsDate,
  daysInMonth,
  formatBsDate,
  parseBsDate,
  type BsDate,
  type BsDateFormat,
  type BsDateInput,
  type WeekdayIndex,
} from 'nepali-date-library';
import type { MonthGridCell } from 'nepali-date-library/datepicker-core';
import { useNepaliDatePickerState } from './useNepaliDatePicker';

const MONTH_NAMES = ['बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत'];
const WEEKDAY_NAMES = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];
const WEEKDAY_SHORT_NAMES = ['आ', 'सो', 'मं', 'बु', 'बि', 'शु', 'श'];

type DateFormatter = BsDateFormat | ((date: BsDate) => string);

export interface NepaliDatePickerCustomInputProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onClick?: () => void;
  onFocus?: () => void;
}

export interface NepaliDatePickerHeaderProps {
  date: BsDate;
  viewYear: number;
  viewMonth: number;
  monthName: string;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  changeYear: (year: number) => void;
  changeMonth: (month: number) => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
}

export interface NepaliDatePickerDayNameProps {
  day: WeekdayIndex;
  shortName: string;
  fullName: string;
  index: number;
}

export interface NepaliDatePickerProps {
  value?: BsDateInput | null;
  selected?: BsDateInput | null;
  defaultValue?: BsDateInput | null;
  onChange?: (value: BsDate | null) => void;
  min?: BsDateInput;
  max?: BsDateInput;
  minDate?: BsDateInput;
  maxDate?: BsDateInput;
  includeDates?: BsDateInput[];
  excludeDates?: BsDateInput[];
  filterDate?: (date: BsDate) => boolean;
  isDateDisabled?: (date: BsDate) => boolean;
  weekStartsOn?: WeekdayIndex;
  calendarStartDay?: WeekdayIndex;
  inline?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  isClearable?: boolean;
  shouldCloseOnSelect?: boolean;
  placeholderText?: string;
  dateFormat?: DateFormatter;
  showIcon?: boolean;
  icon?: ReactNode;
  toggleCalendarOnIconClick?: boolean;
  customInput?: ReactElement<NepaliDatePickerCustomInputProps>;
  className?: string;
  inputClassName?: string;
  calendarClassName?: string;
  popperClassName?: string;
  dayClassName?: (date: BsDate, cell: MonthGridCell) => string;
  weekDayClassName?: (day: WeekdayIndex) => string;
  monthNames?: readonly string[];
  weekdayNames?: readonly string[];
  weekdayShortNames?: readonly string[];
  previousMonthLabel?: ReactNode;
  nextMonthLabel?: ReactNode;
  renderCustomHeader?: (props: NepaliDatePickerHeaderProps) => ReactNode;
  renderHeader?: (props: NepaliDatePickerHeaderProps) => ReactNode;
  renderDayContents?: (day: number, date: BsDate, cell: MonthGridCell) => ReactNode;
  renderCustomDayName?: (props: NepaliDatePickerDayNameProps) => ReactNode;
  onCalendarOpen?: () => void;
  onCalendarClose?: () => void;
  children?: ReactNode;
}

export function NepaliDatePicker(props: NepaliDatePickerProps) {
  const controlledValue = typeof props.value !== 'undefined' ? props.value : props.selected;
  const min = props.min ?? props.minDate;
  const max = props.max ?? props.maxDate;
  const weekStartsOn = props.weekStartsOn ?? props.calendarStartDay;
  const shouldCloseOnSelect = props.shouldCloseOnSelect ?? true;
  const rootRef = useRef<HTMLDivElement>(null);
  const calendarId = useId();

  const includeDateKeys = useMemo(() => toDateKeySet(props.includeDates), [props.includeDates]);
  const excludeDateKeys = useMemo(() => toDateKeySet(props.excludeDates), [props.excludeDates]);

  const isDateDisabled = useCallback((date: BsDate): boolean => {
    const key = formatBsDate(date);

    if (includeDateKeys && !includeDateKeys.has(key)) {
      return true;
    }

    if (excludeDateKeys && excludeDateKeys.has(key)) {
      return true;
    }

    if (props.filterDate && !props.filterDate(date)) {
      return true;
    }

    return Boolean(props.isDateDisabled?.(date));
  }, [excludeDateKeys, includeDateKeys, props.filterDate, props.isDateDisabled]);

  const picker = useNepaliDatePickerState({
    value: controlledValue,
    defaultValue: props.defaultValue,
    min,
    max,
    isDateDisabled,
    weekStartsOn,
  });

  const [isOpen, setIsOpenState] = useState(false);

  const selectedDate = picker.state.selectedDate;
  const displayValue = selectedDate ? formatSelectedDate(selectedDate, props.dateFormat) : '';

  const setOpen = useCallback((nextOpen: boolean): void => {
    setIsOpenState((previous) => {
      if (previous === nextOpen) {
        return previous;
      }

      if (nextOpen) {
        props.onCalendarOpen?.();
      } else {
        props.onCalendarClose?.();
      }

      return nextOpen;
    });
  }, [props.onCalendarClose, props.onCalendarOpen]);

  const openCalendar = useCallback((): void => {
    if (!props.disabled && !props.readOnly && !props.inline) {
      setOpen(true);
    }
  }, [props.disabled, props.inline, props.readOnly, setOpen]);

  const closeCalendar = useCallback((): void => {
    if (!props.inline) {
      setOpen(false);
    }
  }, [props.inline, setOpen]);

  useEffect(() => {
    if (typeof controlledValue === 'undefined') {
      return;
    }

    if (controlledValue === null) {
      picker.setValue(null);
      return;
    }

    picker.setValue(parseBsDate(controlledValue));
  }, [controlledValue]);

  useEffect(() => {
    if (!isOpen || props.inline) {
      return;
    }

    const onPointerDown = (event: MouseEvent): void => {
      if (!rootRef.current || rootRef.current.contains(event.target as Node)) {
        return;
      }

      closeCalendar();
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [closeCalendar, isOpen, props.inline]);

  const selectDate = (date: BsDate): void => {
    if (props.disabled || isDateDisabled(date)) {
      return;
    }

    picker.setValue(date);
    props.onChange?.(date);

    if (shouldCloseOnSelect) {
      closeCalendar();
    }
  };

  const clearValue = (): void => {
    if (props.disabled || props.readOnly) {
      return;
    }

    picker.setValue(null);
    props.onChange?.(null);
  };

  const calendar = (
    <CalendarView
      calendarId={calendarId}
      picker={picker}
      props={props}
      disabled={Boolean(props.disabled)}
      isDateDisabled={isDateDisabled}
      onSelectDate={selectDate}
    />
  );

  if (props.inline) {
    return (
      <div className={joinClassNames('nepali-date-picker nepali-date-picker--inline', props.className)} ref={rootRef}>
        {calendar}
      </div>
    );
  }

  return (
    <div className={joinClassNames('nepali-date-picker', props.className)} ref={rootRef}>
      <div className="nepali-date-picker__input-shell">
        {renderInput(props, displayValue, openCalendar)}
        {props.showIcon && (
          <button
            aria-label="Open calendar"
            className="nepali-date-picker__icon-button"
            disabled={props.disabled || props.readOnly}
            onClick={props.toggleCalendarOnIconClick ? () => {
              if (!props.readOnly) {
                setOpen(!isOpen);
              }
            } : openCalendar}
            type="button"
          >
            {typeof props.icon === 'string' ? <span className={props.icon} aria-hidden="true" /> : props.icon ?? 'Cal'}
          </button>
        )}
        {props.isClearable && selectedDate && (
          <button
            aria-label="Clear selected date"
            className="nepali-date-picker__clear-button"
            disabled={props.disabled || props.readOnly}
            onClick={clearValue}
            type="button"
          >
            x
          </button>
        )}
      </div>
      {isOpen && (
        <div className={joinClassNames('nepali-date-picker__popper', props.popperClassName)} id={calendarId}>
          {calendar}
        </div>
      )}
    </div>
  );
}

interface CalendarViewProps {
  calendarId: string;
  picker: ReturnType<typeof useNepaliDatePickerState>;
  props: NepaliDatePickerProps;
  disabled: boolean;
  isDateDisabled: (date: BsDate) => boolean;
  onSelectDate: (date: BsDate) => void;
}

function CalendarView({ calendarId, picker, props, disabled, isDateDisabled, onSelectDate }: CalendarViewProps) {
  const monthNames = props.monthNames ?? MONTH_NAMES;
  const weekdayNames = props.weekdayNames ?? WEEKDAY_NAMES;
  const weekdayShortNames = props.weekdayShortNames ?? WEEKDAY_SHORT_NAMES;
  const renderHeader = props.renderCustomHeader ?? props.renderHeader;
  const headerProps = createHeaderProps(picker, monthNames);
  const orderedWeekdays = getOrderedWeekdays(picker.state.weekStartsOn);

  return (
    <div
      aria-disabled={disabled || undefined}
      className={joinClassNames('nepali-date-picker__calendar', props.calendarClassName)}
      id={calendarId}
    >
      {renderHeader ? renderHeader(headerProps) : (
        <div className="nepali-date-picker__header">
          <button
            aria-label="Previous month"
            className="nepali-date-picker__nav-button"
            disabled={disabled || headerProps.prevMonthButtonDisabled}
            onClick={picker.goToPreviousMonth}
            type="button"
          >
            {props.previousMonthLabel ?? '<'}
          </button>
          <strong className="nepali-date-picker__current-month">
            {headerProps.monthName} {headerProps.viewYear}
          </strong>
          <button
            aria-label="Next month"
            className="nepali-date-picker__nav-button"
            disabled={disabled || headerProps.nextMonthButtonDisabled}
            onClick={picker.goToNextMonth}
            type="button"
          >
            {props.nextMonthLabel ?? '>'}
          </button>
        </div>
      )}
      <table className="nepali-date-picker__table">
        <thead>
          <tr>
            {orderedWeekdays.map((day, index) => {
              const dayNameProps = {
                day,
                shortName: weekdayShortNames[day] ?? String(day),
                fullName: weekdayNames[day] ?? String(day),
                index,
              };

              return (
                <th
                  className={joinClassNames('nepali-date-picker__weekday', props.weekDayClassName?.(day))}
                  key={day}
                  scope="col"
                >
                  {props.renderCustomDayName ? props.renderCustomDayName(dayNameProps) : dayNameProps.shortName}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {picker.grid.weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((cell) => (
                <td className="nepali-date-picker__cell" key={`${cell.date.year}-${cell.date.month}-${cell.date.day}`}>
                  <button
                    aria-current={cell.isToday ? 'date' : undefined}
                    aria-pressed={cell.isSelected}
                    className={joinClassNames(
                      'nepali-date-picker__day',
                      cell.inCurrentMonth ? 'nepali-date-picker__day--current-month' : 'nepali-date-picker__day--outside-month',
                      cell.isSelected && 'nepali-date-picker__day--selected',
                      cell.isToday && 'nepali-date-picker__day--today',
                      cell.isFocused && 'nepali-date-picker__day--focused',
                      cell.isDisabled && 'nepali-date-picker__day--disabled',
                      props.dayClassName?.(cell.date, cell),
                    )}
                    disabled={disabled || cell.isDisabled || isDateDisabled(cell.date)}
                    onClick={() => onSelectDate(cell.date)}
                    onKeyDown={(event) => handleDayKeyDown(event, picker, cell, onSelectDate)}
                    type="button"
                  >
                    {props.renderDayContents
                      ? props.renderDayContents(cell.date.day, cell.date, cell)
                      : cell.date.day}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {props.children && <div className="nepali-date-picker__children">{props.children}</div>}
    </div>
  );
}

function renderInput(props: NepaliDatePickerProps, displayValue: string, openCalendar: () => void): ReactNode {
  const inputProps: NepaliDatePickerCustomInputProps = {
    value: displayValue,
    placeholder: props.placeholderText,
    disabled: props.disabled,
    readOnly: props.readOnly ?? true,
    onClick: openCalendar,
    onFocus: openCalendar,
  };

  if (props.customInput && isValidElement(props.customInput)) {
    return cloneElement(props.customInput, inputProps, displayValue || props.placeholderText || 'Select date');
  }

  return (
    <input
      aria-haspopup="dialog"
      className={joinClassNames('nepali-date-picker__input', props.inputClassName)}
      disabled={props.disabled}
      onClick={openCalendar}
      onFocus={openCalendar}
      placeholder={props.placeholderText}
      readOnly
      type="text"
      value={displayValue}
    />
  );
}

function createHeaderProps(
  picker: ReturnType<typeof useNepaliDatePickerState>,
  monthNames: readonly string[],
): NepaliDatePickerHeaderProps {
  const monthDate = { year: picker.state.viewYear, month: picker.state.viewMonth, day: 1 };

  return {
    date: monthDate,
    viewYear: picker.state.viewYear,
    viewMonth: picker.state.viewMonth,
    monthName: monthNames[picker.state.viewMonth - 1] ?? String(picker.state.viewMonth),
    decreaseMonth: picker.goToPreviousMonth,
    increaseMonth: picker.goToNextMonth,
    changeYear: (year) => picker.focusDate({
      year,
      month: picker.state.viewMonth,
      day: Math.min(picker.state.focusedDate.day, daysInMonth(year, picker.state.viewMonth)),
    }),
    changeMonth: (month) => picker.focusDate({
      year: picker.state.viewYear,
      month,
      day: Math.min(picker.state.focusedDate.day, daysInMonth(picker.state.viewYear, month)),
    }),
    prevMonthButtonDisabled: isMonthOutsideRange(picker.state.viewYear, picker.state.viewMonth - 1, picker.state.constraints.min, 'previous'),
    nextMonthButtonDisabled: isMonthOutsideRange(picker.state.viewYear, picker.state.viewMonth + 1, picker.state.constraints.max, 'next'),
  };
}

function handleDayKeyDown(
  event: KeyboardEvent<HTMLButtonElement>,
  picker: ReturnType<typeof useNepaliDatePickerState>,
  cell: MonthGridCell,
  onSelectDate: (date: BsDate) => void,
): void {
  const key = event.key;

  if (
    key === 'ArrowLeft' ||
    key === 'ArrowRight' ||
    key === 'ArrowUp' ||
    key === 'ArrowDown' ||
    key === 'Home' ||
    key === 'End' ||
    key === 'PageUp' ||
    key === 'PageDown'
  ) {
    event.preventDefault();
    picker.navigate(key, { shiftKey: event.shiftKey });
  }

  if ((key === 'Enter' || key === ' ') && !cell.isDisabled) {
    event.preventDefault();
    onSelectDate(cell.date);
  }
}

function formatSelectedDate(date: BsDate, dateFormat?: DateFormatter): string {
  if (typeof dateFormat === 'function') {
    return dateFormat(date);
  }

  return formatBsDate(date, dateFormat ?? 'YYYY-MM-DD');
}

function toDateKeySet(dates?: BsDateInput[]): Set<string> | undefined {
  if (!dates) {
    return undefined;
  }

  return new Set(dates.map((date) => formatBsDate(date)));
}

function getOrderedWeekdays(weekStartsOn: WeekdayIndex): WeekdayIndex[] {
  return Array.from({ length: 7 }, (_, index) => ((weekStartsOn + index) % 7) as WeekdayIndex);
}

function isMonthOutsideRange(
  year: number,
  month: number,
  boundary: BsDate | undefined,
  direction: 'previous' | 'next',
): boolean {
  if (!boundary) {
    return false;
  }

  const normalized = normalizeYearMonth(year, month);

  if (direction === 'previous') {
    const monthEnd = {
      ...normalized,
      day: daysInMonth(normalized.year, normalized.month),
    };

    return compareBsDate(monthEnd, boundary) < 0;
  }

  const monthStart = { ...normalized, day: 1 };
  return compareBsDate(monthStart, boundary) > 0;
}

function normalizeYearMonth(year: number, month: number): Pick<BsDate, 'year' | 'month'> {
  let nextYear = year;
  let nextMonth = month;

  while (nextMonth < 1) {
    nextMonth += 12;
    nextYear -= 1;
  }

  while (nextMonth > 12) {
    nextMonth -= 12;
    nextYear += 1;
  }

  return { year: nextYear, month: nextMonth };
}

function joinClassNames(...classNames: Array<string | false | null | undefined>): string | undefined {
  const joined = classNames.filter(Boolean).join(' ');
  return joined || undefined;
}
