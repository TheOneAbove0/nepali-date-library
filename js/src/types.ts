export interface BsDate {
  year: number;
  month: number;
  day: number;
}

export interface AdDate {
  year: number;
  month: number;
  day: number;
}

export type BsDateInput = BsDate | string;
export type AdDateInput = AdDate | Date | string;

export interface DevanagariDateParts {
  day: string;
  month: string;
  year: string;
}
