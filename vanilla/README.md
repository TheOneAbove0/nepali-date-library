# nepalidatepicker-vanilla

Framework-free datepicker adapter powered by `nepalidatepicker/datepicker-core`.

## Install

```bash
npm i nepalidatepicker-vanilla nepalidatepicker
```

## Usage

```ts
import { NepaliDatePicker } from 'nepalidatepicker-vanilla';
import 'nepalidatepicker-vanilla/styles.css';

const picker = new NepaliDatePicker('#date-picker', {
  defaultValue: '2083-01-30',
  min: '2083-01-01',
  max: '2083-12-30',
  onChange(date) {
    console.log(date);
  },
});

picker.setValue('2083-02-01');
picker.destroy();
```

## Wrapper Boundary

`nepalidatepicker-vanilla` is a DOM adapter only:

- calendar state is created via `createDatePickerState()`
- month cells are derived via `generateMonthGrid()`
- keyboard movement uses `navigateByKey()`
- min/max/disabled checks are delegated to core constraints

No conversion logic is duplicated in this package.
