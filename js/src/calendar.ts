import { BS_YEAR_ZERO, ENCODED_MONTH_LENGTHS } from './data';
import { assertInteger } from './helpers';

export function daysInBsMonth(year: number, month: number): number {
  assertInteger(year, 'year');
  assertInteger(month, 'month');

  if (month < 1 || month > 12) {
    throw new Error(`Invalid month value ${month}`);
  }

  const delta = ENCODED_MONTH_LENGTHS[year - BS_YEAR_ZERO];
  if (typeof delta === 'undefined') {
    throw new Error(`No data for year: ${year} BS`);
  }

  return 29 + ((delta >>> ((month - 1) << 1)) & 3);
}
