import { BS_EPOCH_TS, BS_YEAR_ZERO, MONTH_NAMES, MS_PER_DAY } from './data';
import { daysInBsMonth } from './calendar';
import { parseAdDate, parseBsDate } from './parsers';
import { toDevanagari, zPad } from './helpers';
import type { AdDate, AdDateInput, BsDate, DevanagariDateParts } from './types';

export function daysInMonth(year: number, month: number): number {
  return daysInBsMonth(year, month);
}

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

export function toDev(year: number, month: number, day: number): DevanagariDateParts {
  return {
    day: toDevanagari(day),
    month: MONTH_NAMES[month - 1],
    year: toDevanagari(year),
  };
}

export function toBik_dev(greg: AdDateInput): string {
  const bikDate = toBS(greg);
  const formatted = `${bikDate.year}-${zPad(bikDate.month)}-${zPad(bikDate.day)}`;
  return toDevanagari(formatted);
}

export function toBik_text(greg: AdDateInput): string {
  const bikDate = toBS(greg);
  const dev = toDev(bikDate.year, bikDate.month, bikDate.day);
  return `${dev.day} ${dev.month} ${dev.year}`;
}

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

export function toBik_euro(greg: AdDateInput): string {
  const bikDate = toBS(greg);
  return `${bikDate.year}-${zPad(bikDate.month)}-${zPad(bikDate.day)}`;
}

export function toGreg_text(year: number, month: number, day: number): string {
  const gregDate = toAD(year, month, day);
  return `${gregDate.year}-${zPad(gregDate.month)}-${zPad(gregDate.day)}`;
}
