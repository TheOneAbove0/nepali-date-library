import type {
  NepaliDatePickerStyles,
  NepaliDatePickerValue,
  NepaliDatePickerVariables,
} from '@theoneabove0/nepalidatepicker-react';
import { toBS, type BsDate } from '@theoneabove0/nepalidatepicker';

export const sampleAd = '2026-05-13';
export const sampleBs = toBS(sampleAd);

export const sharedPickerProps = {
  numeralSystem: 'nepali' as const,
};

export const brandedVariables: NepaliDatePickerVariables = {
  '--nepali-date-picker-accent': '#c97012',
  '--nepali-date-picker-accent-soft': '#fff0de',
  '--nepali-date-picker-input-bg': '#fffdf8',
  '--nepali-date-picker-input-border': '#f1d0aa',
  '--nepali-date-picker-input-radius': '18px',
  '--nepali-date-picker-calendar-bg': '#fffdf8',
  '--nepali-date-picker-calendar-border': '#f1d0aa',
  '--nepali-date-picker-calendar-radius': '22px',
  '--nepali-date-picker-header-bg': '#fff4e7',
  '--nepali-date-picker-hover-bg': '#fff0de',
  '--nepali-date-picker-range-bg': '#fde6cb',
  '--nepali-date-picker-muted': '#866651',
  '--nepali-date-picker-shadow': '0 24px 60px rgba(111, 67, 14, 0.12)',
};

export const brandedStyles: NepaliDatePickerStyles = {
  inputShell: { paddingInline: '4px' },
  navButton: { borderRadius: 999 },
  day: { borderRadius: '14px' },
  tile: { borderRadius: '14px' },
};

export function toSingleDate(value: NepaliDatePickerValue): BsDate | null {
  if (Array.isArray(value)) {
    return value[1] ?? value[0];
  }

  return value;
}

export function toDateRange(value: NepaliDatePickerValue): [BsDate | null, BsDate | null] {
  if (Array.isArray(value)) {
    return [value[0] ?? null, value[1] ?? null];
  }

  return [null, null];
}
