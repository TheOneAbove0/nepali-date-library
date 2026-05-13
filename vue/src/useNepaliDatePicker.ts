import { computed, ref, watch, type ComputedRef, type Ref } from 'vue';
import {
  createDatePickerState,
  generateMonthGrid,
  navigateByKey,
  normalizeConstraints,
  type DatePickerKey,
  type MonthGrid,
  type DatePickerState,
  type WeekdayIndex,
} from 'nepali-date-library/datepicker-core';
import {
  parseBsDate,
  type BsDate,
  type BsDateInput,
} from 'nepali-date-library';

export interface UseNepaliDatePickerOptions {
  modelValue?: BsDateInput | null;
  defaultValue?: BsDateInput | null;
  min?: BsDateInput;
  max?: BsDateInput;
  isDateDisabled?: (date: BsDate) => boolean;
  weekStartsOn?: WeekdayIndex;
}

export interface UseNepaliDatePickerResult {
  state: Ref<DatePickerState>;
  grid: ComputedRef<MonthGrid>;
  setValue: (value: BsDateInput | null) => void;
  navigate: (key: DatePickerKey, options?: { shiftKey?: boolean }) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

export function useNepaliDatePicker(options: UseNepaliDatePickerOptions): UseNepaliDatePickerResult {
  const constraints = computed(() => normalizeConstraints({
    min: options.min,
    max: options.max,
    isDisabled: options.isDateDisabled,
  }));

  const initialValue = options.modelValue ?? options.defaultValue ?? undefined;

  const state = ref(createDatePickerState({
    selectedDate: initialValue ?? undefined,
    focusedDate: initialValue ?? undefined,
    constraints: constraints.value,
    weekStartsOn: options.weekStartsOn,
  }));

  watch(constraints, (nextConstraints) => {
    state.value = createDatePickerState({
      selectedDate: state.value.selectedDate ?? undefined,
      focusedDate: state.value.focusedDate,
      constraints: nextConstraints,
      weekStartsOn: state.value.weekStartsOn,
      viewYear: state.value.viewYear,
      viewMonth: state.value.viewMonth,
    });
  });

  if (typeof options.modelValue !== 'undefined') {
    watch(() => options.modelValue, (next) => {
      if (next === null) {
        state.value = { ...state.value, selectedDate: null };
        return;
      }

      if (typeof next !== 'undefined') {
        const parsed = parseBsDate(next);
        state.value = {
          ...state.value,
          selectedDate: parsed,
          focusedDate: parsed,
          viewYear: parsed.year,
          viewMonth: parsed.month,
        };
      }
    });
  }

  const grid = computed<MonthGrid>(() => generateMonthGrid(state.value.viewYear, state.value.viewMonth, {
    weekStartsOn: state.value.weekStartsOn,
    constraints: state.value.constraints,
    selectedDate: state.value.selectedDate,
    focusedDate: state.value.focusedDate,
  }));

  const setValue = (value: BsDateInput | null): void => {
    if (value === null) {
      state.value = { ...state.value, selectedDate: null };
      return;
    }

    const selected = parseBsDate(value);
    state.value = {
      ...state.value,
      selectedDate: selected,
      focusedDate: selected,
      viewYear: selected.year,
      viewMonth: selected.month,
    };
  };

  const navigate = (key: DatePickerKey, navOptions?: { shiftKey?: boolean }): void => {
    state.value = navigateByKey(state.value, key, navOptions);
  };

  const goToPreviousMonth = (): void => {
    state.value = navigateByKey(state.value, 'PageUp');
  };

  const goToNextMonth = (): void => {
    state.value = navigateByKey(state.value, 'PageDown');
  };

  return {
    state,
    grid,
    setValue,
    navigate,
    goToPreviousMonth,
    goToNextMonth,
  };
}
