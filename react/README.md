# nepali-date-library-react

Thin React wrapper around `nepali-date-library/datepicker-core`.

## Install

```bash
npm i nepali-date-library-react nepali-date-library react react-dom
```

## Usage

```tsx
import { NepaliDatePicker } from 'nepali-date-library-react';
import { useState } from 'react';

export function App() {
  const [value, setValue] = useState(null);

  return (
    <NepaliDatePicker
      value={value}
      onChange={setValue}
      min="2082-01-01"
      max="2084-12-30"
    />
  );
}
```

## Note

All grid/navigation/constraint logic is delegated to `nepali-date-library/datepicker-core`.
