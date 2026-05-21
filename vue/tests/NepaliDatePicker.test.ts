import { describe, expect, test } from 'vitest';
import { mount } from '@vue/test-utils';
import { NepaliDatePicker } from '../src/NepaliDatePicker';

describe('NepaliDatePicker (Vue)', () => {
  test('renders the calendar grid correctly', () => {
    const wrapper = mount(NepaliDatePicker, {
      props: {
        defaultValue: { year: 2080, month: 1, day: 15 },
      },
    });

    // It should render the month label
    expect(wrapper.text()).toContain('बैशाख 2080');
    // It should render days, e.g. 15
    expect(wrapper.text()).toContain('15');
  });
});
