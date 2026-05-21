import { daysInBsMonth } from './calendar';
import type { AdDate, AdDateInput, BsDate, BsDateInput } from './types';
import { assertInteger, parseYmdString } from './helpers';

/**
 * Parses a Gregorian (AD) date input into a strict AdDate object.
 * @param input - The AD date as a string (YYYY-MM-DD), Date object, or AdDate interface.
 * @returns A strictly parsed AdDate object with integer year, month, and day.
 * @throws Error if the date is invalid or improperly formatted.
 */
export function parseAdDate(input: AdDateInput): AdDate {
  if (input instanceof Date) {
    const timestamp = Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate());
    if (Number.isNaN(timestamp)) {
      throw new Error('Invalid Gregorian date');
    }

    return {
      year: input.getUTCFullYear(),
      month: input.getUTCMonth() + 1,
      day: input.getUTCDate(),
    };
  }

  if (typeof input === 'string') {
    return parseAdDateParts(parseYmdString(input, 'Gregorian date'));
  }

  if (typeof input === 'object' && input !== null) {
    const candidate = input as Partial<AdDate>;
    return parseAdDateParts({
      year: candidate.year as number,
      month: candidate.month as number,
      day: candidate.day as number,
    });
  }

  throw new Error(`Invalid Gregorian date format ${String(input)}. Use YYYY-MM-DD.`);
}

/**
 * Parses a Bikram Sambat (BS) date input into a strict BsDate object.
 * Validates that the day falls within the valid range for that specific BS month and year.
 * @param input - The BS date as a string (YYYY-MM-DD) or BsDate interface.
 * @returns A strictly parsed BsDate object with integer year, month, and day.
 * @throws Error if the date is invalid, improperly formatted, or unsupported.
 */
export function parseBsDate(input: BsDateInput): BsDate {
  if (typeof input === 'string') {
    return parseBsDateParts(parseYmdString(input, 'BS date'));
  }

  if (typeof input === 'object' && input !== null) {
    const candidate = input as Partial<BsDate>;
    return parseBsDateParts({
      year: candidate.year as number,
      month: candidate.month as number,
      day: candidate.day as number,
    });
  }

  throw new Error(`Invalid BS date format ${String(input)}. Use YYYY-MM-DD.`);
}

/**
 * Internal helper to validate AD date parts and prevent out-of-bounds dates.
 * @param parts - The year, month, and day integers.
 * @returns The validated AdDate object.
 */
function parseAdDateParts(parts: { year: number; month: number; day: number }): AdDate {
  const { year, month, day } = parts;

  assertInteger(year, 'year');
  assertInteger(month, 'month');
  assertInteger(day, 'day');

  const timestamp = Date.UTC(year, month - 1, day);
  if (Number.isNaN(timestamp)) {
    throw new Error(`Invalid Gregorian date ${year}-${month}-${day}`);
  }

  const roundtrip = new Date(timestamp);
  if (
    roundtrip.getUTCFullYear() !== year ||
    roundtrip.getUTCMonth() !== month - 1 ||
    roundtrip.getUTCDate() !== day
  ) {
    throw new Error(`Invalid Gregorian date ${year}-${month}-${day}`);
  }

  return { year, month, day };
}

/**
 * Internal helper to validate BS date parts against calendar constraints.
 * @param parts - The year, month, and day integers.
 * @returns The validated BsDate object.
 */
function parseBsDateParts(parts: { year: number; month: number; day: number }): BsDate {
  const { year, month, day } = parts;

  assertInteger(year, 'year');
  assertInteger(month, 'month');
  assertInteger(day, 'day');

  const maxDay = daysInBsMonth(year, month);
  if (day < 1 || day > maxDay) {
    throw new Error(`Invalid day value ${day}`);
  }

  return { year, month, day };
}
