import type {
  CSSProperties,
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
  ReactElement,
  ReactNode,
} from 'react';
import type { BsDate, BsDateFormat, BsDateInput, WeekdayIndex } from 'nepali-date-library';
import type { MonthGridCell } from 'nepali-date-library/datepicker-core';

export const MONTH_NAMES = [
  'बैशाख',
  'जेठ',
  'असार',
  'साउन',
  'भदौ',
  'असोज',
  'कार्तिक',
  'मंसिर',
  'पौष',
  'माघ',
  'फाल्गुन',
  'चैत',
] as const;
export const WEEKDAY_NAMES = [
  'आइतबार',
  'सोमबार',
  'मंगलबार',
  'बुधबार',
  'बिहीबार',
  'शुक्रबार',
  'शनिबार',
] as const;
export const WEEKDAY_SHORT_NAMES = ['आ', 'सो', 'मं', 'बु', 'बि', 'शु', 'श'] as const;
export const DEFAULT_DECADE_SIZE = 10;

export type NepaliDatePickerType = 'date' | 'month' | 'year';
export type NepaliDatePickerLevel = 'day' | 'month' | 'year';
export type NepaliDatePickerSelectionType = 'default' | 'range';
export type NepaliNumeralSystem = 'latin' | 'nepali';
export type NepaliDatePickerSize = 'sm' | 'md' | 'lg' | 'xl' | number;
export type ClearSectionMode = 'both' | 'rightSection' | 'clear';
export type NepaliDatePickerSlot =
  | 'root'
  | 'label'
  | 'description'
  | 'inputShell'
  | 'input'
  | 'iconButton'
  | 'clearButton'
  | 'popper'
  | 'calendar'
  | 'header'
  | 'navButton'
  | 'headerLabel'
  | 'table'
  | 'weekday'
  | 'cell'
  | 'day'
  | 'monthGrid'
  | 'yearGrid'
  | 'tile'
  | 'children';

export type DateFormatter = BsDateFormat | ((date: BsDate) => string);
export type RangeInputValue = [BsDateInput | null, BsDateInput | null];
export type RangeValue = [BsDate | null, BsDate | null];
export type StyleObject = CSSProperties & Record<`--${string}`, string | number>;
export type NepaliDatePickerValue = BsDate | RangeValue | null;
export type NepaliDatePickerClassNames = Partial<Record<NepaliDatePickerSlot, string>>;
export type NepaliDatePickerStyles = Partial<Record<NepaliDatePickerSlot, StyleObject>>;
export type NepaliDatePickerVariables = Record<`--${string}`, string | number>;

export interface NepaliDatePickerCustomInputProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onClick?: () => void;
  onFocus?: () => void;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}

export interface NepaliDatePickerHeaderProps {
  date: BsDate;
  label: string;
  level: NepaliDatePickerLevel;
  pickerType: NepaliDatePickerType;
  viewYear: number;
  viewMonth: number;
  monthName: string;
  decadeLabel: string;
  decrease: () => void;
  increase: () => void;
  openMonthLevel: () => void;
  openYearLevel: () => void;
  changeYear: (year: number) => void;
  changeMonth: (month: number) => void;
  prevButtonDisabled: boolean;
  nextButtonDisabled: boolean;
}

export interface NepaliDatePickerDayNameProps {
  day: WeekdayIndex;
  shortName: string;
  fullName: string;
  index: number;
}

export interface NepaliDateHoliday {
  date: BsDateInput;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export type NepaliDateHolidayInput = BsDateInput | NepaliDateHoliday;

/**
 * Core properties for the Nepali Date Picker components.
 */
export interface NepaliDatePickerProps {
  /** Size of the date picker. */
  size?: NepaliDatePickerSize;
  /** Whether the input should allow free-text typing. */
  typeable?: boolean;
  /** The selection mode: 'default' for single date, 'range' for date ranges. */
  type?: NepaliDatePickerSelectionType;
  /** The controlled value of the picker. */
  value?: BsDateInput | RangeInputValue | null;
  /** Alias for `value`. */
  selected?: BsDateInput | RangeInputValue | null;
  /** The uncontrolled default value of the picker. */
  defaultValue?: BsDateInput | RangeInputValue | null;
  /** Callback fired when the selected date or range changes. */
  onChange?: (value: NepaliDatePickerValue) => void;
  /** The minimum selectable date (inclusive). */
  min?: BsDateInput;
  /** The maximum selectable date (inclusive). */
  max?: BsDateInput;
  /** Alias for `min`. */
  minDate?: BsDateInput;
  /** Alias for `max`. */
  maxDate?: BsDateInput;
  /** List of specific dates that are explicitly allowed (others will be disabled). */
  includeDates?: BsDateInput[];
  /** List of specific dates to explicitly disable. */
  excludeDates?: BsDateInput[];
  /** List of dates to mark as holidays. */
  holidays?: NepaliDateHolidayInput[];
  /** A predicate function to dynamically disable specific dates. */
  filterDate?: (date: BsDate) => boolean;
  /** Alias for `filterDate`. */
  isDateDisabled?: (date: BsDate) => boolean;
  /** The starting day of the week (0 = Sunday, 6 = Saturday). */
  weekStartsOn?: WeekdayIndex;
  /** Alias for `weekStartsOn`. */
  firstDayOfWeek?: WeekdayIndex;
  /** Alias for `weekStartsOn`. */
  calendarStartDay?: WeekdayIndex;
  /** Custom formatter function to convert the selected date to an input display string. */
  valueFormatter?: (value: NepaliDatePickerValue | null) => string;
  /** Whether to add spacing between calendar grid cells. */
  withCellSpacing?: boolean;
  /** Whether to render the calendar inline without an input dropdown. */
  inline?: boolean;
  /** Disables the entire picker. */
  disabled?: boolean;
  /** Makes the input read-only. */
  readOnly?: boolean;
  /** Whether to render a clear button to remove the selected value. */
  isClearable?: boolean;
  /** Alias for `isClearable`. */
  clearable?: boolean;
  /** Automatically closes the popover when a date is selected. */
  shouldCloseOnSelect?: boolean;
  /** Placeholder text for the input. */
  placeholder?: string;
  /** Alias for `placeholder`. */
  placeholderText?: string;
  /** Label text for the input field. */
  label?: ReactNode;
  /** Description text displayed below the label or input. */
  description?: ReactNode;
  /** Internal picker type (date, month, or year). */
  pickerType?: NepaliDatePickerType;
  /** Numeral system used for display: 'latin' (0-9) or 'nepali' (०-९). */
  numeralSystem?: NepaliNumeralSystem;
  /** Formatting string or function for the input value. */
  dateFormat?: DateFormatter;
  /** Content to render on the left side of the input (e.g. an icon). */
  leftSection?: ReactNode;
  /** Content to render on the right side of the input (e.g. a calendar icon). */
  rightSection?: ReactNode;
  /** Determines how the clear button interacts with the right section. */
  clearSectionMode?: ClearSectionMode;
  /** Whether clicking the right/left section toggles the calendar dropdown. */
  toggleCalendarOnIconClick?: boolean;
  /** A custom input React element to use instead of the default. */
  customInput?: ReactElement<NepaliDatePickerCustomInputProps>;
  /** Custom inline styles applied to specific slots. */
  style?: StyleObject;
  /** Class name for the root element. */
  className?: string;
  /** Class name for the input element. */
  inputClassName?: string;
  /** Class name for the calendar popover. */
  calendarClassName?: string;
  /** Class name for the popper wrapper. */
  popperClassName?: string;
  /** Object mapping slots to class names for precise styling. */
  classNames?: NepaliDatePickerClassNames;
  /** Object mapping slots to inline styles for precise styling. */
  styles?: NepaliDatePickerStyles;
  /** CSS variables to inject at the root level. */
  variables?: NepaliDatePickerVariables;
  /** Function to compute dynamic class names for specific date cells. */
  dayClassName?: (date: BsDate, cell: MonthGridCell) => string;
  /** Function to compute dynamic class names for weekday header cells. */
  weekDayClassName?: (day: WeekdayIndex) => string;
  /** Array of localized month names to override the defaults. */
  monthNames?: readonly string[];
  /** Array of localized full weekday names to override the defaults. */
  weekdayNames?: readonly string[];
  /** Array of localized short weekday names to override the defaults. */
  weekdayShortNames?: readonly string[];
  /** Custom content for the "previous" navigation button. */
  previousMonthLabel?: ReactNode;
  /** Custom content for the "next" navigation button. */
  nextMonthLabel?: ReactNode;
  /** Completely overrides the default calendar header rendering. */
  renderCustomHeader?: (props: NepaliDatePickerHeaderProps) => ReactNode;
  /** Alias for `renderCustomHeader`. */
  renderHeader?: (props: NepaliDatePickerHeaderProps) => ReactNode;
  /** Custom rendering for the content of individual day cells. */
  renderDayContents?: (day: number, date: BsDate, cell: MonthGridCell) => ReactNode;
  /** Custom rendering for weekday column headers. */
  renderCustomDayName?: (props: NepaliDatePickerDayNameProps) => ReactNode;
  /** Callback fired when the calendar popover opens. */
  onCalendarOpen?: () => void;
  /** Callback fired when the calendar popover closes. */
  onCalendarClose?: () => void;
  /** Additional content to render inside the calendar popover, usually below the grid. */
  children?: ReactNode | ((renderProps: { closeCalendar: () => void }) => ReactNode);
}

export type DatePickerInputProps = Omit<NepaliDatePickerProps, 'pickerType'>;
export type DateInputProps = Omit<NepaliDatePickerProps, 'pickerType'>;
export type DatePickerProps = Omit<NepaliDatePickerProps, 'pickerType'>;
export type MonthPickerInputProps = Omit<NepaliDatePickerProps, 'pickerType'>;
export type MonthPickerProps = Omit<NepaliDatePickerProps, 'pickerType'>;
export type YearPickerInputProps = Omit<NepaliDatePickerProps, 'pickerType'>;
export type YearPickerProps = Omit<NepaliDatePickerProps, 'pickerType'>;
export type CalendarProps = Omit<NepaliDatePickerProps, 'pickerType'>;

export interface HolidayMeta {
  label?: string;
  className?: string;
  disabled?: boolean;
}
