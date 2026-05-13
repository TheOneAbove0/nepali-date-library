import { daysInMonth, toBik, toGreg } from './conversion';
import { addBsDays, addBsMonths, compareBsDate } from './manipulation';
import { parseBsDate } from './parsers';
import type { BsDate, BsDateInput } from './types';

export { addBsDays, addBsMonths, compareBsDate } from './manipulation';

export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type DayOwner = 'prev' | 'current' | 'next';
export type DatePickerKey =
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'Home'
  | 'End'
  | 'PageUp'
  | 'PageDown'
  | 'Enter'
  | ' ';

export interface DateConstraints {
  min?: BsDateInput;
  max?: BsDateInput;
  isDisabled?: (date: BsDate) => boolean;
}

export interface NormalizedDateConstraints {
  min?: BsDate;
  max?: BsDate;
  isDisabled?: (date: BsDate) => boolean;
}

export interface MonthGridOptions {
  weekStartsOn?: WeekdayIndex;
  constraints?: DateConstraints;
  selectedDate?: BsDateInput | null;
  focusedDate?: BsDateInput | null;
  today?: BsDateInput;
}

export interface MonthGridCell {
  date: BsDate;
  owner: DayOwner;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isFocused: boolean;
  isOutOfRange: boolean;
  isDisabled: boolean;
}

export interface MonthGrid {
  year: number;
  month: number;
  weekStartsOn: WeekdayIndex;
  weeks: MonthGridCell[][];
}

export interface DatePickerState {
  viewYear: number;
  viewMonth: number;
  focusedDate: BsDate;
  selectedDate: BsDate | null;
  weekStartsOn: WeekdayIndex;
  constraints: NormalizedDateConstraints;
}

export interface CreateDatePickerStateOptions {
  weekStartsOn?: WeekdayIndex;
  constraints?: DateConstraints;
  focusedDate?: BsDateInput;
  selectedDate?: BsDateInput;
  viewYear?: number;
  viewMonth?: number;
  today?: BsDateInput;
}

export interface KeyNavigationOptions {
  shiftKey?: boolean;
}

export function normalizeConstraints(constraints?: DateConstraints): NormalizedDateConstraints {
  if (!constraints) {
    return {};
  }

  const min = constraints.min ? parseBsDate(constraints.min) : undefined;
  const max = constraints.max ? parseBsDate(constraints.max) : undefined;

  if (min && max && compareBsDate(min, max) > 0) {
    throw new Error('Invalid constraints: min date is after max date');
  }

  return {
    min,
    max,
    isDisabled: constraints.isDisabled,
  };
}

export function isDateOutOfRange(date: BsDate, constraints?: NormalizedDateConstraints): boolean {
  if (!constraints) return false;
  if (constraints.min && compareBsDate(date, constraints.min) < 0) return true;
  if (constraints.max && compareBsDate(date, constraints.max) > 0) return true;
  return false;
}

export function isDateDisabled(date: BsDate, constraints?: NormalizedDateConstraints): boolean {
  if (!constraints) return false;
  if (isDateOutOfRange(date, constraints)) return true;
  return Boolean(constraints.isDisabled && constraints.isDisabled(date));
}

export function clampBsDate(date: BsDateInput, constraints?: NormalizedDateConstraints): BsDate {
  const parsed = parseBsDate(date);
  if (!constraints) return parsed;

  if (constraints.min && compareBsDate(parsed, constraints.min) < 0) {
    return constraints.min;
  }

  if (constraints.max && compareBsDate(parsed, constraints.max) > 0) {
    return constraints.max;
  }

  return parsed;
}

export function generateMonthGrid(
  year: number,
  month: number,
  options: MonthGridOptions = {},
): MonthGrid {
  const weekStartsOn = normalizeWeekday(options.weekStartsOn);
  const constraints = normalizeConstraints(options.constraints);

  const currentMonthStart: BsDate = { year, month, day: 1 };
  const currentMonthEnd: BsDate = { year, month, day: daysInMonth(year, month) };

  const selectedDate = options.selectedDate ? parseBsDate(options.selectedDate) : null;
  const focusedDate = options.focusedDate ? parseBsDate(options.focusedDate) : null;
  const today = options.today ? parseBsDate(options.today) : toBik(new Date());

  const firstWeekday = getWeekday(currentMonthStart);
  const leadingDays = (firstWeekday - weekStartsOn + 7) % 7;
  const gridStart = addBsDays(currentMonthStart, -leadingDays);

  const totalCoreCells = leadingDays + currentMonthEnd.day;
  const trailingDays = (7 - (totalCoreCells % 7)) % 7;
  const totalCells = totalCoreCells + trailingDays;

  const weeks: MonthGridCell[][] = [];
  let week: MonthGridCell[] = [];

  for (let i = 0; i < totalCells; i += 1) {
    const cellDate = addBsDays(gridStart, i);

    const inCurrentMonth = cellDate.year === year && cellDate.month === month;
    const owner: DayOwner = inCurrentMonth
      ? 'current'
      : compareBsDate(cellDate, currentMonthStart) < 0
        ? 'prev'
        : 'next';

    const isOutOfRange = isDateOutOfRange(cellDate, constraints);
    const disabledByPredicate = Boolean(constraints.isDisabled && constraints.isDisabled(cellDate));

    week.push({
      date: cellDate,
      owner,
      inCurrentMonth,
      isToday: compareBsDate(cellDate, today) === 0,
      isSelected: Boolean(selectedDate && compareBsDate(cellDate, selectedDate) === 0),
      isFocused: Boolean(focusedDate && compareBsDate(cellDate, focusedDate) === 0),
      isOutOfRange,
      isDisabled: isOutOfRange || disabledByPredicate,
    });

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  return { year, month, weekStartsOn, weeks };
}

export function createDatePickerState(options: CreateDatePickerStateOptions = {}): DatePickerState {
  const constraints = normalizeConstraints(options.constraints);
  const weekStartsOn = normalizeWeekday(options.weekStartsOn);

  const today = options.today ? parseBsDate(options.today) : toBik(new Date());
  const baseFocusedDate = options.focusedDate
    ? parseBsDate(options.focusedDate)
    : options.selectedDate
      ? parseBsDate(options.selectedDate)
      : today;

  const focusedDate = clampBsDate(baseFocusedDate, constraints);
  const selectedDate = options.selectedDate ? clampBsDate(options.selectedDate, constraints) : null;

  return {
    viewYear: options.viewYear ?? focusedDate.year,
    viewMonth: options.viewMonth ?? focusedDate.month,
    focusedDate,
    selectedDate,
    weekStartsOn,
    constraints,
  };
}

export function navigateByKey(
  state: DatePickerState,
  key: DatePickerKey,
  options: KeyNavigationOptions = {},
): DatePickerState {
  let nextFocusedDate = state.focusedDate;

  if (key === 'ArrowLeft') {
    nextFocusedDate = moveByDelta(state, -1);
  } else if (key === 'ArrowRight') {
    nextFocusedDate = moveByDelta(state, 1);
  } else if (key === 'ArrowUp') {
    nextFocusedDate = moveByDelta(state, -7);
  } else if (key === 'ArrowDown') {
    nextFocusedDate = moveByDelta(state, 7);
  } else if (key === 'Home') {
    const weekday = getWeekday(state.focusedDate);
    const delta = -((weekday - state.weekStartsOn + 7) % 7);
    nextFocusedDate = moveByDelta(state, delta);
  } else if (key === 'End') {
    const weekday = getWeekday(state.focusedDate);
    const delta = 6 - ((weekday - state.weekStartsOn + 7) % 7);
    nextFocusedDate = moveByDelta(state, delta);
  } else if (key === 'PageUp') {
    const months = options.shiftKey ? -12 : -1;
    nextFocusedDate = moveByMonth(state, months);
  } else if (key === 'PageDown') {
    const months = options.shiftKey ? 12 : 1;
    nextFocusedDate = moveByMonth(state, months);
  }

  const nextState: DatePickerState = {
    ...state,
    focusedDate: nextFocusedDate,
    viewYear: nextFocusedDate.year,
    viewMonth: nextFocusedDate.month,
  };

  if (key === 'Enter' || key === ' ') {
    if (!isDateDisabled(nextState.focusedDate, nextState.constraints)) {
      nextState.selectedDate = nextState.focusedDate;
    }
  }

  return nextState;
}

function moveByMonth(state: DatePickerState, delta: number): BsDate {
  const candidate = addBsMonths(state.focusedDate, delta);
  return resolveNavigableDate(candidate, toDirection(delta), state.constraints);
}

function moveByDelta(state: DatePickerState, delta: number): BsDate {
  const candidate = addBsDays(state.focusedDate, delta);
  return resolveNavigableDate(candidate, toDirection(delta), state.constraints);
}

function resolveNavigableDate(
  start: BsDate,
  direction: 1 | -1,
  constraints: NormalizedDateConstraints,
): BsDate {
  let candidate = clampBsDate(start, constraints);

  if (!isDateDisabled(candidate, constraints)) {
    return candidate;
  }

  for (let i = 0; i < 3660; i += 1) {
    const nextCandidate = addBsDays(candidate, direction);
    if (compareBsDate(nextCandidate, candidate) === 0) {
      break;
    }

    candidate = clampBsDate(nextCandidate, constraints);
    if (!isDateDisabled(candidate, constraints)) {
      return candidate;
    }

    if (
      (constraints.min && compareBsDate(candidate, constraints.min) === 0) ||
      (constraints.max && compareBsDate(candidate, constraints.max) === 0)
    ) {
      break;
    }
  }

  return candidate;
}

function normalizeWeekday(value?: number): WeekdayIndex {
  if (typeof value === 'undefined') {
    return 0;
  }

  if (!Number.isInteger(value) || value < 0 || value > 6) {
    throw new Error(`Invalid weekStartsOn value ${String(value)}`);
  }

  return value as WeekdayIndex;
}

function toDirection(delta: number): 1 | -1 {
  return delta < 0 ? -1 : 1;
}

function getWeekday(date: BsDate): WeekdayIndex {
  const ad = toGreg(date.year, date.month, date.day);
  return new Date(Date.UTC(ad.year, ad.month - 1, ad.day)).getUTCDay() as WeekdayIndex;
}
