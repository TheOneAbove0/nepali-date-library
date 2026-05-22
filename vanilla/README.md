# @theoneabove0/nepalidatepicker-vanilla

[![npm version](https://img.shields.io/npm/v/@theoneabove0/nepalidatepicker-vanilla.svg)](https://www.npmjs.com/package/@theoneabove0/nepalidatepicker-vanilla)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A simple, highly customizable, and reusable framework-free Nepali Datepicker adapter. Backed by the robust `nepalidatepicker/datepicker-core`.

**[View Live Demo & Documentation](https://nepali-date-library-ewoc-a0iyair2h-theoneabove0s-projects.vercel.app/)**

![Vanilla Nepali Date Picker Demo](./demo.png)

## Installation

The package can be installed via npm:

```bash
npm install @theoneabove0/nepalidatepicker-vanilla @theoneabove0/nepalidatepicker
```

Or via yarn:

```bash
yarn add @theoneabove0/nepalidatepicker-vanilla @theoneabove0/nepalidatepicker
```

## Basic Configuration

Below is a simple example of how to use the DatePicker in a vanilla JavaScript/TypeScript project. Make sure to import the CSS styles as well.

```ts
import { NepaliDatePicker } from '@theoneabove0/nepalidatepicker-vanilla';
import '@theoneabove0/nepalidatepicker-vanilla/styles.css';

const picker = new NepaliDatePicker('#date-picker', {
  defaultValue: '2083-01-30',
  min: '2083-01-01',
  max: '2083-12-30',
  onChange(date) {
    console.log('Selected date:', date);
  },
});

// Update the value programmatically
picker.setValue('2083-02-01');

// Destroy the instance when no longer needed
// picker.destroy();
```

See the [main website](https://nepali-date-library-ewoc-a0iyair2h-theoneabove0s-projects.vercel.app/) for a full list of configuration options.

## Customization & Styling API

Easily customize the look and feel using standard CSS variables targeting the root element or a specific wrapper:

```css
:root {
  --nepali-date-picker-accent: #c97012;
  --nepali-date-picker-input-radius: 18px;
  --nepali-date-picker-calendar-radius: 22px;
}
```

## Browser Support & Note

All grid/navigation/constraint logic is delegated to `@theoneabove0/nepalidatepicker/datepicker-core`.
`@theoneabove0/nepalidatepicker-vanilla` is a DOM adapter only.
No BS conversion math or calendar algorithms are implemented in this wrapper, ensuring consistent and bug-free date math across environments!

## License

Copyright (c) 2024-Present and individual contributors. Licensed under Apache-2.0 license.
