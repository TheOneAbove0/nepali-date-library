import { daysInBsMonth } from './calendar';
import { parseBsDate } from './parsers';
import type { BsDate, BsDateInput } from './types';

/**
 * Compares two Bikram Sambat dates.
 * @param a - The first date.
 * @param b - The second date.
 * @returns -1 if a < b, 1 if a > b, and 0 if they are exactly equal.
 */
export function compareBsDate(a: BsDate, b: BsDate): number {
  if (a.year !== b.year) return a.year < b.year ? -1 : 1;
  if (a.month !== b.month) return a.month < b.month ? -1 : 1;
  if (a.day !== b.day) return a.day < b.day ? -1 : 1;
  return 0;
}

/**
 * Adds a specific number of days to a BS date. Handles month and year rollovers.
 * @param date - The initial BS date.
 * @param daysToAdd - The number of days to add (can be negative).
 * @returns The resulting BS date.
 */
export function addBsDays(date: BsDateInput, daysToAdd: number): BsDate {
  let { year, month, day } = parseBsDate(date);

  if (!Number.isInteger(daysToAdd)) {
    throw new Error(`Invalid daysToAdd value ${String(daysToAdd)}`);
  }

  let remaining = Math.abs(daysToAdd);
  const direction = daysToAdd < 0 ? -1 : 1;

  while (remaining > 0) {
    if (direction > 0) {
      const daysLeftInMonth = daysInBsMonth(year, month) - day;
      if (remaining <= daysLeftInMonth) {
        day += remaining;
        break;
      }

      remaining -= daysLeftInMonth + 1;
      ({ year, month } = addMonth(year, month, 1));
      day = 1;
    } else {
      const daysBeforeCurrent = day - 1;
      if (remaining <= daysBeforeCurrent) {
        day -= remaining;
        break;
      }

      remaining -= day;
      ({ year, month } = addMonth(year, month, -1));
      day = daysInBsMonth(year, month);
    }
  }

  return { year, month, day };
}

/**
 * Subtracts a specific number of days from a BS date.
 * @param date - The initial BS date.
 * @param daysToSubtract - The number of days to subtract.
 * @returns The resulting BS date.
 */
export function subtractBsDays(date: BsDateInput, daysToSubtract: number): BsDate {
  return addBsDays(date, -daysToSubtract);
}

/**
 * Adds a specific number of months to a BS date. Adjusts the day if it exceeds
 * the number of days in the resulting month.
 * @param date - The initial BS date.
 * @param monthsToAdd - The number of months to add (can be negative).
 * @returns The resulting BS date.
 */
export function addBsMonths(date: BsDateInput, monthsToAdd: number): BsDate {
  const parsed = parseBsDate(date);

  if (!Number.isInteger(monthsToAdd)) {
    throw new Error(`Invalid monthsToAdd value ${String(monthsToAdd)}`);
  }

  const absoluteMonth = parsed.year * 12 + (parsed.month - 1) + monthsToAdd;
  const year = Math.floor(absoluteMonth / 12);
  const month = (absoluteMonth % 12) + 1;
  const day = Math.min(parsed.day, daysInBsMonth(year, month));
  return { year, month, day };
}

/**
 * Subtracts a specific number of months from a BS date.
 * @param date - The initial BS date.
 * @param monthsToSubtract - The number of months to subtract.
 * @returns The resulting BS date.
 */
export function subtractBsMonths(date: BsDateInput, monthsToSubtract: number): BsDate {
  return addBsMonths(date, -monthsToSubtract);
}

/**
 * Adds a specific number of years to a BS date.
 * @param date - The initial BS date.
 * @param yearsToAdd - The number of years to add.
 * @returns The resulting BS date.
 */
export function addBsYears(date: BsDateInput, yearsToAdd: number): BsDate {
  if (!Number.isInteger(yearsToAdd)) {
    throw new Error(`Invalid yearsToAdd value ${String(yearsToAdd)}`);
  }

  return addBsMonths(date, yearsToAdd * 12);
}

/**
 * Subtracts a specific number of years from a BS date.
 * @param date - The initial BS date.
 * @param yearsToSubtract - The number of years to subtract.
 * @returns The resulting BS date.
 */
export function subtractBsYears(date: BsDateInput, yearsToSubtract: number): BsDate {
  return addBsYears(date, -yearsToSubtract);
}

/**
 * Helper to step exactly one month forward or backward.
 * @param year - The current year.
 * @param month - The current month.
 * @param delta - 1 (next month) or -1 (previous month).
 * @returns An object with the new year and month.
 */
function addMonth(year: number, month: number, delta: 1 | -1): { year: number; month: number } {
  const nextMonth = month + delta;
  if (nextMonth > 12) {
    return { year: year + 1, month: 1 };
  }

  if (nextMonth < 1) {
    return { year: year - 1, month: 12 };
  }

  return { year, month: nextMonth };
}
