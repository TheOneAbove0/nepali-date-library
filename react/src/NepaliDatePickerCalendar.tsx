import { formatBsDate, type BsDate } from 'nepali-date-library';
import type { MonthGridCell } from 'nepali-date-library/datepicker-core';
import type { KeyboardEvent } from 'react';
import type { UseNepaliDatePickerResult } from './useNepaliDatePicker';
import { ChevronLeftIcon, ChevronRightIcon } from './NepaliDatePicker.icons';
import {
  DEFAULT_DECADE_SIZE,
  MONTH_NAMES,
  WEEKDAY_NAMES,
  WEEKDAY_SHORT_NAMES,
  type HolidayMeta,
  type NepaliDatePickerHeaderProps,
  type NepaliDatePickerLevel,
  type NepaliDatePickerProps,
  type NepaliDatePickerSelectionType,
  type NepaliDatePickerType,
  type NepaliNumeralSystem,
  type RangeValue,
} from './NepaliDatePicker.types';
import {
  canSelectMonth,
  canSelectYear,
  createComparableValue,
  createDecadeYears,
  formatNumericValue,
  getDecadeBounds,
  getOrderedWeekdays,
  getSupportedDaysInMonth,
  getSlotClassName,
  getSlotStyle,
  isYearSupportedByData,
  isDateWithinRange,
  isDecadeOutsideRange,
  isMonthOutsideRange,
  isSameDate,
  isSameMonth,
  isSameYear,
  isYearOutsideRange,
  joinClassNames,
  findFirstSelectableDateInMonth,
  findFirstSelectableDateInYear,
} from './NepaliDatePicker.utils';

interface CalendarViewProps {
  calendarId: string;
  picker: UseNepaliDatePickerResult;
  props: NepaliDatePickerProps;
  pickerType: NepaliDatePickerType;
  numeralSystem: NepaliNumeralSystem;
  selectionType: NepaliDatePickerSelectionType;
  calendarLevel: NepaliDatePickerLevel;
  disabled: boolean;
  holidays: Map<string, HolidayMeta>;
  isDateDisabled: (date: BsDate) => boolean;
  rangeValue: RangeValue;
  onSelectDate: (date: BsDate) => void;
  onChangeLevel: (level: NepaliDatePickerLevel) => void;
  closeCalendar: () => void;
}

export function CalendarView({
  calendarId,
  picker,
  props,
  pickerType,
  numeralSystem,
  selectionType,
  calendarLevel,
  disabled,
  holidays,
  isDateDisabled,
  rangeValue,
  onSelectDate,
  onChangeLevel,
  closeCalendar,
}: CalendarViewProps) {
  const monthNames = props.monthNames ?? MONTH_NAMES;
  const weekdayNames = props.weekdayNames ?? WEEKDAY_NAMES;
  const weekdayShortNames = props.weekdayShortNames ?? WEEKDAY_SHORT_NAMES;
  const renderHeader = props.renderCustomHeader ?? props.renderHeader;
  const orderedWeekdays = getOrderedWeekdays(picker.state.weekStartsOn);
  const headerProps = createHeaderProps({
    picker,
    pickerType,
    numeralSystem,
    calendarLevel,
    monthNames,
    onChangeLevel,
    disabled,
    isDateDisabled,
  });

  return (
    <div
      aria-disabled={disabled || undefined}
      className={getSlotClassName(
        props,
        'calendar',
        'nepali-date-picker__calendar',
        props.calendarClassName,
      )}
      id={calendarId}
      style={getSlotStyle(props, 'calendar')}
    >
      {renderHeader ? (
        renderHeader(headerProps)
      ) : (
        <div
          className={getSlotClassName(props, 'header', 'nepali-date-picker__header')}
          style={getSlotStyle(props, 'header')}
        >
          <button
            aria-label="Previous period"
            className={getSlotClassName(props, 'navButton', 'nepali-date-picker__nav-button')}
            disabled={headerProps.prevButtonDisabled}
            onClick={headerProps.decrease}
            style={getSlotStyle(props, 'navButton')}
            type="button"
          >
            {props.previousMonthLabel ?? <ChevronLeftIcon />}
          </button>
          <button
            className={getSlotClassName(props, 'headerLabel', 'nepali-date-picker__header-label')}
            onClick={() => {
              if (calendarLevel === 'day') {
                headerProps.openMonthLevel();
                return;
              }

              if (calendarLevel === 'month' && pickerType !== 'year') {
                headerProps.openYearLevel();
              }
            }}
            style={getSlotStyle(props, 'headerLabel')}
            type="button"
          >
            {headerProps.label}
          </button>
          <button
            aria-label="Next period"
            className={getSlotClassName(props, 'navButton', 'nepali-date-picker__nav-button')}
            disabled={headerProps.nextButtonDisabled}
            onClick={headerProps.increase}
            style={getSlotStyle(props, 'navButton')}
            type="button"
          >
            {props.nextMonthLabel ?? <ChevronRightIcon />}
          </button>
        </div>
      )}

      {calendarLevel === 'day' && (
        <table
          className={getSlotClassName(props, 'table', 'nepali-date-picker__table')}
          style={getSlotStyle(props, 'table')}
        >
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
                    className={joinClassNames(
                      getSlotClassName(props, 'weekday', 'nepali-date-picker__weekday'),
                      props.weekDayClassName?.(day),
                    )}
                    key={day}
                    scope="col"
                    style={getSlotStyle(props, 'weekday')}
                  >
                    {props.renderCustomDayName
                      ? props.renderCustomDayName(dayNameProps)
                      : dayNameProps.shortName}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {picker.grid.weeks.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((cell) => {
                  const holiday = holidays.get(formatBsDate(cell.date));
                  const isRangeStart =
                    selectionType === 'range' && isSameDate(rangeValue[0], cell.date);
                  const isRangeEnd =
                    selectionType === 'range' && isSameDate(rangeValue[1], cell.date);
                  const isInRange =
                    selectionType === 'range' && isDateWithinRange(cell.date, rangeValue);
                  const isSelected =
                    selectionType === 'range' ? isRangeStart || isRangeEnd : cell.isSelected;

                  return (
                    <td
                      className={getSlotClassName(props, 'cell', 'nepali-date-picker__cell')}
                      key={`${cell.date.year}-${cell.date.month}-${cell.date.day}`}
                      style={getSlotStyle(props, 'cell')}
                    >
                      <button
                        aria-current={cell.isToday ? 'date' : undefined}
                        aria-pressed={isSelected}
                        className={joinClassNames(
                          getSlotClassName(props, 'day', 'nepali-date-picker__day'),
                          cell.inCurrentMonth
                            ? 'nepali-date-picker__day--current-month'
                            : 'nepali-date-picker__day--outside-month',
                          isSelected && 'nepali-date-picker__day--selected',
                          isRangeStart && 'nepali-date-picker__day--range-start',
                          isRangeEnd && 'nepali-date-picker__day--range-end',
                          isInRange && 'nepali-date-picker__day--in-range',
                          cell.isToday && 'nepali-date-picker__day--today',
                          cell.isFocused && 'nepali-date-picker__day--focused',
                          cell.isDisabled && 'nepali-date-picker__day--disabled',
                          holiday && 'nepali-date-picker__day--holiday',
                          holiday?.className,
                          props.dayClassName?.(cell.date, cell),
                        )}
                        data-disabled={cell.isDisabled || isDateDisabled(cell.date) || undefined}
                        data-holiday={Boolean(holiday) || undefined}
                        data-in-range={isInRange || undefined}
                        data-outside-month={!cell.inCurrentMonth || undefined}
                        data-range-end={isRangeEnd || undefined}
                        data-range-start={isRangeStart || undefined}
                        data-selected={isSelected || undefined}
                        data-today={cell.isToday || undefined}
                        disabled={disabled || cell.isDisabled || isDateDisabled(cell.date)}
                        onClick={() => onSelectDate(cell.date)}
                        onKeyDown={(event) => handleDayKeyDown(event, picker, cell, onSelectDate)}
                        style={getSlotStyle(props, 'day')}
                        title={holiday?.label}
                        type="button"
                      >
                        {props.renderDayContents
                          ? props.renderDayContents(cell.date.day, cell.date, cell)
                          : formatNumericValue(cell.date.day, numeralSystem)}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {calendarLevel === 'month' && (
        <div
          className={getSlotClassName(
            props,
            'monthGrid',
            'nepali-date-picker__grid',
            'nepali-date-picker__grid--month',
          )}
          style={getSlotStyle(props, 'monthGrid')}
        >
          {monthNames.map((monthName, index) => {
            const month = index + 1;
            const value = createComparableValue(picker.state.viewYear, month, 'month');
            const isSelected = isSameMonth(picker.state.selectedDate, picker.state.viewYear, month);
            const monthDisabled = !canSelectMonth(picker.state.viewYear, month, isDateDisabled);

            return (
              <button
                className={joinClassNames(
                  getSlotClassName(props, 'tile', 'nepali-date-picker__tile'),
                  isSelected && 'nepali-date-picker__tile--selected',
                  monthDisabled && 'nepali-date-picker__tile--disabled',
                )}
                data-disabled={monthDisabled || undefined}
                data-level="month"
                data-selected={isSelected || undefined}
                disabled={disabled || monthDisabled}
                key={month}
                onClick={() =>
                  handleMonthPick({
                    picker,
                    pickerType,
                    year: value.year,
                    month: value.month,
                    isDateDisabled,
                    onSelectDate,
                    onChangeLevel,
                  })
                }
                style={getSlotStyle(props, 'tile')}
                type="button"
              >
                {monthName}
              </button>
            );
          })}
        </div>
      )}

      {calendarLevel === 'year' && (
        <div
          className={getSlotClassName(
            props,
            'yearGrid',
            'nepali-date-picker__grid',
            'nepali-date-picker__grid--year',
          )}
          style={getSlotStyle(props, 'yearGrid')}
        >
          {createDecadeYears(picker.state.viewYear)
            .filter((year) => isYearSupportedByData(year))
            .map((year) => {
              const isSelected = isSameYear(picker.state.selectedDate, year);
              const yearDisabled = !canSelectYear(year, isDateDisabled);

              return (
                <button
                  className={joinClassNames(
                    getSlotClassName(props, 'tile', 'nepali-date-picker__tile'),
                    isSelected && 'nepali-date-picker__tile--selected',
                    yearDisabled && 'nepali-date-picker__tile--disabled',
                  )}
                  data-disabled={yearDisabled || undefined}
                  data-level="year"
                  data-selected={isSelected || undefined}
                  disabled={disabled || yearDisabled}
                  key={year}
                  onClick={() =>
                    handleYearPick({
                      picker,
                      pickerType,
                      year,
                      isDateDisabled,
                      onSelectDate,
                      onChangeLevel,
                    })
                  }
                  style={getSlotStyle(props, 'tile')}
                  type="button"
                >
                  {formatNumericValue(year, numeralSystem)}
                </button>
              );
            })}
        </div>
      )}

      {props.children && (
        <div
          className={getSlotClassName(props, 'children', 'nepali-date-picker__children')}
          style={getSlotStyle(props, 'children')}
        >
          {typeof props.children === 'function'
            ? props.children({ closeCalendar })
            : props.children}
        </div>
      )}
    </div>
  );
}

function createHeaderProps({
  picker,
  pickerType,
  numeralSystem,
  calendarLevel,
  monthNames,
  onChangeLevel,
  disabled,
  isDateDisabled,
}: {
  picker: UseNepaliDatePickerResult;
  pickerType: NepaliDatePickerType;
  numeralSystem: NepaliNumeralSystem;
  calendarLevel: NepaliDatePickerLevel;
  monthNames: readonly string[];
  onChangeLevel: (level: NepaliDatePickerLevel) => void;
  disabled: boolean;
  isDateDisabled: (date: BsDate) => boolean;
}): NepaliDatePickerHeaderProps {
  const monthDate = { year: picker.state.viewYear, month: picker.state.viewMonth, day: 1 };
  const decade = getDecadeBounds(picker.state.viewYear);
  const monthName = monthNames[picker.state.viewMonth - 1] ?? String(picker.state.viewMonth);
  const decadeLabel = `${formatNumericValue(decade.start, numeralSystem)} - ${formatNumericValue(decade.end, numeralSystem)}`;

  if (calendarLevel === 'month') {
    return {
      date: monthDate,
      label: formatNumericValue(picker.state.viewYear, numeralSystem),
      level: calendarLevel,
      pickerType,
      viewYear: picker.state.viewYear,
      viewMonth: picker.state.viewMonth,
      monthName,
      decadeLabel,
      decrease: () => {
        const targetYear = picker.state.viewYear - 1;
        const fallbackDate = findFirstSelectableDateInYear(targetYear, isDateDisabled);
        if (fallbackDate) {
          picker.focusDate({
            year: targetYear,
            month: canSelectMonth(targetYear, picker.state.viewMonth, isDateDisabled)
              ? picker.state.viewMonth
              : fallbackDate.month,
            day: 1,
          });
        }
      },
      increase: () => {
        const targetYear = picker.state.viewYear + 1;
        const fallbackDate = findFirstSelectableDateInYear(targetYear, isDateDisabled);
        if (fallbackDate) {
          picker.focusDate({
            year: targetYear,
            month: canSelectMonth(targetYear, picker.state.viewMonth, isDateDisabled)
              ? picker.state.viewMonth
              : fallbackDate.month,
            day: 1,
          });
        }
      },
      openMonthLevel: () => onChangeLevel('month'),
      openYearLevel: () => onChangeLevel('year'),
      changeYear: (year) => picker.focusDate({ year, month: picker.state.viewMonth, day: 1 }),
      changeMonth: (month) => picker.focusDate({ year: picker.state.viewYear, month, day: 1 }),
      prevButtonDisabled: disabled || isYearOutsideRange(picker.state.viewYear - 1, isDateDisabled),
      nextButtonDisabled: disabled || isYearOutsideRange(picker.state.viewYear + 1, isDateDisabled),
    };
  }

  if (calendarLevel === 'year') {
    return {
      date: monthDate,
      label: decadeLabel,
      level: calendarLevel,
      pickerType,
      viewYear: picker.state.viewYear,
      viewMonth: picker.state.viewMonth,
      monthName,
      decadeLabel,
      decrease: () => {
        const prevDecadeStart = decade.start - DEFAULT_DECADE_SIZE;
        const validYears = createDecadeYears(prevDecadeStart).filter((y) =>
          canSelectYear(y, isDateDisabled),
        );
        if (validYears.length > 0) {
          const targetYear = validYears[validYears.length - 1] ?? picker.state.viewYear;
          const fallbackDate = findFirstSelectableDateInYear(targetYear, isDateDisabled);
          if (fallbackDate) {
            picker.focusDate({
              year: targetYear,
              month: canSelectMonth(targetYear, picker.state.viewMonth, isDateDisabled)
                ? picker.state.viewMonth
                : fallbackDate.month,
              day: 1,
            });
          }
        }
      },
      increase: () => {
        const nextDecadeStart = decade.start + DEFAULT_DECADE_SIZE;
        const validYears = createDecadeYears(nextDecadeStart).filter((y) =>
          canSelectYear(y, isDateDisabled),
        );
        if (validYears.length > 0) {
          const targetYear = validYears[0] ?? picker.state.viewYear;
          const fallbackDate = findFirstSelectableDateInYear(targetYear, isDateDisabled);
          if (fallbackDate) {
            picker.focusDate({
              year: targetYear,
              month: canSelectMonth(targetYear, picker.state.viewMonth, isDateDisabled)
                ? picker.state.viewMonth
                : fallbackDate.month,
              day: 1,
            });
          }
        }
      },
      openMonthLevel: () => onChangeLevel('month'),
      openYearLevel: () => onChangeLevel('year'),
      changeYear: (year) => picker.focusDate({ year, month: picker.state.viewMonth, day: 1 }),
      changeMonth: (month) => picker.focusDate({ year: picker.state.viewYear, month, day: 1 }),
      prevButtonDisabled:
        disabled || isDecadeOutsideRange(decade.start - DEFAULT_DECADE_SIZE, isDateDisabled),
      nextButtonDisabled:
        disabled || isDecadeOutsideRange(decade.start + DEFAULT_DECADE_SIZE, isDateDisabled),
    };
  }

  return {
    date: monthDate,
    label: `${monthName} ${formatNumericValue(picker.state.viewYear, numeralSystem)}`,
    level: calendarLevel,
    pickerType,
    viewYear: picker.state.viewYear,
    viewMonth: picker.state.viewMonth,
    monthName,
    decadeLabel,
    decrease: picker.goToPreviousMonth,
    increase: picker.goToNextMonth,
    openMonthLevel: () => (pickerType === 'year' ? onChangeLevel('year') : onChangeLevel('month')),
    openYearLevel: () => onChangeLevel('year'),
    changeYear: (year) => {
      const monthDayCount = getSupportedDaysInMonth(year, picker.state.viewMonth);
      if (monthDayCount === null) {
        return;
      }

      picker.focusDate({
        year,
        month: picker.state.viewMonth,
        day: Math.min(picker.state.focusedDate.day, monthDayCount),
      });
    },
    changeMonth: (month) => {
      const monthDayCount = getSupportedDaysInMonth(picker.state.viewYear, month);
      if (monthDayCount === null) {
        return;
      }

      picker.focusDate({
        year: picker.state.viewYear,
        month,
        day: Math.min(picker.state.focusedDate.day, monthDayCount),
      });
    },
    prevButtonDisabled:
      disabled ||
      isMonthOutsideRange(picker.state.viewYear, picker.state.viewMonth - 1, isDateDisabled),
    nextButtonDisabled:
      disabled ||
      isMonthOutsideRange(picker.state.viewYear, picker.state.viewMonth + 1, isDateDisabled),
  };
}

function handleMonthPick({
  picker,
  pickerType,
  year,
  month,
  isDateDisabled,
  onSelectDate,
  onChangeLevel,
}: {
  picker: UseNepaliDatePickerResult;
  pickerType: NepaliDatePickerType;
  year: number;
  month: number;
  isDateDisabled: (date: BsDate) => boolean;
  onSelectDate: (date: BsDate) => void;
  onChangeLevel: (level: NepaliDatePickerLevel) => void;
}) {
  const candidate = findFirstSelectableDateInMonth(year, month, isDateDisabled);
  if (!candidate) {
    return;
  }

  if (pickerType === 'month') {
    onSelectDate({ year, month, day: 1 });
    return;
  }

  picker.focusDate(candidate);
  onChangeLevel('day');
}

function handleYearPick({
  picker,
  pickerType,
  year,
  isDateDisabled,
  onSelectDate,
  onChangeLevel,
}: {
  picker: UseNepaliDatePickerResult;
  pickerType: NepaliDatePickerType;
  year: number;
  isDateDisabled: (date: BsDate) => boolean;
  onSelectDate: (date: BsDate) => void;
  onChangeLevel: (level: NepaliDatePickerLevel) => void;
}) {
  if (pickerType === 'year') {
    const candidate = findFirstSelectableDateInYear(year, isDateDisabled);
    if (candidate) {
      onSelectDate({ year: candidate.year, month: 1, day: 1 });
    }
    return;
  }

  const month = picker.state.viewMonth;
  const candidate =
    findFirstSelectableDateInMonth(year, month, isDateDisabled) ??
    findFirstSelectableDateInYear(year, isDateDisabled);
  if (!candidate) {
    return;
  }

  picker.focusDate(candidate);
  onChangeLevel('month');
}

function handleDayKeyDown(
  event: KeyboardEvent<HTMLButtonElement>,
  picker: UseNepaliDatePickerResult,
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
