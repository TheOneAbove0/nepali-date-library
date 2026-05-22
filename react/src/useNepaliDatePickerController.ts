import { parseBsDate, type BsDate } from '@theoneabove0/nepalidatepicker';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type RefObject } from 'react';
import type { NepaliDatePickerLevel, NepaliDatePickerProps } from './NepaliDatePicker.types';
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
} from './NepaliDatePicker.utils';
import { useNepaliDatePickerState } from './useNepaliDatePicker';
import { useTypeableDateInput } from './useTypeableDateInput';

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
  numeralSystem: NonNullable<NepaliDatePickerProps['numeralSystem']>;
  picker: ReturnType<typeof useNepaliDatePickerState>;
  pickerType: NonNullable<NepaliDatePickerProps['pickerType']>;
  rangeDraft: [BsDate | null, BsDate | null];
  readOnly: boolean;
  rootRef: RefObject<HTMLDivElement | null>;
  selectedDate: BsDate | null;
  selectionType: NonNullable<NepaliDatePickerProps['type']>;
  clearValue: () => void;
  openCalendar: () => void;
  closeCalendar: () => void;
  onInputBlur: () => void;
  onInputKeyDown: (key: string) => void;
  onInputValueChange: (
    nextValue: string,
    cursorPosition?: number | null,
    isDeleting?: boolean,
  ) => void;
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
  const controlledValue = typeof props.value !== 'undefined' ? props.value : props.selected;
  const min = props.min ?? props.minDate;
  const max = props.max ?? props.maxDate;
  const weekStartsOn = props.firstDayOfWeek ?? props.weekStartsOn ?? props.calendarStartDay;
  const pickerType = props.pickerType ?? 'date';
  const numeralSystem = props.numeralSystem ?? 'latin';
  const selectionType = props.type ?? 'default';
  const isClearable = props.isClearable ?? props.clearable ?? false;
  const shouldCloseOnSelect = props.shouldCloseOnSelect ?? true;
  const rootRef = useRef<HTMLDivElement>(null);
  const calendarId = useId();

  const includeDateKeys = useMemo(() => toDateKeySet(props.includeDates), [props.includeDates]);
  const excludeDateKeys = useMemo(() => toDateKeySet(props.excludeDates), [props.excludeDates]);
  const holidays = useMemo(() => toHolidayMap(props.holidays), [props.holidays]);

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
    [excludeDateKeys, holidays, includeDateKeys, props.filterDate, props.isDateDisabled],
  );

  const rangeValue = useMemo(
    () => parseRangeValue(controlledValue ?? props.defaultValue, selectionType),
    [controlledValue, props.defaultValue, selectionType],
  );
  const singleValue = useMemo(
    () =>
      selectionType === 'range'
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
    selectionType === 'range' ? (rangeDraft[1] ?? rangeDraft[0]) : picker.state.selectedDate;
  const displayValue = useMemo(() => {
    if (props.valueFormatter) {
      return props.valueFormatter(selectionType === 'range' ? rangeDraft : (selectedDate ?? null));
    }

    return selectionType === 'range'
      ? formatRangeValue(rangeDraft, pickerType, props.dateFormat, numeralSystem)
      : selectedDate
        ? formatPickerValue(selectedDate, pickerType, props.dateFormat, numeralSystem)
        : '';
  }, [
    numeralSystem,
    pickerType,
    props.dateFormat,
    props.valueFormatter,
    rangeDraft,
    selectedDate,
    selectionType,
  ]);
  const isInputTypeable =
    Boolean(props.typeable) && selectionType === 'default' && !inline && !disabled && !readOnly;

  useEffect(() => {
    setCalendarLevel(getDefaultLevel(pickerType));
  }, [pickerType]);

  useEffect(() => {
    if (selectionType === 'range') {
      setRangeDraft(rangeValue);
    }
  }, [rangeValue, selectionType]);

  useEffect(() => {
    if (
      typeof controlledValue === 'undefined' ||
      selectionType === 'range' ||
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

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
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

      if (selectionType === 'range') {
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

      if (shouldCloseOnSelect) {
        closeCalendar();
      }
    },
    [
      closeCalendar,
      disabled,
      isDateDisabled,
      picker,
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

    if (selectionType === 'range') {
      const emptyRange: [null, null] = [null, null];
      setRangeDraft(emptyRange);
      props.onChange?.(emptyRange);
      return;
    }

    picker.setValue(null);
    props.onChange?.(null);
  }, [disabled, picker, props.onChange, readOnly, selectionType]);
  const { inputValue, onInputBlur, onInputKeyDown, onInputValueChange } = useTypeableDateInput({
    enabled: isInputTypeable,
    disabled,
    readOnly,
    displayValue,
    selectedDate,
    viewYear: picker.state.viewYear,
    viewMonth: picker.state.viewMonth,
    pickerType,
    numeralSystem,
    dateFormat: props.dateFormat,
    min,
    max,
    isDateDisabled,
    setValue: picker.setValue,
    focusDate: picker.focusDate,
    onChange: props.onChange,
  });

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
