import {
  compareBsDate,
  daysInMonth,
  formatBsDate,
  parseBsDate,
  type BsDate,
  type BsDateInput,
  type WeekdayIndex,
} from 'nepali-date-library';
import type {
  DateFormatter,
  HolidayMeta,
  NepaliDateHolidayInput,
  NepaliDatePickerLevel,
  NepaliDatePickerProps,
  NepaliDatePickerSize,
  NepaliDatePickerSelectionType,
  NepaliDatePickerSlot,
  NepaliDatePickerType,
  NepaliNumeralSystem,
  RangeInputValue,
  RangeValue,
  StyleObject,
} from './NepaliDatePicker.types';
import { DEFAULT_DECADE_SIZE } from './NepaliDatePicker.types';

export function toDateKeySet(dates?: BsDateInput[]): Set<string> | undefined {
  return dates ? new Set(dates.map((date) => formatBsDate(date))) : undefined;
}

export function toDateKey(date: BsDateInput): string {
  return formatBsDate(date);
}

export function toHolidayMap(holidays?: NepaliDateHolidayInput[]): Map<string, HolidayMeta> {
  const map = new Map<string, HolidayMeta>();

  holidays?.forEach((holiday) => {
    if (typeof holiday === 'string' || isBsDateObject(holiday)) {
      map.set(formatBsDate(holiday), {});
      return;
    }

    map.set(formatBsDate(holiday.date), {
      label: holiday.label,
      className: holiday.className,
      disabled: holiday.disabled,
    });
  });

  return map;
}

export function isBsDateObject(value: NepaliDateHolidayInput): value is BsDate {
  return (
    typeof value === 'object' &&
    value !== null &&
    'year' in value &&
    'month' in value &&
    'day' in value &&
    !('date' in value)
  );
}

export function formatPickerValue(
  date: BsDate,
  pickerType: NepaliDatePickerType,
  dateFormat?: DateFormatter,
  numeralSystem: NepaliNumeralSystem = 'latin',
): string {
  if (typeof dateFormat === 'function') {
    return dateFormat(date);
  }

  if (dateFormat) {
    return formatNumericString(formatBsDate(date, dateFormat), numeralSystem);
  }

  if (pickerType === 'month') {
    return formatNumericString(`${date.year}-${pad(date.month)}`, numeralSystem);
  }

  if (pickerType === 'year') {
    return formatNumericValue(date.year, numeralSystem);
  }

  return formatNumericString(formatBsDate(date), numeralSystem);
}

export function formatRangeValue(
  range: RangeValue,
  pickerType: NepaliDatePickerType,
  dateFormat?: DateFormatter,
  numeralSystem: NepaliNumeralSystem = 'latin',
): string {
  const [start, end] = range;

  if (!start && !end) {
    return '';
  }

  if (start && !end) {
    return `${formatPickerValue(start, pickerType, dateFormat, numeralSystem)} - `;
  }

  if (!start || !end) {
    return '';
  }

  return `${formatPickerValue(start, pickerType, dateFormat, numeralSystem)} - ${formatPickerValue(end, pickerType, dateFormat, numeralSystem)}`;
}

export function getDefaultLevel(pickerType: NepaliDatePickerType): NepaliDatePickerLevel {
  if (pickerType === 'month') {
    return 'month';
  }

  if (pickerType === 'year') {
    return 'year';
  }

  return 'day';
}

export function parseSingleValue(
  value: BsDateInput | RangeInputValue | null | undefined,
): BsDateInput | null | undefined {
  if (!value) {
    return value ?? undefined;
  }

  if (Array.isArray(value)) {
    return value[1] ?? value[0] ?? undefined;
  }

  return value;
}

export function parseRangeValue(
  value: BsDateInput | RangeInputValue | null | undefined,
  selectionType: NepaliDatePickerSelectionType,
): RangeValue {
  if (selectionType !== 'range' || !Array.isArray(value)) {
    return [null, null];
  }

  return [value[0] ? parseBsDate(value[0]) : null, value[1] ? parseBsDate(value[1]) : null];
}

// A fresh click restarts the range after both endpoints are already present.
export function getNextRange(currentRange: RangeValue, nextDate: BsDate): RangeValue {
  const [start, end] = currentRange;

  if (!start || end) {
    return [nextDate, null];
  }

  if (compareBsDate(nextDate, start) < 0) {
    return [nextDate, start];
  }

  return [start, nextDate];
}

export function canSelectMonth(
  year: number,
  month: number,
  isDateDisabled: (date: BsDate) => boolean,
): boolean {
  return Boolean(findFirstSelectableDateInMonth(year, month, isDateDisabled));
}

export function canSelectYear(year: number, isDateDisabled: (date: BsDate) => boolean): boolean {
  return Boolean(findFirstSelectableDateInYear(year, isDateDisabled));
}

export function findFirstSelectableDateInMonth(
  year: number,
  month: number,
  isDateDisabled: (date: BsDate) => boolean,
): BsDate | null {
  const monthDayCount = getSupportedDaysInMonth(year, month);
  if (monthDayCount === null) {
    return null;
  }

  for (let day = 1; day <= monthDayCount; day += 1) {
    const date = { year, month, day };
    if (!isDateDisabled(date)) {
      return date;
    }
  }

  return null;
}

export function findFirstSelectableDateInYear(
  year: number,
  isDateDisabled: (date: BsDate) => boolean,
): BsDate | null {
  for (let month = 1; month <= 12; month += 1) {
    const date = findFirstSelectableDateInMonth(year, month, isDateDisabled);
    if (date) {
      return date;
    }
  }

  return null;
}

export function isMonthOutsideRange(
  year: number,
  month: number,
  isDateDisabled: (date: BsDate) => boolean,
): boolean {
  const normalized = normalizeYearMonth(year, month);
  return !canSelectMonth(normalized.year, normalized.month, isDateDisabled);
}

export function isYearOutsideRange(
  year: number,
  isDateDisabled: (date: BsDate) => boolean,
): boolean {
  return !canSelectYear(year, isDateDisabled);
}

export function isDecadeOutsideRange(
  startYear: number,
  isDateDisabled: (date: BsDate) => boolean,
): boolean {
  return createDecadeYears(startYear).every((year) => !canSelectYear(year, isDateDisabled));
}

export function createDecadeYears(viewYear: number): number[] {
  const decade = getDecadeBounds(viewYear);
  return Array.from({ length: DEFAULT_DECADE_SIZE }, (_, index) => decade.start + index);
}

export function getDecadeBounds(year: number): { start: number; end: number } {
  const start = year - (year % DEFAULT_DECADE_SIZE);
  return {
    start,
    end: start + DEFAULT_DECADE_SIZE - 1,
  };
}

export function getOrderedWeekdays(weekStartsOn: WeekdayIndex): WeekdayIndex[] {
  return Array.from({ length: 7 }, (_, index) => ((weekStartsOn + index) % 7) as WeekdayIndex);
}

export function createComparableValue(
  year: number,
  month: number,
  pickerType: NepaliDatePickerType,
): BsDate {
  if (pickerType === 'year') {
    return { year, month: 1, day: 1 };
  }

  if (pickerType === 'month') {
    return { year, month, day: 1 };
  }

  return { year, month, day: 1 };
}

export function isSameDate(left: BsDate | null, right: BsDate): boolean {
  return Boolean(left && compareBsDate(left, right) === 0);
}

export function isDateWithinRange(date: BsDate, range: RangeValue): boolean {
  const [start, end] = range;
  return Boolean(start && end && compareBsDate(date, start) > 0 && compareBsDate(date, end) < 0);
}

export function formatNumericValue(value: number, numeralSystem: NepaliNumeralSystem): string {
  return formatNumericString(String(value), numeralSystem);
}

export function formatNumericString(value: string, numeralSystem: NepaliNumeralSystem): string {
  if (numeralSystem !== 'nepali') {
    return value;
  }

  return value.replace(/\d/g, (digit) => '०१२३४५६७८९'[Number(digit)] ?? digit);
}

export function isSameMonth(date: BsDate | null, year: number, month: number): boolean {
  return Boolean(date && date.year === year && date.month === month);
}

export function isSameYear(date: BsDate | null, year: number): boolean {
  return Boolean(date && date.year === year);
}

export function normalizeYearMonth(year: number, month: number): Pick<BsDate, 'year' | 'month'> {
  let nextYear = year;
  let nextMonth = month;

  while (nextMonth < 1) {
    nextMonth += 12;
    nextYear -= 1;
  }

  while (nextMonth > 12) {
    nextMonth -= 12;
    nextYear += 1;
  }

  return { year: nextYear, month: nextMonth };
}

export function getSupportedDaysInMonth(year: number, month: number): number | null {
  try {
    return daysInMonth(year, month);
  } catch {
    return null;
  }
}

export function isYearSupportedByData(year: number): boolean {
  return getSupportedDaysInMonth(year, 1) !== null;
}

export function getRootStyle(props: NepaliDatePickerProps): StyleObject | undefined {
  return mergeStyles(
    getSizeStyleVariables(props.size),
    props.variables as StyleObject | undefined,
    getSlotStyle(props, 'root'),
    props.style,
  );
}

export function getSlotClassName(
  props: NepaliDatePickerProps,
  slot: NepaliDatePickerSlot,
  ...classNames: Array<string | false | null | undefined>
): string | undefined {
  return joinClassNames(...classNames, props.classNames?.[slot]);
}

export function getSlotStyle(
  props: NepaliDatePickerProps,
  slot: NepaliDatePickerSlot,
): StyleObject | undefined {
  return props.styles?.[slot];
}

export function mergeStyles(...styles: Array<StyleObject | undefined>): StyleObject | undefined {
  const merged = styles.reduce<StyleObject>((accumulator, style) => {
    if (style) {
      Object.assign(accumulator, style);
    }

    return accumulator;
  }, {});

  return Object.keys(merged).length > 0 ? merged : undefined;
}

export function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string | undefined {
  const joined = classNames.filter(Boolean).join(' ');
  return joined || undefined;
}

function getSizeStyleVariables(size: NepaliDatePickerSize | undefined): StyleObject | undefined {
  if (size === undefined || size === 'md') {
    return undefined;
  }

  const scale = getSizeScale(size);

  if (scale === 1) {
    return undefined;
  }

  return {
    '--nepali-date-picker-scale': scale,
  };
}

function getSizeScale(size: NepaliDatePickerSize): number {
  if (typeof size === 'number') {
    return Number.isFinite(size) && size > 0 ? size : 1;
  }

  switch (size) {
    case 'sm':
      return 0.9;
    case 'lg':
      return 1.12;
    case 'xl':
      return 1.24;
    default:
      return 1;
  }
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}
