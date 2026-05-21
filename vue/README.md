# nepali-date-library-vue

Thin Vue 3 wrapper around `nepali-date-library/datepicker-core`.

## Install

```bash
npm i nepali-date-library-vue nepali-date-library vue
```

## Usage

```ts
import { createApp, ref } from 'vue';
import { NepaliDatePicker } from 'nepali-date-library-vue';

const App = {
  components: { NepaliDatePicker },
  setup() {
    const value = ref(null);
    return { value };
  },
  template: `
    <NepaliDatePicker
      v-model="value"
      min="2082-01-01"
      max="2084-12-30"
    />
  `,
};

createApp(App).mount('#app');
```

## Note

All grid/navigation/constraint logic is delegated to `nepali-date-library/datepicker-core`.

## Wrapper Boundary

`nepali-date-library-vue` only adapts Vue events/reactivity and rendering:

- state creation and normalization come from `createDatePickerState()`
- grid generation comes from `generateMonthGrid()`
- keyboard navigation comes from `navigateByKey()`
- date constraints/disabled rules come from core constraint utilities

No BS conversion math or calendar algorithms are implemented in this wrapper.
