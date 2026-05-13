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
