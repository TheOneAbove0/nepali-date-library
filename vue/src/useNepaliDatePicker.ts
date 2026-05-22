import { computed, ref, watch, type ComputedRef, type Ref } from 'vue';
import {
  createDatePickerState,
  generateMonthGrid,
  isDateDisabled,
  navigateByKey,
  normalizeConstraints,
  type DatePickerKey,
  type MonthGrid,
  type DatePickerState,
  type WeekdayIndex,
} from '@theoneabove0/nepalidatepicker/datepicker-core';
import { parseBsDate, type BsDate, type BsDateInput } from '@theoneabove0/nepalidatepicker';

/**
 * Options for the useNepaliDatePicker composition API hook.
 */
export interface UseNepaliDatePickerOptions {
  /** The controlled date value. */
  modelValue?: BsDateInput | null | (() => BsDateInput | null | undefined);
  /** The uncontrolled default date value. */
  defaultValue?: BsDateInput | null | (() => BsDateInput | null | undefined);
  /** Minimum selectable date (inclusive). */
  min?: BsDateInput | (() => BsDateInput | undefined);
  /** Maximum selectable date (inclusive). */
  max?: BsDateInput | (() => BsDateInput | undefined);
  /** Predicate function to dynamically disable specific dates. */
  isDateDisabled?: ((date: BsDate) => boolean) | (() => ((date: BsDate) => boolean) | undefined);
  /** The starting day of the week (0 = Sunday, 6 = Saturday). */
  weekStartsOn?: WeekdayIndex | (() => WeekdayIndex | undefined);
}

export interface UseNepaliDatePickerResult {
  state: Ref<DatePickerState>;
  grid: ComputedRef<MonthGrid>;
  setValue: (value: BsDateInput | null) => void;
  isDisabled: (date: BsDateInput) => boolean;
  navigate: (key: DatePickerKey, options?: { shiftKey?: boolean }) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

type MaybeGetter<T> = T | (() => T);
type DisabledPredicate = (date: BsDate) => boolean;
type DisabledOption = DisabledPredicate | (() => DisabledPredicate | undefined) | undefined;

function readOption<T>(value: MaybeGetter<T>): T {
  if (typeof value === 'function') {
    return (value as () => T)();
  }

  return value;
}

function readDisabledOption(value: DisabledOption): DisabledPredicate | undefined {
  if (typeof value !== 'function') {
    return undefined;
  }

  if (value.length === 0) {
    return (value as () => DisabledPredicate | undefined)();
  }

  return value as DisabledPredicate;
}

export function useNepaliDatePicker(
  options: UseNepaliDatePickerOptions,
): UseNepaliDatePickerResult {
  const modelValue = computed(() => readOption(options.modelValue));
  const weekStartsOn = computed(() => readOption(options.weekStartsOn));

  const constraints = computed(() =>
    normalizeConstraints({
      min: readOption(options.min),
      max: readOption(options.max),
      isDisabled: readDisabledOption(options.isDateDisabled),
    }),
  );

  const initialValue = modelValue.value ?? readOption(options.defaultValue) ?? undefined;

  const state = ref(
    createDatePickerState({
      selectedDate: initialValue ?? undefined,
      focusedDate: initialValue ?? undefined,
      constraints: constraints.value,
      weekStartsOn: weekStartsOn.value,
    }),
  );

  watch([constraints, weekStartsOn], ([nextConstraints, nextWeekStartsOn]) => {
    state.value = createDatePickerState({
      selectedDate: state.value.selectedDate ?? undefined,
      focusedDate: state.value.focusedDate,
      constraints: nextConstraints,
      weekStartsOn: nextWeekStartsOn ?? state.value.weekStartsOn,
      viewYear: state.value.viewYear,
      viewMonth: state.value.viewMonth,
    });
  });

  watch(modelValue, (next) => {
    if (typeof next === 'undefined') {
      return;
    }

    if (next === null) {
      state.value = { ...state.value, selectedDate: null };
      return;
    }

    const parsed = parseBsDate(next);
    state.value = {
      ...state.value,
      selectedDate: parsed,
      focusedDate: parsed,
      viewYear: parsed.year,
      viewMonth: parsed.month,
    };
  });

  const grid = computed<MonthGrid>(() =>
    generateMonthGrid(state.value.viewYear, state.value.viewMonth, {
      weekStartsOn: state.value.weekStartsOn,
      constraints: state.value.constraints,
      selectedDate: state.value.selectedDate,
      focusedDate: state.value.focusedDate,
    }),
  );

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

  const isDisabled = (value: BsDateInput): boolean => {
    return isDateDisabled(parseBsDate(value), state.value.constraints);
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
    isDisabled,
    navigate,
    goToPreviousMonth,
    goToNextMonth,
  };
}
