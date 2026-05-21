import { BS_EPOCH_TS, BS_YEAR_ZERO, MONTH_NAMES, MS_PER_DAY } from './data';
import { daysInBsMonth } from './calendar';
import { parseAdDate, parseBsDate } from './parsers';
import { toDevanagari, zPad } from './helpers';
import type { AdDate, AdDateInput, BsDate, DevanagariDateParts } from './types';

/**
 * Returns the number of days in a given BS (Bikram Sambat) month.
 * @param year - The BS year (e.g. 2080).
 * @param month - The BS month (1-12).
 * @returns The number of days in the specified month.
 * @throws Error if the year or month is outside the supported range.
 */
export function daysInMonth(year: number, month: number): number {
  return daysInBsMonth(year, month);
}

/**
 * Converts a Gregorian (AD) date to a Bikram Sambat (BS) date.
 * @param greg - The AD date as a string (YYYY-MM-DD), Date object, or numeric timestamp.
 * @returns An object containing the BS year, month, and day.
 * @throws Error if the date falls outside the supported BS range.
 */
export function toBS(greg: AdDateInput): BsDate {
  const adDate = parseAdDate(greg);
  const gregTs = Date.UTC(adDate.year, adDate.month - 1, adDate.day);

  let year = BS_YEAR_ZERO;
  let days = Math.floor((gregTs - BS_EPOCH_TS) / MS_PER_DAY) + 1;

  while (days > 0) {
    for (let month = 1; month <= 12; month += 1) {
      const daysInCurrentMonth = daysInBsMonth(year, month);
      if (days <= daysInCurrentMonth) {
        return { year, month, day: days };
      }
      days -= daysInCurrentMonth;
    }

    year += 1;
  }

  throw new Error(`Date outside supported range: ${String(greg)} AD`);
}

/**
 * Converts a BS date into a fully localized Devanagari representation.
 * @param year - The BS year.
 * @param month - The BS month (1-12).
 * @param day - The BS day.
 * @returns An object containing Devanagari strings for the year, month name, and day.
 */
export function toDev(year: number, month: number, day: number): DevanagariDateParts {
  return {
    day: toDevanagari(day),
    month: MONTH_NAMES[month - 1] ?? '',
    year: toDevanagari(year),
  };
}

/**
 * Converts a Gregorian (AD) date to a BS date string in Devanagari numerals.
 * Format: YYYY-MM-DD in Devanagari.
 * @param greg - The AD date as a string, Date object, or timestamp.
 * @returns The BS date formatted as a Devanagari string.
 */
export function toBik_dev(greg: AdDateInput): string {
  const bikDate = toBS(greg);
  const formatted = `${bikDate.year}-${zPad(bikDate.month)}-${zPad(bikDate.day)}`;
  return toDevanagari(formatted);
}

/**
 * Converts a Gregorian (AD) date to a localized textual BS date.
 * Format: DD MonthName YYYY (in Devanagari script).
 * @param greg - The AD date as a string, Date object, or timestamp.
 * @returns The BS date formatted as a textual Devanagari string.
 */
export function toBik_text(greg: AdDateInput): string {
  const bikDate = toBS(greg);
  const dev = toDev(bikDate.year, bikDate.month, bikDate.day);
  return `${dev.day} ${dev.month} ${dev.year}`;
}

/**
 * Converts a Bikram Sambat (BS) date to a Gregorian (AD) date.
 * @param year - The BS year.
 * @param month - The BS month (1-12).
 * @param day - The BS day.
 * @returns An object containing the AD year, month, and day.
 * @throws Error if the BS date is invalid or unsupported.
 */
export function toAD(year: number, month: number, day: number): AdDate {
  const validBs = parseBsDate({ year, month, day });

  let timestamp = BS_EPOCH_TS + MS_PER_DAY * validBs.day;
  let workingMonth = validBs.month - 1;
  let workingYear = validBs.year;

  while (workingYear >= BS_YEAR_ZERO) {
    while (workingMonth > 0) {
      timestamp += MS_PER_DAY * daysInBsMonth(workingYear, workingMonth);
      workingMonth -= 1;
    }

    workingMonth = 12;
    workingYear -= 1;
  }

  const date = new Date(timestamp);
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

/**
 * Converts a Gregorian (AD) date to a BS date formatted as a standard string.
 * Format: YYYY-MM-DD.
 * @param greg - The AD date as a string, Date object, or timestamp.
 * @returns The BS date formatted as a string.
 */
export function toBik_euro(greg: AdDateInput): string {
  const bikDate = toBS(greg);
  return `${bikDate.year}-${zPad(bikDate.month)}-${zPad(bikDate.day)}`;
}

/**
 * Converts a BS date to a Gregorian (AD) date formatted as a standard string.
 * Format: YYYY-MM-DD.
 * @param year - The BS year.
 * @param month - The BS month (1-12).
 * @param day - The BS day.
 * @returns The AD date formatted as a string.
 */
export function toGreg_text(year: number, month: number, day: number): string {
  const gregDate = toAD(year, month, day);
  return `${gregDate.year}-${zPad(gregDate.month)}-${zPad(gregDate.day)}`;
}
