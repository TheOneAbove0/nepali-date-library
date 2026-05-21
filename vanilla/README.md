# nepali-date-library-vanilla

Framework-free datepicker adapter powered by `nepali-date-library/datepicker-core`.

## Install

```bash
npm i nepali-date-library-vanilla nepali-date-library
```

## Usage

```ts
import { NepaliDatePicker } from 'nepali-date-library-vanilla';
import 'nepali-date-library-vanilla/styles.css';

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

`nepali-date-library-vanilla` is a DOM adapter only:

- calendar state is created via `createDatePickerState()`
- month cells are derived via `generateMonthGrid()`
- keyboard movement uses `navigateByKey()`
- min/max/disabled checks are delegated to core constraints

No conversion logic is duplicated in this package.
