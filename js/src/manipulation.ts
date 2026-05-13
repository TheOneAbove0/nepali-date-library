import { daysInBsMonth } from './calendar';
import { parseBsDate } from './parsers';
import type { BsDate, BsDateInput } from './types';

export function compareBsDate(a: BsDate, b: BsDate): number {
  if (a.year !== b.year) return a.year < b.year ? -1 : 1;
  if (a.month !== b.month) return a.month < b.month ? -1 : 1;
  if (a.day !== b.day) return a.day < b.day ? -1 : 1;
  return 0;
}

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

export function subtractBsDays(date: BsDateInput, daysToSubtract: number): BsDate {
  return addBsDays(date, -daysToSubtract);
}

export function addBsMonths(date: BsDateInput, monthsToAdd: number): BsDate {
  const parsed = parseBsDate(date);

  if (!Number.isInteger(monthsToAdd)) {
    throw new Error(`Invalid monthsToAdd value ${String(monthsToAdd)}`);
  }

  const absoluteMonth = (parsed.year * 12) + (parsed.month - 1) + monthsToAdd;
  const year = Math.floor(absoluteMonth / 12);
  const month = (absoluteMonth % 12) + 1;
  const day = Math.min(parsed.day, daysInBsMonth(year, month));
  return { year, month, day };
}

export function subtractBsMonths(date: BsDateInput, monthsToSubtract: number): BsDate {
  return addBsMonths(date, -monthsToSubtract);
}

export function addBsYears(date: BsDateInput, yearsToAdd: number): BsDate {
  if (!Number.isInteger(yearsToAdd)) {
    throw new Error(`Invalid yearsToAdd value ${String(yearsToAdd)}`);
  }

  return addBsMonths(date, yearsToAdd * 12);
}

export function subtractBsYears(date: BsDateInput, yearsToSubtract: number): BsDate {
  return addBsYears(date, -yearsToSubtract);
}

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
