import {
  compareBsDate,
  daysInMonth,
  parseBsDate,
  type BsDate,
} from "nepali-date-library";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import type {
  NepaliDatePickerLevel,
  NepaliDatePickerProps,
} from "./NepaliDatePicker.types";
import {
  formatPickerValue,
  formatRangeValue,
  getDefaultLevel,
  getNextRange,
  parseRangeValue,
  parseSingleValue,
  toDateKey,
  toDateKeySet,
  toHolidayMap,
} from "./NepaliDatePicker.utils";
import { useNepaliDatePickerState } from "./useNepaliDatePicker";

export interface UseNepaliDatePickerControllerResult {
  calendarId: string;
  calendarLevel: NepaliDatePickerLevel;
  disabled: boolean;
  displayValue: string;
  holidays: ReturnType<typeof toHolidayMap>;
  inline: boolean;
  isInputTypeable: boolean;
  isClearable: boolean;
  isDateDisabled: (date: BsDate) => boolean;
  isOpen: boolean;
  inputValue: string;
  numeralSystem: NonNullable<NepaliDatePickerProps["numeralSystem"]>;
  picker: ReturnType<typeof useNepaliDatePickerState>;
  pickerType: NonNullable<NepaliDatePickerProps["pickerType"]>;
  rangeDraft: [BsDate | null, BsDate | null];
  readOnly: boolean;
  rootRef: RefObject<HTMLDivElement | null>;
  selectedDate: BsDate | null;
  selectionType: NonNullable<NepaliDatePickerProps["type"]>;
  clearValue: () => void;
  openCalendar: () => void;
  closeCalendar: () => void;
  onInputBlur: () => void;
  onInputKeyDown: (key: string) => void;
  onInputValueChange: (nextValue: string) => void;
  selectDate: (date: BsDate) => void;
  setCalendarLevel: (level: NepaliDatePickerLevel) => void;
  toggleCalendar: () => void;
}

export function useNepaliDatePickerController(
  props: NepaliDatePickerProps,
): UseNepaliDatePickerControllerResult {
  const disabled = Boolean(props.disabled);
  const readOnly = Boolean(props.readOnly);
  const inline = Boolean(props.inline);
  const controlledValue =
    typeof props.value !== "undefined" ? props.value : props.selected;
  const min = props.min ?? props.minDate;
  const max = props.max ?? props.maxDate;
  const weekStartsOn = props.weekStartsOn ?? props.calendarStartDay;
  const pickerType = props.pickerType ?? "date";
  const numeralSystem = props.numeralSystem ?? "latin";
  const selectionType = props.type ?? "default";
  const isClearable = props.isClearable ?? props.clearable ?? false;
  const shouldCloseOnSelect = props.shouldCloseOnSelect ?? true;
  const rootRef = useRef<HTMLDivElement>(null);
  const calendarId = useId();

  const includeDateKeys = useMemo(
    () => toDateKeySet(props.includeDates),
    [props.includeDates],
  );
  const excludeDateKeys = useMemo(
    () => toDateKeySet(props.excludeDates),
    [props.excludeDates],
  );
  const holidays = useMemo(
    () => toHolidayMap(props.holidays),
    [props.holidays],
  );

  const isDateDisabled = useCallback(
    (date: BsDate): boolean => {
      const key = toDateKey(date);

      if (includeDateKeys && !includeDateKeys.has(key)) {
        return true;
      }

      if (excludeDateKeys?.has(key)) {
        return true;
      }

      if (holidays.get(key)?.disabled) {
        return true;
      }

      if (props.filterDate && !props.filterDate(date)) {
        return true;
      }

      return Boolean(props.isDateDisabled?.(date));
    },
    [
      excludeDateKeys,
      holidays,
      includeDateKeys,
      props.filterDate,
      props.isDateDisabled,
    ],
  );

  const rangeValue = useMemo(
    () => parseRangeValue(controlledValue ?? props.defaultValue, selectionType),
    [controlledValue, props.defaultValue, selectionType],
  );
  const singleValue = useMemo(
    () =>
      selectionType === "range"
        ? (rangeValue[1] ?? rangeValue[0])
        : parseSingleValue(controlledValue ?? props.defaultValue),
    [controlledValue, props.defaultValue, rangeValue, selectionType],
  );

  const picker = useNepaliDatePickerState({
    value: singleValue,
    defaultValue: singleValue,
    min,
    max,
    isDateDisabled,
    weekStartsOn,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [calendarLevel, setCalendarLevel] = useState<NepaliDatePickerLevel>(
    getDefaultLevel(pickerType),
  );
  const [rangeDraft, setRangeDraft] = useState(rangeValue);

  const selectedDate =
    selectionType === "range"
      ? (rangeDraft[1] ?? rangeDraft[0])
      : picker.state.selectedDate;
  const displayValue = useMemo(
    () =>
      selectionType === "range"
        ? formatRangeValue(
            rangeDraft,
            pickerType,
            props.dateFormat,
            numeralSystem,
          )
        : selectedDate
          ? formatPickerValue(
              selectedDate,
              pickerType,
              props.dateFormat,
              numeralSystem,
            )
          : "",
    [
      numeralSystem,
      pickerType,
      props.dateFormat,
      rangeDraft,
      selectedDate,
      selectionType,
    ],
  );
  const isInputTypeable =
    Boolean(props.typeable) &&
    selectionType === "default" &&
    !inline &&
    !disabled &&
    !readOnly;
  const [typedInputValue, setTypedInputValue] = useState(displayValue);
  const inputValue = isInputTypeable ? typedInputValue : displayValue;
  const typeableSeparator = useMemo(
    () => getTypeableSeparator(props.dateFormat),
    [props.dateFormat],
  );
  const typeableDigits = useMemo(
    () => getTypeableDigits(pickerType),
    [pickerType],
  );

  useEffect(() => {
    setCalendarLevel(getDefaultLevel(pickerType));
  }, [pickerType]);

  useEffect(() => {
    if (selectionType === "range") {
      setRangeDraft(rangeValue);
    }
  }, [rangeValue, selectionType]);

  useEffect(() => {
    setTypedInputValue(displayValue);
  }, [displayValue]);

  useEffect(() => {
    if (
      typeof controlledValue === "undefined" ||
      selectionType === "range" ||
      Array.isArray(controlledValue)
    ) {
      return;
    }

    if (controlledValue === null) {
      picker.setValue(null);
      return;
    }

    picker.setValue(parseBsDate(controlledValue));
  }, [controlledValue, picker.setValue, selectionType]);

  const closeCalendar = useCallback((): void => {
    if (inline || !isOpen) {
      return;
    }

    setIsOpen(false);
    props.onCalendarClose?.();
  }, [inline, isOpen, props.onCalendarClose]);

  useEffect(() => {
    if (!isOpen || inline) {
      return;
    }

    const onPointerDown = (event: MouseEvent): void => {
      if (!rootRef.current || rootRef.current.contains(event.target as Node)) {
        return;
      }

      closeCalendar();
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [closeCalendar, inline, isOpen]);

  const openCalendar = useCallback((): void => {
    if (disabled || readOnly || inline || isOpen) {
      return;
    }

    setCalendarLevel(getDefaultLevel(pickerType));
    setIsOpen(true);
    props.onCalendarOpen?.();
  }, [disabled, inline, isOpen, pickerType, props.onCalendarOpen, readOnly]);

  const selectDate = useCallback(
    (date: BsDate): void => {
      if (disabled || isDateDisabled(date)) {
        return;
      }

      if (selectionType === "range") {
        const nextRange = getNextRange(rangeDraft, date);
        setRangeDraft(nextRange);
        picker.setValue(date);
        props.onChange?.(nextRange);

        if (shouldCloseOnSelect && nextRange[0] && nextRange[1]) {
          closeCalendar();
        }

        return;
      }

      picker.setValue(date);
      props.onChange?.(date);
      setTypedInputValue(
        formatPickerValue(date, pickerType, props.dateFormat, numeralSystem),
      );

      if (shouldCloseOnSelect) {
        closeCalendar();
      }
    },
    [
      closeCalendar,
      disabled,
      isDateDisabled,
      numeralSystem,
      picker,
      pickerType,
      props.dateFormat,
      props.onChange,
      rangeDraft,
      selectionType,
      shouldCloseOnSelect,
    ],
  );

  const clearValue = useCallback((): void => {
    if (disabled || readOnly) {
      return;
    }

    if (selectionType === "range") {
      const emptyRange: [null, null] = [null, null];
      setRangeDraft(emptyRange);
      props.onChange?.(emptyRange);
      return;
    }

    picker.setValue(null);
    props.onChange?.(null);
    setTypedInputValue("");
  }, [disabled, picker, props.onChange, readOnly, selectionType]);

  const syncTypedInput = useCallback(
    (candidateValue: string): void => {
      if (!isInputTypeable || disabled || readOnly) {
        return;
      }

      const typedSeparator =
        detectTypedSeparator(candidateValue) ?? typeableSeparator;

      const rawValue = normalizeTypedInput(
        candidateValue,
        typedSeparator,
      ).trim();

      if (!rawValue) {
        picker.setValue(null);
        props.onChange?.(null);
        setTypedInputValue("");
        return;
      }

      const digits = extractDigits(rawValue).slice(0, typeableDigits);
      if (!digits) {
        setTypedInputValue("");
        return;
      }

      const formattedValue = formatTypedInputValue(
        digits,
        typedSeparator,
        numeralSystem,
        pickerType,
      );
      setTypedInputValue(formattedValue);

      const candidate = buildTypedCandidateDate({
        digits,
        baseDate: selectedDate ?? {
          year: picker.state.viewYear,
          month: picker.state.viewMonth,
          day: 1,
        },
        pickerType,
      });

      if (!candidate) {
        return;
      }

      if (digits.length < typeableDigits) {
        picker.focusDate(candidate);
        return;
      }

      if (
        (min && compareBsDate(candidate, parseBsDate(min)) < 0) ||
        (max && compareBsDate(candidate, parseBsDate(max)) > 0) ||
        isDateDisabled(candidate)
      ) {
        setTypedInputValue(displayValue);
        return;
      }

      picker.setValue(candidate);
      props.onChange?.(candidate);
      setTypedInputValue(
        formatPickerValue(
          candidate,
          pickerType,
          props.dateFormat,
          numeralSystem,
        ),
      );
    },
    [
      disabled,
      displayValue,
      isDateDisabled,
      isInputTypeable,
      max,
      min,
      numeralSystem,
      picker,
      pickerType,
      props.dateFormat,
      props.onChange,
      readOnly,
      typeableSeparator,
      selectedDate,
      typeableDigits,
    ],
  );

  const onInputValueChange = useCallback(
    (nextValue: string): void => {
      if (!isInputTypeable || disabled || readOnly) {
        return;
      }

      syncTypedInput(nextValue);
    },
    [disabled, isInputTypeable, readOnly, syncTypedInput],
  );

  const onInputBlur = useCallback((): void => {
    syncTypedInput(typedInputValue);
  }, [syncTypedInput, typedInputValue]);

  const onInputKeyDown = useCallback(
    (key: string): void => {
      if (key === "Enter") {
        syncTypedInput(typedInputValue);
      }
    },
    [syncTypedInput, typedInputValue],
  );

  const toggleCalendar = useCallback((): void => {
    if (disabled || readOnly) {
      return;
    }

    if (isOpen) {
      closeCalendar();
      return;
    }

    openCalendar();
  }, [closeCalendar, disabled, isOpen, openCalendar, readOnly]);

  return {
    calendarId,
    calendarLevel,
    clearValue,
    closeCalendar,
    disabled,
    displayValue,
    holidays,
    inline,
    inputValue,
    isInputTypeable,
    isClearable,
    isDateDisabled,
    isOpen,
    numeralSystem,
    openCalendar,
    onInputBlur,
    onInputKeyDown,
    onInputValueChange,
    picker,
    pickerType,
    rangeDraft,
    readOnly,
    rootRef,
    selectDate,
    selectedDate,
    selectionType,
    setCalendarLevel,
    toggleCalendar,
  };
}

function normalizeNumerals(value: string): string {
  return value.replace(/[०-९]/g, (digit) =>
    String("०१२३४५६७८९".indexOf(digit)),
  );
}

function normalizeTypedInput(value: string, separator: string): string {
  return normalizeNumerals(value).replace(/[-/.]/g, separator);
}

function detectTypedSeparator(value: string): string | undefined {
  return value.match(/[-/.]/)?.[0];
}

function extractDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function formatTypedInputValue(
  value: string,
  separator: string,
  numeralSystem: NonNullable<NepaliDatePickerProps["numeralSystem"]>,
  pickerType: NonNullable<NepaliDatePickerProps["pickerType"]>,
): string {
  const digits = extractDigits(normalizeNumerals(value)).slice(
    0,
    getTypeableDigits(pickerType),
  );
  if (!digits) {
    return "";
  }

  const formattedDigits =
    numeralSystem === "nepali"
      ? digits.replace(/\d/g, (digit) => "०१२३४५६७८९"[Number(digit)] ?? digit)
      : digits;

  if (pickerType === "year") {
    return formattedDigits.slice(0, 4);
  }

  if (pickerType === "month") {
    return formattedDigits.slice(0, 2);
  }

  if (formattedDigits.length <= 4) {
    return formattedDigits;
  }

  if (formattedDigits.length <= 6) {
    return `${formattedDigits.slice(0, 4)}${separator}${formattedDigits.slice(4)}`;
  }

  return `${formattedDigits.slice(0, 4)}${separator}${formattedDigits.slice(4, 6)}${separator}${formattedDigits.slice(6)}`;
}

function buildTypedCandidateDate({
  digits,
  baseDate,
  pickerType,
}: {
  digits: string;
  baseDate: BsDate;
  pickerType: NonNullable<NepaliDatePickerProps["pickerType"]>;
}): BsDate | null {
  if (pickerType === "year") {
    if (digits.length < 4) {
      return null;
    }

    const year = Number(digits.slice(0, 4));
    return { year, month: 1, day: 1 };
  }

  if (pickerType === "month") {
    if (digits.length < 1) {
      return null;
    }

    const year = baseDate.year;
    const month = Number(digits.slice(0, 2));
    if (!Number.isFinite(month) || month < 1 || month > 12) {
      return null;
    }

    return { year, month, day: 1 };
  }

  if (digits.length < 8) {
    return null;
  }

  const year = Number(digits.slice(0, 4));
  const month = Number(digits.slice(4, 6));
  const safeMonth =
    Number.isFinite(month) && month >= 1 && month <= 12
      ? month
      : baseDate.month;
  const day = Number(digits.slice(6, 8));
  const safeDay =
    Number.isFinite(day) && day >= 1
      ? Math.min(day, daysInMonth(year, safeMonth))
      : baseDate.day;

  return {
    year,
    month: safeMonth,
    day: safeDay,
  };
}

function getTypeableDigits(
  pickerType: NonNullable<NepaliDatePickerProps["pickerType"]>,
): number {
  if (pickerType === "year") {
    return 4;
  }

  if (pickerType === "month") {
    return 2;
  }

  return 8;
}

function getTypeableSeparator(
  dateFormat: NepaliDatePickerProps["dateFormat"],
): string {
  if (typeof dateFormat !== "string") {
    return "-";
  }

  const separator = dateFormat.match(/[-/.]/)?.[0];
  return separator ?? "-";
}
