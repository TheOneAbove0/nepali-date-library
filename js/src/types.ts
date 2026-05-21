/** Represents a strict Bikram Sambat (BS) date. */
export interface BsDate {
  year: number;
  month: number;
  day: number;
}

/** Represents a strict Gregorian (AD) date. */
export interface AdDate {
  year: number;
  month: number;
  day: number;
}

/** Accepted input formats for BS dates. */
export type BsDateInput = BsDate | string;

/** Accepted input formats for AD dates. */
export type AdDateInput = AdDate | Date | string;

/** Localized Devanagari text representation of a BS date. */
export interface DevanagariDateParts {
  day: string;
  month: string;
  year: string;
}
