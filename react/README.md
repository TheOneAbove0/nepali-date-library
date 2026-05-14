# nepali-date-library-react

React date, month, and year pickers for Nepali BS dates, backed by `nepali-date-library/datepicker-core`.

## Install

```bash
yarn add nepali-date-library-react nepali-date-library react react-dom
```

```bash
npm i nepali-date-library-react nepali-date-library react react-dom
```

## Usage

```tsx
import { DatePickerInput } from 'nepali-date-library-react';
import { useState } from 'react';

export function App() {
  const [value, setValue] = useState(null);

  return (
    <DatePickerInput
      label="Pick date"
      placeholderText="Pick date"
      showIcon
      value={value}
      onChange={setValue}
      min="2082-01-01"
      max="2084-12-30"
    />
  );
}
```

## Customization

Available components:

- `DatePicker`
- `DatePickerInput`
- `DateInput`
- `MonthPicker`
- `MonthPickerInput`
- `YearPicker`
- `YearPickerInput`
- `Calendar`

The base `NepaliDatePicker` also supports input popup mode by default and inline calendar mode with `inline`.

Common customization props:

- `variables`
- `styles`
- `classNames`
- `typeable` (allow typing date directly in input mode)
- `size` (`"sm" | "md" | "lg" | "xl" | number`)
- `customInput`
- `monthNames`
- `weekdayNames`
- `weekdayShortNames`
- `showIcon`
- `clearable` / `isClearable`
- `includeDates`
- `excludeDates`
- `holidays`
- `filterDate`
- `min` / `max`
- `calendarStartDay`
- `numeralSystem`

```tsx
<DatePickerInput
  value={value}
  onChange={setValue}
  label="Holiday dates"
  placeholderText="Pick date"
  showIcon
  clearable
  holidays={[
    { date: '2083-01-01', label: 'New year', className: 'holiday-accent' },
    { date: '2083-01-15', label: 'Office closed', disabled: true },
  ]}
/>
```

Styling API:

```tsx
<DatePickerInput
  variables={{
    '--nepali-date-picker-accent': '#c97012',
    '--nepali-date-picker-input-radius': '18px',
    '--nepali-date-picker-calendar-radius': '22px',
  }}
  styles={{
    inputShell: { paddingInline: '4px' },
    day: { borderRadius: '14px' },
  }}
  classNames={{
    calendar: 'brand-calendar',
    day: 'brand-day',
  }}
/>
```

## Note

All grid/navigation/constraint logic is delegated to `nepali-date-library/datepicker-core`.
