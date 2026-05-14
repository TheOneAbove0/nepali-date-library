import { DEVANAGARI_ZERO } from './data';

export function assertInteger(value: unknown, fieldName: string): asserts value is number {
  if (!Number.isInteger(value)) {
    throw new Error(`Invalid ${fieldName} value ${String(value)}`);
  }
}

export function zPad(value: number): string {
  return value > 9 ? String(value) : `0${value}`;
}

export function toDevanagari(value: string | number): string {
  return String(value).replace(/\d/g, (digit) =>
    String.fromCharCode(DEVANAGARI_ZERO + Number(digit)),
  );
}

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
