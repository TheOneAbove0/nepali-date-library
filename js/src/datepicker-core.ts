import { daysInMonth, toBS, toAD } from './conversion';
import { addBsDays, addBsMonths, compareBsDate } from './manipulation';
import { parseBsDate } from './parsers';
import type { BsDate, BsDateInput } from './types';

export { addBsDays, addBsMonths, compareBsDate } from './manipulation';

/** Represents a 0-indexed day of the week (0 = Sunday, 6 = Saturday). */
export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Indicates whether a day in the calendar grid belongs to the previous, current, or next month. */
export type DayOwner = 'prev' | 'current' | 'next';

/** Allowed keyboard navigation keys for the date picker grid. */
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

/**
 * Configuration options for restricting selectable dates.
 */
export interface DateConstraints {
  /** The minimum selectable date (inclusive). */
  min?: BsDateInput;
  /** The maximum selectable date (inclusive). */
  max?: BsDateInput;
  /** A predicate function to dynamically disable specific dates. */
  isDisabled?: (date: BsDate) => boolean;
}

/**
 * Internal representation of DateConstraints with fully parsed BsDate objects.
 */
export interface NormalizedDateConstraints {
  min?: BsDate;
  max?: BsDate;
  isDisabled?: (date: BsDate) => boolean;
}

/**
 * Options to configure how the month grid is generated.
 */
export interface MonthGridOptions {
  /** The starting day of the week (default is 0 for Sunday). */
  weekStartsOn?: WeekdayIndex;
  constraints?: DateConstraints;
  selectedDate?: BsDateInput | null;
  focusedDate?: BsDateInput | null;
  /** The date to consider as 'today'. Defaults to the current system date converted to BS. */
  today?: BsDateInput;
}

/**
 * Represents a single day cell within a calendar month grid.
 */
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

/**
 * Represents a full month grid, including leading/trailing days from adjacent months to complete weeks.
 */
export interface MonthGrid {
  year: number;
  month: number;
  weekStartsOn: WeekdayIndex;
  weeks: MonthGridCell[][];
}

/**
 * Encapsulates the complete state required to render and navigate a date picker.
 */
export interface DatePickerState {
  viewYear: number;
  viewMonth: number;
  focusedDate: BsDate;
  selectedDate: BsDate | null;
  weekStartsOn: WeekdayIndex;
  constraints: NormalizedDateConstraints;
}

/**
 * Options to initialize the date picker state.
 */
export interface CreateDatePickerStateOptions {
  weekStartsOn?: WeekdayIndex;
  constraints?: DateConstraints;
  focusedDate?: BsDateInput;
  selectedDate?: BsDateInput;
  viewYear?: number;
  viewMonth?: number;
  today?: BsDateInput;
}

/** Keyboard navigation behavior modifiers. */
export interface KeyNavigationOptions {
  /** If true, certain navigation keys (like PageUp/PageDown) might jump by larger increments (e.g., a year). */
  shiftKey?: boolean;
}

/**
 * Parses raw `DateConstraints` inputs into fully parsed `BsDate` objects.
 * Ensures the `min` date is not after the `max` date.
 * @param constraints - The constraints to normalize.
 * @returns A normalized object of parsed constraints.
 * @throws Error if min date is after max date.
 */
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

/**
 * Checks if a given BS date falls outside the min/max bounds.
 * @param date - The date to check.
 * @param constraints - The parsed constraints.
 * @returns True if out of bounds, false otherwise.
 */
export function isDateOutOfRange(date: BsDate, constraints?: NormalizedDateConstraints): boolean {
  if (!constraints) return false;
  if (constraints.min && compareBsDate(date, constraints.min) < 0) return true;
  if (constraints.max && compareBsDate(date, constraints.max) > 0) return true;
  return false;
}

/**
 * Checks if a given BS date is completely disabled (either out of bounds or failing the predicate).
 * @param date - The date to check.
 * @param constraints - The parsed constraints.
 * @returns True if disabled, false otherwise.
 */
export function isDateDisabled(date: BsDate, constraints?: NormalizedDateConstraints): boolean {
  if (!constraints) return false;
  if (isDateOutOfRange(date, constraints)) return true;
  return Boolean(constraints.isDisabled && constraints.isDisabled(date));
}

/**
 * Clamps a given BS date to ensure it falls within the given min and max constraints.
 * @param date - The raw input date.
 * @param constraints - The parsed constraints.
 * @returns A parsed BsDate constrained to the bounds.
 */
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

/**
 * Generates a full month calendar grid, including the leading and trailing days required
 * to form complete weeks.
 * @param year - The BS year for the grid.
 * @param month - The BS month for the grid.
 * @param options - Additional options like start day of the week, constraints, and selected state.
 * @returns A structured `MonthGrid` object containing rows of weeks.
 */
export function generateMonthGrid(
  year: number,
  month: number,
  options: MonthGridOptions = {},
): MonthGrid {
  const weekStartsOn = normalizeWeekday(options.weekStartsOn);
  const constraints = normalizeConstraints(options.constraints);

  const currentMonthStart: BsDate = { year, month, day: 1 };
  const currentMonthEnd: BsDate = {
    year,
    month,
    day: daysInMonth(year, month),
  };

  const selectedDate = options.selectedDate ? parseBsDate(options.selectedDate) : null;
  const focusedDate = options.focusedDate ? parseBsDate(options.focusedDate) : null;
  const today = options.today ? parseBsDate(options.today) : toBS(new Date());

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

/**
 * Initializes the date picker core state engine.
 * @param options - Initialization options including constraints, default values, and focus preferences.
 * @returns A complete `DatePickerState`.
 */
export function createDatePickerState(options: CreateDatePickerStateOptions = {}): DatePickerState {
  const constraints = normalizeConstraints(options.constraints);
  const weekStartsOn = normalizeWeekday(options.weekStartsOn);

  const today = options.today ? parseBsDate(options.today) : toBS(new Date());
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

/**
 * Handles keyboard navigation within a date picker grid, computing the next state based on the pressed key.
 * Resolves the next valid focusable date, skipping disabled dates.
 * @param state - The current `DatePickerState`.
 * @param key - The navigation key pressed (e.g. 'ArrowRight', 'PageDown').
 * @param options - Additional modifiers like `shiftKey`.
 * @returns The computed next `DatePickerState`.
 */
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
  const ad = toAD(date.year, date.month, date.day);
  return new Date(Date.UTC(ad.year, ad.month - 1, ad.day)).getUTCDay() as WeekdayIndex;
}
