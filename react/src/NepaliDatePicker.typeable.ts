import { compareBsDate, daysInMonth, parseBsDate, type BsDate } from 'nepali-date-library';
import type { NepaliDatePickerProps } from './NepaliDatePicker.types';

type PickerType = NonNullable<NepaliDatePickerProps['pickerType']>;
type NumeralSystem = NonNullable<NepaliDatePickerProps['numeralSystem']>;

export interface ParsedTypedInputValue {
  digits: string;
  displayValue: string;
  isComplete: boolean;
  parts?: string[];
}

export function normalizeNumerals(value: string): string {
  return value.replace(/[०-९]/g, (digit) => String('०१२३४५६७८९'.indexOf(digit)));
}

export function formatTypedNumerals(value: string, numeralSystem: NumeralSystem): string {
  if (numeralSystem !== 'nepali') {
    return value;
  }

  return value.replace(/\d/g, (digit) => '०१२३४५६७८९'[Number(digit)] ?? digit);
}

export function getTypeableSeparator(dateFormat: NepaliDatePickerProps['dateFormat']): string {
  if (typeof dateFormat !== 'string') {
    return '-';
  }

  return dateFormat.match(/[-/.]/)?.[0] ?? '-';
}

export function parseTypedInputValue(
  value: string,
  defaultSeparator: string,
  numeralSystem: NumeralSystem,
  pickerType: PickerType,
  cursorPosition?: number | null,
): ParsedTypedInputValue {
  const digitLimit = getTypeableDigits(pickerType);
  const typedSeparator = detectTypedSeparator(value);

  if (!typedSeparator) {
    const digits = extractDigits(value).slice(0, digitLimit);

    return {
      digits,
      displayValue: formatTypedInputValue(digits, defaultSeparator, numeralSystem, pickerType),
      isComplete: digits.length === digitLimit,
    };
  }

  const cursor = typeof cursorPosition === 'number' ? getTypedCursorPart(value, cursorPosition) : null;
  const partLengths = getTypeablePartLengths(pickerType);
  const parts = normalizeTypedParts(value.split(/[-/.]/), partLengths, cursor);

  return {
    parts,
    digits: parts.join('').slice(0, digitLimit),
    displayValue: formatTypedParts(parts, typedSeparator, numeralSystem),
    isComplete: partLengths.every((partLength, index) => parts[index]?.length === partLength),
  };
}

export function buildTypedCandidateDate({
  digits,
  parts,
  isComplete,
  baseDate,
  pickerType,
}: {
  digits: string;
  parts?: string[];
  isComplete: boolean;
  baseDate: BsDate;
  pickerType: PickerType;
}): BsDate | null {
  const yearDigits = parts?.[0] ?? digits.slice(0, 4);
  if (yearDigits.length < 4) {
    return null;
  }

  const year = Number(yearDigits);
  if (!Number.isFinite(year)) {
    return null;
  }

  if (pickerType === 'year') {
    return safeBsDate(year, 1, 1);
  }

  let month = baseDate.month;
  const monthDigits = parts ? (parts[1] ?? '') : digits.slice(4, 6);

  if (monthDigits.length >= 2) {
    const typedMonth = Number(monthDigits);
    if (!Number.isFinite(typedMonth) || typedMonth < 1 || typedMonth > 12) {
      return isComplete ? null : safeBsDate(year, baseDate.month, baseDate.day);
    }

    month = typedMonth;
  }

  if (pickerType === 'month') {
    return safeBsDate(year, month, 1);
  }

  const maxDay = safeDaysInMonth(year, month);
  if (!maxDay) {
    return null;
  }

  if (digits.length < 8) {
    return { year, month, day: Math.min(baseDate.day, maxDay) };
  }

  const dayDigits = parts ? (parts[2] ?? '') : digits.slice(6, 8);
  const typedDay = Number(dayDigits);

  if (!Number.isFinite(typedDay) || typedDay < 1) {
    return isComplete ? null : { year, month, day: Math.min(baseDate.day, maxDay) };
  }

  return { year, month, day: Math.min(typedDay, maxDay) };
}

export function isTypedCandidateOutOfRange(candidate: BsDate, min?: NepaliDatePickerProps['min'], max?: NepaliDatePickerProps['max']): boolean {
  return Boolean(
    (min && compareBsDate(candidate, parseBsDate(min)) < 0) ||
    (max && compareBsDate(candidate, parseBsDate(max)) > 0),
  );
}

function detectTypedSeparator(value: string): string | undefined {
  return value.match(/[-/.]/)?.[0];
}

function extractDigits(value: string): string {
  return normalizeNumerals(value).replace(/\D/g, '');
}

function getTypedCursorPart(value: string, cursorPosition: number): { partIndex: number; digitOffset: number } {
  let partIndex = 0;
  let digitOffset = 0;
  const end = Math.min(Math.max(cursorPosition, 0), value.length);

  for (let index = 0; index < end; index += 1) {
    const char = value[index];
    if (/[-/.]/.test(char)) {
      partIndex += 1;
      digitOffset = 0;
    } else if (/\d/.test(char)) {
      digitOffset += 1;
    }
  }

  return { partIndex, digitOffset };
}

function trimTypedPart(digits: string, maxLength: number, cursorDigitOffset?: number): string {
  if (digits.length <= maxLength) {
    return digits;
  }

  if (typeof cursorDigitOffset === 'number' && cursorDigitOffset >= digits.length) {
    return `${digits.slice(0, maxLength - 1)}${digits.slice(-1)}`;
  }

  return digits.slice(0, maxLength);
}

function normalizeTypedParts(
  rawParts: string[],
  partLengths: number[],
  cursor: { partIndex: number; digitOffset: number } | null,
): string[] {
  const pendingParts = rawParts.slice(0, partLengths.length);
  const parts: string[] = [];

  for (let index = 0; index < pendingParts.length; index += 1) {
    const maxLength = partLengths[index];
    const digits = extractDigits(pendingParts[index] ?? '');

    if (
      index > 0 &&
      index < partLengths.length - 1 &&
      cursor?.partIndex === index &&
      cursor.digitOffset >= digits.length &&
      digits.length > maxLength
    ) {
      parts[index] = digits.slice(0, maxLength);
      pendingParts[index + 1] = `${digits.slice(maxLength)}${pendingParts[index + 1] ?? ''}`;
      continue;
    }

    parts[index] = trimTypedPart(digits, maxLength, cursor?.partIndex === index ? cursor.digitOffset : undefined);
  }

  return parts;
}

function formatTypedInputValue(
  value: string,
  separator: string,
  numeralSystem: NumeralSystem,
  pickerType: PickerType,
): string {
  const digits = extractDigits(value).slice(0, getTypeableDigits(pickerType));
  if (!digits) {
    return '';
  }

  const formattedDigits = formatTypedNumerals(digits, numeralSystem);

  if (pickerType === 'year') {
    return formattedDigits.slice(0, 4);
  }

  if (pickerType === 'month') {
    return formatTypedYearMonth(formattedDigits, separator);
  }

  return formatTypedYearMonthDay(formattedDigits, separator);
}

function formatTypedParts(parts: string[], separator: string, numeralSystem: NumeralSystem): string {
  return formatTypedNumerals(parts.join(separator), numeralSystem);
}

function formatTypedYearMonth(digits: string, separator: string): string {
  if (digits.length <= 4) {
    return digits;
  }

  return `${digits.slice(0, 4)}${separator}${digits.slice(4)}`;
}

function formatTypedYearMonthDay(digits: string, separator: string): string {
  const yearMonth = formatTypedYearMonth(digits.slice(0, 6), separator);
  if (digits.length <= 4) {
    return digits;
  }

  if (digits.length <= 6) {
    return yearMonth;
  }

  return `${yearMonth}${separator}${digits.slice(6)}`;
}

function safeBsDate(year: number, month: number, day: number): BsDate | null {
  const maxDay = safeDaysInMonth(year, month);
  if (!maxDay || day < 1) {
    return null;
  }

  return { year, month, day: Math.min(day, maxDay) };
}

function safeDaysInMonth(year: number, month: number): number | null {
  try {
    return daysInMonth(year, month);
  } catch {
    return null;
  }
}

function getTypeableDigits(pickerType: PickerType): number {
  if (pickerType === 'year') {
    return 4;
  }

  if (pickerType === 'month') {
    return 6;
  }

  return 8;
}

function getTypeablePartLengths(pickerType: PickerType): number[] {
  if (pickerType === 'year') {
    return [4];
  }

  if (pickerType === 'month') {
    return [4, 2];
  }

  return [4, 2, 2];
}
