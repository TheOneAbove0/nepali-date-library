import type { BsDate, BsDateInput } from 'nepali-date-library';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { NepaliDatePickerProps, NepaliDatePickerType } from './NepaliDatePicker.types';
import { formatPickerValue } from './NepaliDatePicker.utils';
import {
  buildTypedCandidateDate,
  formatTypedNumerals,
  getTypeableSeparator,
  isTypedCandidateOutOfRange,
  normalizeNumerals,
  parseTypedInputValue,
} from './NepaliDatePicker.typeable';

interface UseTypeableDateInputOptions {
  enabled: boolean;
  disabled: boolean;
  readOnly: boolean;
  displayValue: string;
  selectedDate: BsDate | null;
  viewYear: number;
  viewMonth: number;
  pickerType: NonNullable<NepaliDatePickerType>;
  numeralSystem: NonNullable<NepaliDatePickerProps['numeralSystem']>;
  dateFormat?: NepaliDatePickerProps['dateFormat'];
  min?: BsDateInput;
  max?: BsDateInput;
  isDateDisabled: (date: BsDate) => boolean;
  setValue: (value: BsDate | null) => void;
  focusDate: (value: BsDate) => void;
  onChange?: NepaliDatePickerProps['onChange'];
}

interface UseTypeableDateInputResult {
  inputValue: string;
  onInputBlur: () => void;
  onInputKeyDown: (key: string) => void;
  onInputValueChange: (
    nextValue: string,
    cursorPosition?: number | null,
    isDeleting?: boolean,
  ) => void;
}

export function useTypeableDateInput({
  enabled,
  disabled,
  readOnly,
  displayValue,
  selectedDate,
  viewYear,
  viewMonth,
  pickerType,
  numeralSystem,
  dateFormat,
  min,
  max,
  isDateDisabled,
  setValue,
  focusDate,
  onChange,
}: UseTypeableDateInputOptions): UseTypeableDateInputResult {
  const [typedInputValue, setTypedInputValue] = useState(displayValue);
  const separator = useMemo(() => getTypeableSeparator(dateFormat), [dateFormat]);

  useEffect(() => {
    setTypedInputValue(displayValue);
  }, [displayValue]);

  const syncTypedInput = useCallback(
    (candidateValue: string, cursorPosition?: number | null, isDeleting = false): void => {
      if (!enabled || disabled || readOnly) {
        return;
      }

      const rawValue = normalizeNumerals(candidateValue).trim();
      if (!rawValue) {
        setValue(null);
        onChange?.(null);
        setTypedInputValue('');
        return;
      }

      const typedInput = parseTypedInputValue(
        rawValue,
        separator,
        numeralSystem,
        pickerType,
        cursorPosition,
      );
      if (!typedInput.digits) {
        setTypedInputValue('');
        return;
      }

      const baseDate = selectedDate ?? { year: viewYear, month: viewMonth, day: 1 };
      const candidate = buildTypedCandidateDate({
        digits: typedInput.digits,
        parts: typedInput.parts,
        isComplete: isDeleting ? false : typedInput.isComplete,
        baseDate,
        pickerType,
      });

      if (isDeleting) {
        setTypedInputValue(formatTypedNumerals(rawValue, numeralSystem));
        if (candidate) {
          focusDate(candidate);
        }
        return;
      }

      setTypedInputValue(typedInput.displayValue);
      if (!candidate) {
        return;
      }

      // Partial input should guide the calendar without committing a value yet.
      if (!typedInput.isComplete) {
        focusDate(candidate);
        return;
      }

      if (isTypedCandidateOutOfRange(candidate, min, max) || isDateDisabled(candidate)) {
        setTypedInputValue(displayValue);
        return;
      }

      setValue(candidate);
      onChange?.(candidate);
      setTypedInputValue(formatPickerValue(candidate, pickerType, dateFormat, numeralSystem));
    },
    [
      dateFormat,
      disabled,
      displayValue,
      enabled,
      focusDate,
      isDateDisabled,
      max,
      min,
      numeralSystem,
      onChange,
      pickerType,
      readOnly,
      selectedDate,
      separator,
      setValue,
      viewMonth,
      viewYear,
    ],
  );

  const onInputValueChange = useCallback(
    (nextValue: string, cursorPosition?: number | null, isDeleting = false): void => {
      if (!enabled || disabled || readOnly) {
        return;
      }

      syncTypedInput(
        nextValue,
        cursorPosition,
        isDeleting || nextValue.length < typedInputValue.length,
      );
    },
    [disabled, enabled, readOnly, syncTypedInput, typedInputValue.length],
  );

  const onInputBlur = useCallback((): void => {
    syncTypedInput(typedInputValue);
  }, [syncTypedInput, typedInputValue]);

  const onInputKeyDown = useCallback(
    (key: string): void => {
      if (key === 'Enter') {
        syncTypedInput(typedInputValue);
      }
    },
    [syncTypedInput, typedInputValue],
  );

  return {
    inputValue: enabled ? typedInputValue : displayValue,
    onInputBlur,
    onInputKeyDown,
    onInputValueChange,
  };
}
