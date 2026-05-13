import type {
  CSSProperties,
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
  ReactElement,
  ReactNode,
} from "react";
import type {
  BsDate,
  BsDateFormat,
  BsDateInput,
  WeekdayIndex,
} from "nepali-date-library";
import type { MonthGridCell } from "nepali-date-library/datepicker-core";

export const MONTH_NAMES = [
  "बैशाख",
  "जेठ",
  "असार",
  "साउन",
  "भदौ",
  "असोज",
  "कार्तिक",
  "मंसिर",
  "पौष",
  "माघ",
  "फाल्गुन",
  "चैत",
] as const;
export const WEEKDAY_NAMES = [
  "आइतबार",
  "सोमबार",
  "मंगलबार",
  "बुधबार",
  "बिहीबार",
  "शुक्रबार",
  "शनिबार",
] as const;
export const WEEKDAY_SHORT_NAMES = [
  "आ",
  "सो",
  "मं",
  "बु",
  "बि",
  "शु",
  "श",
] as const;
export const DEFAULT_DECADE_SIZE = 10;

export type NepaliDatePickerType = "date" | "month" | "year";
export type NepaliDatePickerLevel = "day" | "month" | "year";
export type NepaliDatePickerSelectionType = "default" | "range";
export type NepaliNumeralSystem = "latin" | "nepali";
export type NepaliDatePickerSize = "sm" | "md" | "lg" | "xl" | number;
export type NepaliDatePickerSlot =
  | "root"
  | "label"
  | "description"
  | "inputShell"
  | "input"
  | "iconButton"
  | "clearButton"
  | "popper"
  | "calendar"
  | "header"
  | "navButton"
  | "headerLabel"
  | "table"
  | "weekday"
  | "cell"
  | "day"
  | "monthGrid"
  | "yearGrid"
  | "tile"
  | "children";

export type DateFormatter = BsDateFormat | ((date: BsDate) => string);
export type RangeInputValue = [BsDateInput | null, BsDateInput | null];
export type RangeValue = [BsDate | null, BsDate | null];
export type StyleObject = CSSProperties &
  Record<`--${string}`, string | number>;
export type NepaliDatePickerValue = BsDate | RangeValue | null;
export type NepaliDatePickerClassNames = Partial<
  Record<NepaliDatePickerSlot, string>
>;
export type NepaliDatePickerStyles = Partial<
  Record<NepaliDatePickerSlot, StyleObject>
>;
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

export interface NepaliDatePickerProps {
  size?: NepaliDatePickerSize;
  typeable?: boolean;
  type?: NepaliDatePickerSelectionType;
  value?: BsDateInput | RangeInputValue | null;
  selected?: BsDateInput | RangeInputValue | null;
  defaultValue?: BsDateInput | RangeInputValue | null;
  onChange?: (value: NepaliDatePickerValue) => void;
  min?: BsDateInput;
  max?: BsDateInput;
  minDate?: BsDateInput;
  maxDate?: BsDateInput;
  includeDates?: BsDateInput[];
  excludeDates?: BsDateInput[];
  holidays?: NepaliDateHolidayInput[];
  filterDate?: (date: BsDate) => boolean;
  isDateDisabled?: (date: BsDate) => boolean;
  weekStartsOn?: WeekdayIndex;
  calendarStartDay?: WeekdayIndex;
  inline?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  isClearable?: boolean;
  clearable?: boolean;
  shouldCloseOnSelect?: boolean;
  placeholderText?: string;
  label?: ReactNode;
  description?: ReactNode;
  pickerType?: NepaliDatePickerType;
  numeralSystem?: NepaliNumeralSystem;
  dateFormat?: DateFormatter;
  showIcon?: boolean;
  icon?: ReactNode;
  toggleCalendarOnIconClick?: boolean;
  customInput?: ReactElement<NepaliDatePickerCustomInputProps>;
  style?: StyleObject;
  className?: string;
  inputClassName?: string;
  calendarClassName?: string;
  popperClassName?: string;
  classNames?: NepaliDatePickerClassNames;
  styles?: NepaliDatePickerStyles;
  variables?: NepaliDatePickerVariables;
  dayClassName?: (date: BsDate, cell: MonthGridCell) => string;
  weekDayClassName?: (day: WeekdayIndex) => string;
  monthNames?: readonly string[];
  weekdayNames?: readonly string[];
  weekdayShortNames?: readonly string[];
  previousMonthLabel?: ReactNode;
  nextMonthLabel?: ReactNode;
  renderCustomHeader?: (props: NepaliDatePickerHeaderProps) => ReactNode;
  renderHeader?: (props: NepaliDatePickerHeaderProps) => ReactNode;
  renderDayContents?: (
    day: number,
    date: BsDate,
    cell: MonthGridCell,
  ) => ReactNode;
  renderCustomDayName?: (props: NepaliDatePickerDayNameProps) => ReactNode;
  onCalendarOpen?: () => void;
  onCalendarClose?: () => void;
  children?: ReactNode;
}

export interface DatePickerInputProps extends Omit<
  NepaliDatePickerProps,
  "pickerType"
> {}
export interface DateInputProps extends Omit<
  NepaliDatePickerProps,
  "pickerType"
> {}
export interface DatePickerProps extends Omit<
  NepaliDatePickerProps,
  "pickerType"
> {}
export interface MonthPickerInputProps extends Omit<
  NepaliDatePickerProps,
  "pickerType"
> {}
export interface MonthPickerProps extends Omit<
  NepaliDatePickerProps,
  "pickerType"
> {}
export interface YearPickerInputProps extends Omit<
  NepaliDatePickerProps,
  "pickerType"
> {}
export interface YearPickerProps extends Omit<
  NepaliDatePickerProps,
  "pickerType"
> {}
export interface CalendarProps extends Omit<
  NepaliDatePickerProps,
  "pickerType"
> {}

export interface HolidayMeta {
  label?: string;
  className?: string;
  disabled?: boolean;
}
