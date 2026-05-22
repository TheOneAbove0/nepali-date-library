# @theoneabove0/nepalidatepicker-vue

[![npm version](https://img.shields.io/npm/v/@theoneabove0/nepalidatepicker-vue.svg)](https://www.npmjs.com/package/@theoneabove0/nepalidatepicker-vue)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A simple, highly customizable, and reusable Nepali Datepicker component for Vue 3. Backed by the robust `nepalidatepicker/datepicker-core`.

**[View Live Demo & Documentation](https://nepali-date-library-ewoc-a0iyair2h-theoneabove0s-projects.vercel.app/)**

![Vue Nepali Date Picker Demo](./demo.png)

## Installation

The package can be installed via npm:

```bash
npm install @theoneabove0/nepalidatepicker-vue @theoneabove0/nepalidatepicker vue
```

Or via yarn:

```bash
yarn add @theoneabove0/nepalidatepicker-vue @theoneabove0/nepalidatepicker vue
```

You'll need to install Vue separately since it isn't included in the package.

## Basic Configuration

Below is a simple example of how to use the DatePicker in a Vue 3 component. The most basic use of the DatePicker can be described with:

```html
<template>
  <NepaliDatePicker
    v-model="value"
    min="2082-01-01"
    max="2084-12-30"
  />
</template>

<script>
import { ref } from 'vue';
import { NepaliDatePicker } from '@theoneabove0/nepalidatepicker-vue';

export default {
  components: { NepaliDatePicker },
  setup() {
    const value = ref(null);
    return { value };
  },
};
</script>
```

The base `NepaliDatePicker` supports input popup mode by default and inline calendar mode with the `inline` prop. 

See the [main website](https://nepali-date-library-ewoc-a0iyair2h-theoneabove0s-projects.vercel.app/) for a full list of props that may be passed to the component.

## Customization & Styling API

Easily customize the look and feel using CSS variables:

```html
<template>
  <NepaliDatePicker
    v-model="value"
    :variables="{
      '--nepali-date-picker-accent': '#c97012',
      '--nepali-date-picker-input-radius': '18px',
      '--nepali-date-picker-calendar-radius': '22px',
    }"
  />
</template>
```

You can also pass in custom properties like `holidays`, `min`, `max`, and change the `numeralSystem`.

## Browser Support & Note

All grid/navigation/constraint logic is delegated to `@theoneabove0/nepalidatepicker/datepicker-core`.
`@theoneabove0/nepalidatepicker-vue` only adapts Vue events/reactivity and rendering.
No BS conversion math or calendar algorithms are implemented in this wrapper, ensuring consistent and bug-free date math across environments!

## License

Copyright (c) 2024-Present and individual contributors. Licensed under Apache-2.0 license.
