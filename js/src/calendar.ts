import { BS_MAX_YEAR, BS_YEAR_ZERO, ENCODED_MONTH_LENGTHS } from './data';
import { assertInteger } from './helpers';

/**
 * Looks up the number of days in a given Bikram Sambat (BS) month using encoded calendar data.
 *
 * @param year - The BS year (e.g. 2080).
 * @param month - The BS month (1-12).
 * @returns The number of days in the specified month.
 * @throws Error if the year or month is outside the supported range or not an integer.
 */
export function daysInBsMonth(year: number, month: number): number {
  assertInteger(year, 'year');
  assertInteger(month, 'month');

  if (month < 1 || month > 12) {
    throw new Error(`Invalid month value ${month}`);
  }

  const delta = ENCODED_MONTH_LENGTHS[year - BS_YEAR_ZERO];
  if (typeof delta === 'undefined') {
    throw new Error(
      `No data for year: ${year} BS (supported range: ${BS_YEAR_ZERO}-${BS_MAX_YEAR})`,
    );
  }

  return 29 + ((delta >>> ((month - 1) << 1)) & 3);
}
