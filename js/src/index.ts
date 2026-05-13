export type { AdDate, AdDateInput, BsDate, BsDateInput, DevanagariDateParts } from './types';

export { parseAdDate, parseBsDate } from './parsers';
export { isValidBsDate } from './validators';
export {
  formatAdAsBsDate,
  formatAdAsBsDateNepali,
  formatAdDate,
  formatBsDate,
  formatBsDateNepali,
} from './formatting';
export type { BsDateFormat } from './formatting';
export {
  addBsYears,
  subtractBsDays,
  subtractBsMonths,
  subtractBsYears,
} from './manipulation';
export {
  addBsDays,
  addBsMonths,
  clampBsDate,
  compareBsDate,
  createDatePickerState,
  generateMonthGrid,
  isDateDisabled as isDatePickerDateDisabled,
  isDateOutOfRange,
  navigateByKey,
  normalizeConstraints,
} from './datepicker-core';
export type {
  DateConstraints,
  DatePickerKey,
  DatePickerState,
  DayOwner,
  MonthGrid,
  MonthGridCell,
  MonthGridOptions,
  WeekdayIndex,
} from './datepicker-core';

export {
  daysInMonth,
  toBik,
  toDev,
  toBik_euro,
  toBik_dev,
  toBik_text,
  toGreg,
  toGreg_text,
} from './conversion';

import {
  daysInMonth,
  toBik,
  toDev,
  toBik_euro,
  toBik_dev,
  toBik_text,
  toGreg,
  toGreg_text,
} from './conversion';
import { parseAdDate, parseBsDate } from './parsers';
import { isValidBsDate } from './validators';
import {
  formatAdAsBsDate,
  formatAdAsBsDateNepali,
  formatAdDate,
  formatBsDate,
  formatBsDateNepali,
} from './formatting';
import {
  addBsDays,
  addBsMonths,
  addBsYears,
  subtractBsDays,
  subtractBsMonths,
  subtractBsYears,
} from './manipulation';
import {
  clampBsDate,
  compareBsDate,
  createDatePickerState,
  generateMonthGrid,
  isDateDisabled as isDatePickerDateDisabled,
  isDateOutOfRange,
  navigateByKey,
  normalizeConstraints,
} from './datepicker-core';

const legacyApi = {
  daysInMonth,
  toBik,
  toDev,
  toBik_euro,
  toBik_dev,
  toBik_text,
  toGreg,
  toGreg_text,
  parseAdDate,
  parseBsDate,
  isValidBsDate,
  formatAdAsBsDate,
  formatAdAsBsDateNepali,
  formatAdDate,
  formatBsDate,
  formatBsDateNepali,
  generateMonthGrid,
  createDatePickerState,
  navigateByKey,
  compareBsDate,
  addBsDays,
  addBsMonths,
  addBsYears,
  subtractBsDays,
  subtractBsMonths,
  subtractBsYears,
  clampBsDate,
  isDateOutOfRange,
  isDatePickerDateDisabled,
  normalizeConstraints,
};

export default legacyApi;
