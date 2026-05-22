import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createDatePickerState,
  generateMonthGrid,
  navigateByKey,
  normalizeConstraints,
  type DatePickerKey,
  type DatePickerState,
  type MonthGrid,
  type WeekdayIndex,
} from '@theoneabove0/nepalidatepicker/datepicker-core';
import { parseBsDate, type BsDate, type BsDateInput } from '@theoneabove0/nepalidatepicker';

export interface UseNepaliDatePickerOptions {
  value?: BsDateInput | null;
  defaultValue?: BsDateInput | null;
  min?: BsDateInput;
  max?: BsDateInput;
  isDateDisabled?: (date: BsDate) => boolean;
  weekStartsOn?: WeekdayIndex;
}

export interface UseNepaliDatePickerResult {
  state: DatePickerState;
  grid: MonthGrid;
  setValue: (value: BsDateInput | null) => void;
  focusDate: (value: BsDateInput) => void;
  navigate: (key: DatePickerKey, options?: { shiftKey?: boolean }) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

export function useNepaliDatePickerState(
  options: UseNepaliDatePickerOptions,
): UseNepaliDatePickerResult {
  const constraints = useMemo(
    () =>
      normalizeConstraints({
        min: options.min,
        max: options.max,
        isDisabled: options.isDateDisabled,
      }),
    [options.min, options.max, options.isDateDisabled],
  );
  const weekStartsOn = options.weekStartsOn ?? 0;

  const initialValue = options.value ?? options.defaultValue ?? undefined;

  const [state, setState] = useState<DatePickerState>(() =>
    createDatePickerState({
      selectedDate: initialValue ?? undefined,
      focusedDate: initialValue ?? undefined,
      constraints,
      weekStartsOn,
    }),
  );

  useEffect(() => {
    setState((previous: DatePickerState) => ({
      ...previous,
      constraints,
      weekStartsOn,
    }));
  }, [constraints, weekStartsOn]);

  const grid = useMemo(
    () =>
      generateMonthGrid(state.viewYear, state.viewMonth, {
        weekStartsOn: state.weekStartsOn,
        constraints: state.constraints,
        selectedDate: state.selectedDate,
        focusedDate: state.focusedDate,
      }),
    [state],
  );

  const setValue = useCallback((value: BsDateInput | null): void => {
    setState((previous: DatePickerState) => {
      if (value === null) {
        return { ...previous, selectedDate: null };
      }

      const selected = parseBsDate(value);
      return {
        ...previous,
        selectedDate: selected,
        focusedDate: selected,
        viewYear: selected.year,
        viewMonth: selected.month,
      };
    });
  }, []);

  const focusDate = useCallback((value: BsDateInput): void => {
    const focused = parseBsDate(value);
    setState((previous: DatePickerState) => ({
      ...previous,
      focusedDate: focused,
      viewYear: focused.year,
      viewMonth: focused.month,
    }));
  }, []);

  const navigate = useCallback((key: DatePickerKey, navOptions?: { shiftKey?: boolean }): void => {
    setState((previous: DatePickerState) => navigateByKey(previous, key, navOptions));
  }, []);

  const goToPreviousMonth = useCallback((): void => {
    setState((previous: DatePickerState) => navigateByKey(previous, 'PageUp'));
  }, []);

  const goToNextMonth = useCallback((): void => {
    setState((previous: DatePickerState) => navigateByKey(previous, 'PageDown'));
  }, []);

  return useMemo(
    () => ({
      state,
      grid,
      setValue,
      focusDate,
      navigate,
      goToPreviousMonth,
      goToNextMonth,
    }),
    [focusDate, goToNextMonth, goToPreviousMonth, grid, navigate, setValue, state],
  );
}
