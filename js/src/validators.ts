import type { BsDateInput } from './types';
import { parseBsDate } from './parsers';

/**
 * Validates whether a given input is a valid Bikram Sambat date.
 * @param input - The date input to validate (string or object).
 * @returns True if the date is a mathematically valid BS date within the supported range.
 */
export function isValidBsDate(input: BsDateInput): boolean {
  try {
    parseBsDate(input);
    return true;
  } catch (_error) {
    return false;
  }
}
