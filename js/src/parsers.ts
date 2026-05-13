import { daysInBsMonth } from './calendar';
import type { AdDate, AdDateInput, BsDate, BsDateInput } from './types';
import { assertInteger, parseYmdString } from './helpers';

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
