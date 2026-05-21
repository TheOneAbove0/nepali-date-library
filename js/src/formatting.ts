import { MONTH_NAMES } from './data';
import { toDev, toBS } from './conversion';
import { parseAdDate, parseBsDate } from './parsers';
import { zPad } from './helpers';
import type { AdDateInput, BsDateInput } from './types';

/** Supported date string formats for formatting functions. */
export type BsDateFormat = 'YYYY-MM-DD' | 'D MMMM YYYY' | 'DD MMMM YYYY';

/**
 * Formats a given BS date into a string according to the specified format.
 * @param input - The BS date to format.
 * @param format - The desired output format (default 'YYYY-MM-DD').
 * @returns The formatted date string.
 */
export function formatBsDate(input: BsDateInput, format: BsDateFormat = 'YYYY-MM-DD'): string {
  const date = parseBsDate(input);

  if (format === 'YYYY-MM-DD') {
    return `${date.year}-${zPad(date.month)}-${zPad(date.day)}`;
  }

  const day = format === 'DD MMMM YYYY' ? zPad(date.day) : String(date.day);
  const monthName = MONTH_NAMES[date.month - 1] ?? '';
  return `${day} ${monthName} ${date.year}`;
}

/**
 * Formats a BS date into a fully localized Nepali (Devanagari) text string.
 * @param input - The BS date to format.
 * @returns A string in the format "DD Month YYYY" using Devanagari numerals and script.
 */
export function formatBsDateNepali(input: BsDateInput): string {
  const date = parseBsDate(input);
  const dev = toDev(date.year, date.month, date.day);
  return `${dev.day} ${dev.month} ${dev.year}`;
}

/**
 * Formats a Gregorian (AD) date to a standard 'YYYY-MM-DD' string.
 * @param input - The AD date.
 * @returns The formatted AD date string.
 */
export function formatAdDate(input: AdDateInput): string {
  const date = parseAdDate(input);
  return `${date.year}-${zPad(date.month)}-${zPad(date.day)}`;
}

/**
 * Converts a Gregorian (AD) date to BS and formats it.
 * @param input - The AD date to convert and format.
 * @param format - The desired output format.
 * @returns The formatted BS date string.
 */
export function formatAdAsBsDate(input: AdDateInput, format: BsDateFormat = 'YYYY-MM-DD'): string {
  return formatBsDate(toBS(input), format);
}

/**
 * Converts a Gregorian (AD) date to BS and formats it using Nepali script.
 * @param input - The AD date.
 * @returns A localized Devanagari BS date string.
 */
export function formatAdAsBsDateNepali(input: AdDateInput): string {
  return formatBsDateNepali(toBS(input));
}
