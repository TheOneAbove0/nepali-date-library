import { defineComponent, h, type PropType } from 'vue';
import { type BsDate, type BsDateInput, type WeekdayIndex } from '@theoneabove0/nepalidatepicker';
import { useNepaliDatePicker } from './useNepaliDatePicker';

const MONTH_NAMES = [
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
];
const NAVIGATION_KEYS = new Set([
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
  'PageUp',
  'PageDown',
]);

/**
 * A basic Vue 3 wrapper for the Nepali Date Library core datepicker state.
 * This component provides a raw, unstyled grid to pick dates.
 */
export const NepaliDatePicker = defineComponent({
  name: 'NepaliDatePicker',
  props: {
    modelValue: {
      type: [String, Object] as PropType<BsDateInput | null>,
      default: undefined,
    },
    defaultValue: {
      type: [String, Object] as PropType<BsDateInput | null>,
      default: null,
    },
    min: {
      type: [String, Object] as PropType<BsDateInput | undefined>,
      default: undefined,
    },
    max: {
      type: [String, Object] as PropType<BsDateInput | undefined>,
      default: undefined,
    },
    weekStartsOn: {
      type: Number as PropType<WeekdayIndex>,
      default: 0,
    },
    isDateDisabled: {
      type: Function as PropType<(date: BsDate) => boolean>,
      default: undefined,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const picker = useNepaliDatePicker({
      modelValue: () => props.modelValue,
      defaultValue: () => props.defaultValue,
      min: () => props.min,
      max: () => props.max,
      weekStartsOn: () => props.weekStartsOn,
      isDateDisabled: () => props.isDateDisabled,
    });

    const selectDate = (date: BsDate): void => {
      if (picker.isDisabled(date)) {
        return;
      }

      picker.setValue(date);
      emit('update:modelValue', date);
      emit('change', date);
    };

    return () =>
      h('div', { class: 'nepali-date-picker' }, [
        h('div', { style: 'display:flex;gap:8px;align-items:center;' }, [
          h('button', { type: 'button', onClick: picker.goToPreviousMonth }, '<'),
          h(
            'strong',
            `${MONTH_NAMES[picker.state.value.viewMonth - 1]} ${picker.state.value.viewYear}`,
          ),
          h('button', { type: 'button', onClick: picker.goToNextMonth }, '>'),
        ]),
        h('table', [
          h(
            'tbody',
            picker.grid.value.weeks.map((week, weekIndex) =>
              h(
                'tr',
                { key: `w-${weekIndex}` },
                week.map((cell) =>
                  h('td', { key: `${cell.date.year}-${cell.date.month}-${cell.date.day}` }, [
                    h(
                      'button',
                      {
                        type: 'button',
                        disabled: cell.isDisabled,
                        onClick: () => selectDate(cell.date),
                        style: {
                          opacity: cell.inCurrentMonth ? '1' : '0.55',
                          fontWeight: cell.isSelected ? 'bold' : 'normal',
                          textDecoration: cell.isToday ? 'underline' : 'none',
                        },
                        onKeydown: (event: KeyboardEvent) => {
                          const key = event.key;
                          if (NAVIGATION_KEYS.has(key)) {
                            event.preventDefault();
                            picker.navigate(key as Parameters<typeof picker.navigate>[0], {
                              shiftKey: event.shiftKey,
                            });
                          }

                          if ((key === 'Enter' || key === ' ') && !cell.isDisabled) {
                            event.preventDefault();
                            selectDate(cell.date);
                          }
                        },
                      },
                      String(cell.date.day),
                    ),
                  ]),
                ),
              ),
            ),
          ),
        ]),
      ]);
  },
});
