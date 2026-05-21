import { DEVANAGARI_ZERO } from './data';

/**
 * Asserts that a given value is an integer.
 * @param value - The value to check.
 * @param fieldName - The name of the field (used in error messages).
 * @throws Error if the value is not an integer.
 */
export function assertInteger(value: unknown, fieldName: string): asserts value is number {
  if (!Number.isInteger(value)) {
    throw new Error(`Invalid ${fieldName} value ${String(value)}`);
  }
}

/**
 * Zero-pads a number to ensure it has at least two digits.
 * @param value - The numeric value to pad.
 * @returns A zero-padded string.
 */
export function zPad(value: number): string {
  return value > 9 ? String(value) : `0${value}`;
}

/**
 * Converts Western Arabic numerals (0-9) in a string or number to Devanagari numerals (०-९).
 * @param value - The string or number to convert.
 * @returns The converted Devanagari string.
 */
export function toDevanagari(value: string | number): string {
  return String(value).replace(/\d/g, (digit) =>
    String.fromCharCode(DEVANAGARI_ZERO + Number(digit)),
  );
}

/**
 * Parses a YYYY-MM-DD formatted string into its constituent numeric parts.
 * @param input - The date string to parse.
 * @param label - A label describing the input (used in error messages).
 * @returns An object containing the year, month, and day integers.
 * @throws Error if the format is invalid or parts are not integers.
 */
export function parseYmdString(
  input: string,
  label: string,
): { year: number; month: number; day: number } {
  const match = /^\s*(\d{4})-(\d{1,2})-(\d{1,2})\s*$/.exec(input);
  if (!match) {
    throw new Error(`Invalid ${label} format ${input}. Use YYYY-MM-DD.`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  assertInteger(year, 'year');
  assertInteger(month, 'month');
  assertInteger(day, 'day');

  return { year, month, day };
}
