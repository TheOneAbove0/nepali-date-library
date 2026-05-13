import type { BsDateInput } from './types';
import { parseBsDate } from './parsers';

export function isValidBsDate(input: BsDateInput): boolean {
  try {
    parseBsDate(input);
    return true;
  } catch (_error) {
    return false;
  }
}
