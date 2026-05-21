# Nepali Date Library

Lightweight TypeScript utilities for Nepali BS and Gregorian date conversion, strict parsing, validation, and rendering-independent datepicker state.

## Packages

| Package                       | Purpose                                                                             |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| `nepali-date-library`         | Core conversion, formatting, manipulation, validation, and datepicker state engine. |
| `nepali-date-library-vanilla` | Framework-free DOM datepicker adapter.                                              |
| `nepali-date-library-react`   | Thin React wrapper around the shared datepicker core.                               |
| `nepali-date-library-vue`     | Thin Vue 3 wrapper around the shared datepicker core.                               |

## Developer Docs

- [Developer Guide](docs/DEVELOPER_GUIDE.md)
- [Lightweight Modernization Roadmap](docs/LIGHTWEIGHT_ROADMAP.md)
- [Accuracy Workflow](docs/ACCURACY.md)
- [Publishing And Versioning](docs/PUBLISHING.md)

## Docs UI

The modern documentation frontend lives in `docs-ui/` and is intentionally separate from the published packages.

```bash
cd docs-ui
npm install
npm run dev
```

Production build:

```bash
cd docs-ui
npm run build
```

## Core Install

```bash
npm install nepali-date-library
```

## Core Usage

```ts
import {
  parseAdDate,
  parseBsDate,
  isValidBsDate,
  addBsDays,
  formatBsDateNepali,
  toBS,
  toAD,
} from 'nepali-date-library';

const bs = toBS('2026-05-13');
const ad = toAD(2083, 1, 30);

parseAdDate('2026-05-13');
parseBsDate('2083-01-30');
isValidBsDate('2083-01-30');
formatBsDateNepali(addBsDays('2083-01-30', 1));
```

## Tree-Shakeable Imports

Use subpath imports when you only need one part of the library.

```ts
import { parseBsDate } from 'nepali-date-library/parsers';
import { isValidBsDate } from 'nepali-date-library/validators';
import { toBS } from 'nepali-date-library/conversion';
import { formatBsDateNepali } from 'nepali-date-library/formatting';
import { addBsDays } from 'nepali-date-library/manipulation';
import { generateMonthGrid } from 'nepali-date-library/datepicker-core';
```

## Core API

### Conversion

- `daysInMonth(year, month)`: returns number of days in a BS month.
- `toBS(greg)`: converts AD input to `{ year, month, day }` BS.
- `toDev(year, month, day)`: returns Devanagari date parts.
- `toAD(year, month, day)`: converts BS input to `{ year, month, day }` AD.

Accepted AD inputs:

- Strict `YYYY-MM-DD` string.
- JavaScript `Date` object, read as UTC date parts.

### Parsers And Validators

- `parseBsDate(input)`: parses strict `YYYY-MM-DD` BS strings or BS date objects.
- `parseAdDate(input)`: parses strict `YYYY-MM-DD` AD strings or `Date` objects.
- `isValidBsDate(input)`: validates BS date existence against the month table.

### Formatting And Manipulation

- `formatBsDate(input, format)`: formats BS dates as `YYYY-MM-DD`, `D MMMM YYYY`, or `DD MMMM YYYY`.
- `formatBsDateNepali(input)`: formats BS dates with Nepali numerals and month names.
- `formatAdDate(input)`: normalizes AD dates to `YYYY-MM-DD`.
- `formatAdAsBsDate(input, format)`: converts AD to BS and formats it.
- `addBsDays(input, days)` and `subtractBsDays(input, days)`: BS day arithmetic.
- `addBsMonths(input, months)` and `subtractBsMonths(input, months)`: BS month arithmetic with day clamping.
- `addBsYears(input, years)` and `subtractBsYears(input, years)`: BS year arithmetic with day clamping.

## Datepicker Core

The datepicker core has no DOM, jQuery, Bootstrap, React, or Vue dependency.

```ts
import {
  createDatePickerState,
  generateMonthGrid,
  navigateByKey,
} from 'nepali-date-library/datepicker-core';

const state = createDatePickerState({
  selectedDate: '2083-01-30',
  constraints: {
    min: '2083-01-01',
    max: '2083-12-30',
  },
});

const grid = generateMonthGrid(state.viewYear, state.viewMonth, {
  selectedDate: state.selectedDate,
  focusedDate: state.focusedDate,
  constraints: state.constraints,
});

const nextState = navigateByKey(state, 'ArrowRight');
```

The core exposes:

- Month grid generation.
- Keyboard navigation state.
- Min/max date constraints.
- Custom disabled-date callbacks.
- BS date arithmetic for picker navigation.

## Vanilla Wrapper

```bash
npm install nepali-date-library-vanilla nepali-date-library
```

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
```

## React Wrapper

```bash
npm install nepali-date-library-react nepali-date-library react react-dom
```

```tsx
import { useState } from 'react';
import { NepaliDatePicker } from 'nepali-date-library-react';

export function App() {
  const [value, setValue] = useState<string | null>(null);

  return <NepaliDatePicker value={value} onChange={setValue} min="2083-01-01" max="2083-12-30" />;
}
```

- AD to BS with `toBS()`.
- BS to AD with `toAD()`.

```bash
npm install nepali-date-library-vue nepali-date-library vue
```

```ts
import { createApp, ref } from 'vue';
import { NepaliDatePicker } from 'nepali-date-library-vue';

const App = {
  components: { NepaliDatePicker },
  setup() {
    const value = ref<string | null>(null);
    return { value };
  },
  template: '<NepaliDatePicker v-model="value" min="2083-01-01" max="2083-12-30" />',
};

createApp(App).mount('#app');
```

## Accuracy Workflow

Calendar data is maintained as explicit product data, not UI behavior.

```bash
cd js
npm run verify:references
```

The validator checks every row in `test-data/reference-dates.json` both ways:

- AD to BS with `toBik_euro()`.
- BS to AD with `toGreg_text()`.

Reference data should come from official publications, licensed datasets, or documented public pages. Hamro Patro can be used as a manual comparison source, but this repository should not scrape undocumented Hamro Patro endpoints.

## Local Development

```bash
cd js
npm install
npm test

cd ../react
npm install
npm run build

cd ../vue
npm install
npm run build

cd ../vanilla
npm install
npm run build

cd ../docs-ui
npm install
npm run build
```

## License

Apache-2.0
