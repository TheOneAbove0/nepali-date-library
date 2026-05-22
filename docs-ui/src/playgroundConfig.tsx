import type { ReactNode } from 'react';
import {
  DateInput,
  DatePicker,
  DatePickerInput,
  DateTimePicker,
  MonthPicker,
  MonthPickerInput,
  TimeInput,
  TimePicker,
  YearPicker,
  YearPickerInput,
} from 'nepalidatepicker-react';
import type { BsDate } from 'nepalidatepicker';
import type { NepaliNumeralSystem } from 'nepalidatepicker-react';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { toDateRange, toSingleDate } from './docsShared';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PlaygroundTab {
  id: string;
  label: string;
  description: string;
  valueType: string;
  defaultValue: unknown;
  render: (
    value: never,
    setValue: (v: never) => void,
    numeralSystem: NepaliNumeralSystem,
    disabled: boolean,
    readOnly: boolean,
  ) => ReactNode;
  formatValue: (value: never) => string;
  code: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const inputIcons = {
  left: <CalendarDays size={16} strokeWidth={1.8} />,
  right: <ChevronDown size={16} strokeWidth={1.8} />,
};

function formatBsValue(value: BsDate | null): string {
  if (!value) return 'null';
  return `{ year: ${value.year}, month: ${value.month}, day: ${value.day} }`;
}

function formatRangeValue(value: [BsDate | null, BsDate | null]): string {
  return `[${formatBsValue(value[0])}, ${formatBsValue(value[1])}]`;
}

function formatDateTimeValue(value: { date: BsDate | null; time: string }): string {
  return `{ date: ${formatBsValue(value.date)}, time: "${value.time}" }`;
}

/* ------------------------------------------------------------------ */
/*  Tab definitions                                                    */
/* ------------------------------------------------------------------ */

export const playgroundTabs: PlaygroundTab[] = [
  {
    id: 'date-picker-input',
    label: 'DatePickerInput',
    description: 'Input field with a dropdown calendar for picking a single BS date.',
    valueType: 'BsDate | null',
    defaultValue: null,
    render: (
      value: BsDate | null,
      setValue: (v: BsDate | null) => void,
      numeralSystem: NepaliNumeralSystem,
      disabled: boolean,
      readOnly: boolean,
    ) => (
      <DatePickerInput
        numeralSystem={numeralSystem}
        disabled={disabled}
        readOnly={readOnly}
        label="Pick date"
        placeholderText="Pick date"
        leftSection={inputIcons.left}
        rightSection={inputIcons.right}
        value={value}
        onChange={(next) => setValue(toSingleDate(next))}
      />
    ),
    formatValue: (v: BsDate | null) => formatBsValue(v),
    code: `import { useState } from 'react';
import { DatePickerInput } from 'nepalidatepicker-react';
import type { BsDate } from 'nepalidatepicker';
import { CalendarDays, ChevronDown } from 'lucide-react';

function Demo() {
  const [value, setValue] = useState<BsDate | null>(null);

  return (
    <>
      <DatePickerInput
        label="Pick date"
        placeholderText="Pick date"
        numeralSystem="nepali"
        leftSection={<CalendarDays size={16} strokeWidth={1.8} />}
        rightSection={<ChevronDown size={16} strokeWidth={1.8} />}
        value={value}
        onChange={setValue}
      />
      <p>Selected: {value ? JSON.stringify(value) : 'null'}</p>
    </>
  );
}`,
  },
  {
    id: 'date-input',
    label: 'DateInput',
    description: 'Clearable input alias with the same dropdown calendar surface.',
    valueType: 'BsDate | null',
    defaultValue: null,
    render: (
      value: BsDate | null,
      setValue: (v: BsDate | null) => void,
      numeralSystem: NepaliNumeralSystem,
      disabled: boolean,
      readOnly: boolean,
    ) => (
      <DateInput
        numeralSystem={numeralSystem}
        disabled={disabled}
        readOnly={readOnly}
        clearable
        label="Pick date"
        placeholderText="Pick date"
        leftSection={inputIcons.left}
        rightSection={inputIcons.right}
        value={value}
        onChange={(next) => setValue(toSingleDate(next))}
      />
    ),
    formatValue: (v: BsDate | null) => formatBsValue(v),
    code: `import { useState } from 'react';
import { DateInput } from 'nepalidatepicker-react';
import type { BsDate } from 'nepalidatepicker';
import { CalendarDays, ChevronDown } from 'lucide-react';

function Demo() {
  const [value, setValue] = useState<BsDate | null>(null);

  return (
    <>
      <DateInput
        clearable
        label="Pick date"
        placeholderText="Pick date"
        numeralSystem="nepali"
        leftSection={<CalendarDays size={16} strokeWidth={1.8} />}
        rightSection={<ChevronDown size={16} strokeWidth={1.8} />}
        value={value}
        onChange={setValue}
      />
      <p>Selected: {value ? JSON.stringify(value) : 'null'}</p>
    </>
  );
}`,
  },
  {
    id: 'typeable-date-input',
    label: 'Typeable',
    description: 'Type a BS date directly into the input, then press Enter or blur to commit.',
    valueType: 'BsDate | null',
    defaultValue: null,
    render: (
      value: BsDate | null,
      setValue: (v: BsDate | null) => void,
      numeralSystem: NepaliNumeralSystem,
      disabled: boolean,
      readOnly: boolean,
    ) => (
      <DatePickerInput
        numeralSystem={numeralSystem}
        disabled={disabled}
        readOnly={readOnly}
        label="Typeable date input"
        placeholderText="YYYY-MM-DD"
        leftSection={inputIcons.left}
        rightSection={inputIcons.right}
        typeable
        value={value}
        onChange={(next) => setValue(toSingleDate(next))}
      />
    ),
    formatValue: (v: BsDate | null) => formatBsValue(v),
    code: `import { useState } from 'react';
import { DatePickerInput } from 'nepalidatepicker-react';
import type { BsDate } from 'nepalidatepicker';
import { CalendarDays, ChevronDown } from 'lucide-react';

function Demo() {
  const [value, setValue] = useState<BsDate | null>(null);

  return (
    <>
      <DatePickerInput
        label="Typeable date input"
        placeholderText="YYYY-MM-DD"
        typeable
        numeralSystem="nepali"
        leftSection={<CalendarDays size={16} strokeWidth={1.8} />}
        rightSection={<ChevronDown size={16} strokeWidth={1.8} />}
        value={value}
        onChange={setValue}
      />
      <p>Selected: {value ? JSON.stringify(value) : 'null'}</p>
    </>
  );
}`,
  },
  {
    id: 'date-picker',
    label: 'DatePicker',
    description:
      'Inline day picker for dashboards, forms, and embedded calendar panels. Calendar is an alias for this component.',
    valueType: 'BsDate | null',
    defaultValue: null,
    render: (
      value: BsDate | null,
      setValue: (v: BsDate | null) => void,
      numeralSystem: NepaliNumeralSystem,
      disabled: boolean,
      readOnly: boolean,
    ) => (
      <DatePicker
        numeralSystem={numeralSystem}
        disabled={disabled}
        readOnly={readOnly}
        value={value}
        onChange={(next) => setValue(toSingleDate(next))}
      />
    ),
    formatValue: (v: BsDate | null) => formatBsValue(v),
    code: `import { useState } from 'react';
import { DatePicker } from 'nepalidatepicker-react';
import type { BsDate } from 'nepalidatepicker';

function Demo() {
  const [value, setValue] = useState<BsDate | null>(null);

  return (
    <>
      <DatePicker numeralSystem="nepali" value={value} onChange={setValue} />
      <p>Selected: {value ? JSON.stringify(value) : 'null'}</p>
    </>
  );
}`,
  },
  {
    id: 'date-range',
    label: 'Date Range',
    description: 'Set type="range" to pick a start and end date from the same calendar.',
    valueType: '[BsDate | null, BsDate | null]',
    defaultValue: [null, null],
    render: (
      value: [BsDate | null, BsDate | null],
      setValue: (v: [BsDate | null, BsDate | null]) => void,
      numeralSystem: NepaliNumeralSystem,
      disabled: boolean,
      readOnly: boolean,
    ) => (
      <DatePicker
        numeralSystem={numeralSystem}
        disabled={disabled}
        readOnly={readOnly}
        type="range"
        value={value}
        onChange={(next) => setValue(toDateRange(next))}
      />
    ),
    formatValue: (v: [BsDate | null, BsDate | null]) => formatRangeValue(v),
    code: `import { useState } from 'react';
import { DatePicker } from 'nepalidatepicker-react';
import type { BsDate } from 'nepalidatepicker';

function Demo() {
  const [value, setValue] = useState<[BsDate | null, BsDate | null]>([null, null]);

  return (
    <>
      <DatePicker
        type="range"
        numeralSystem="nepali"
        value={value}
        onChange={setValue}
      />
      <p>Start: {value[0] ? JSON.stringify(value[0]) : 'null'}</p>
      <p>End: {value[1] ? JSON.stringify(value[1]) : 'null'}</p>
    </>
  );
}`,
  },
  {
    id: 'date-time-picker',
    label: 'DateTimePicker',
    description: 'Combined BS date + time picker with 12h/24h format support.',
    valueType: '{ date: BsDate | null; time: string }',
    defaultValue: { date: null, time: '' },
    render: (
      value: { date: BsDate | null; time: string },
      setValue: (v: { date: BsDate | null; time: string }) => void,
      numeralSystem: NepaliNumeralSystem,
      disabled: boolean,
      readOnly: boolean,
    ) => (
      <DateTimePicker
        numeralSystem={numeralSystem}
        disabled={disabled}
        readOnly={readOnly}
        clearable
        label="Pick date and time"
        placeholderText="Pick date and time"
        leftSection={inputIcons.left}
        rightSection={inputIcons.right}
        timePickerProps={{ format: '24h', withDropdown: false }}
        timeLabel="Time"
        value={value}
        onChange={setValue}
      />
    ),
    formatValue: (v: { date: BsDate | null; time: string }) => formatDateTimeValue(v),
    code: `import { useState } from 'react';
import { DateTimePicker } from 'nepalidatepicker-react';
import type { BsDate } from 'nepalidatepicker';
import { CalendarDays, ChevronDown } from 'lucide-react';

function Demo() {
  const [value, setValue] = useState<{
    date: BsDate | null;
    time: string;
  }>({
    date: null,
    time: '',
  });

  return (
    <>
      <DateTimePicker
        clearable
        label="Pick date and time"
        placeholderText="Pick date and time"
        numeralSystem="nepali"
        leftSection={<CalendarDays size={16} strokeWidth={1.8} />}
        rightSection={<ChevronDown size={16} strokeWidth={1.8} />}
        timePickerProps={{ format: '24h', withDropdown: false }}
        value={value}
        onChange={setValue}
      />
      <p>Date: {value.date ? JSON.stringify(value.date) : 'null'}</p>
      <p>Time: {value.time || 'none'}</p>
    </>
  );
}`,
  },
  {
    id: 'time-input',
    label: 'TimeInput',
    description: 'Native browser time input with an optional clock trigger button.',
    valueType: 'string',
    defaultValue: '',
    render: (
      value: string,
      setValue: (v: string) => void,
      numeralSystem: NepaliNumeralSystem,
      disabled: boolean,
      readOnly: boolean,
    ) => (
      <TimeInput
        label="Pick time"
        description="Uses the browser's native time picker."
        showPickerButton
        numeralSystem={numeralSystem}
        disabled={disabled}
        readOnly={readOnly}
        value={value}
        onChange={setValue}
      />
    ),
    formatValue: (v: string) => `"${v}"`,
    code: `import { useState, useRef } from 'react';
import { TimeInput } from 'nepalidatepicker-react';

function Demo() {
  const ref = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState('');

  return (
    <>
      <TimeInput
        label="Pick time"
        ref={ref}
        showPickerButton
        value={value}
        onChange={setValue}
      />
      <p>Selected time: {value || 'none'}</p>
    </>
  );
}`,
  },
  {
    id: 'time-picker',
    label: 'TimePicker',
    description: 'Custom select-based time picker with 12h/24h format and optional seconds.',
    valueType: 'string',
    defaultValue: '',
    render: (
      value: string,
      setValue: (v: string) => void,
      numeralSystem: NepaliNumeralSystem,
      disabled: boolean,
      readOnly: boolean,
    ) => (
      <div style={{ width: '100%', maxWidth: 420 }}>
        <TimePicker
          label="Pick time"
          withSeconds
          withDropdown
          numeralSystem={numeralSystem}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          onChange={setValue}
        />
      </div>
    ),
    formatValue: (v: string) => (v ? `"${v}"` : '""'),
    code: `import { useState } from 'react';
import { TimePicker } from 'nepalidatepicker-react';

function Demo() {
  const [value, setValue] = useState('');

  return (
    <>
      <TimePicker
        label="Pick time"
        withSeconds
        withDropdown
        value={value}
        onChange={setValue}
      />
      <p>Selected time: {value || 'none'}</p>
    </>
  );
}`,
  },
  {
    id: 'month-picker-input',
    label: 'MonthPickerInput',
    description: 'Dropdown month selector with the same compact input shell.',
    valueType: 'BsDate | null',
    defaultValue: null,
    render: (
      value: BsDate | null,
      setValue: (v: BsDate | null) => void,
      numeralSystem: NepaliNumeralSystem,
      disabled: boolean,
      readOnly: boolean,
    ) => (
      <MonthPickerInput
        numeralSystem={numeralSystem}
        disabled={disabled}
        readOnly={readOnly}
        label="Pick month"
        placeholderText="Pick month"
        value={value}
        onChange={(next) => setValue(toSingleDate(next))}
      />
    ),
    formatValue: (v: BsDate | null) => formatBsValue(v),
    code: `import { useState } from 'react';
import { MonthPickerInput } from 'nepalidatepicker-react';
import type { BsDate } from 'nepalidatepicker';
import { CalendarDays, ChevronDown } from 'lucide-react';

function Demo() {
  const [value, setValue] = useState<BsDate | null>(null);

  return (
    <>
      <MonthPickerInput
        label="Pick month"
        placeholderText="Pick month"
        numeralSystem="nepali"
        leftSection={<CalendarDays size={16} strokeWidth={1.8} />}
        rightSection={<ChevronDown size={16} strokeWidth={1.8} />}
        value={value}
        onChange={setValue}
      />
      <p>Selected: {value ? \`\${value.year}-\${value.month}\` : 'null'}</p>
    </>
  );
}`,
  },
  {
    id: 'month-picker',
    label: 'MonthPicker',
    description: 'Inline month grid with year navigation.',
    valueType: 'BsDate | null',
    defaultValue: null,
    render: (
      value: BsDate | null,
      setValue: (v: BsDate | null) => void,
      numeralSystem: NepaliNumeralSystem,
      disabled: boolean,
      readOnly: boolean,
    ) => (
      <MonthPicker
        numeralSystem={numeralSystem}
        disabled={disabled}
        readOnly={readOnly}
        value={value}
        onChange={(next) => setValue(toSingleDate(next))}
      />
    ),
    formatValue: (v: BsDate | null) => formatBsValue(v),
    code: `import { useState } from 'react';
import { MonthPicker } from 'nepalidatepicker-react';
import type { BsDate } from 'nepalidatepicker';

function Demo() {
  const [value, setValue] = useState<BsDate | null>(null);

  return (
    <>
      <MonthPicker numeralSystem="nepali" value={value} onChange={setValue} />
      <p>Selected: {value ? \`\${value.year}-\${value.month}\` : 'null'}</p>
    </>
  );
}`,
  },
  {
    id: 'year-picker-input',
    label: 'YearPickerInput',
    description: 'Input and dropdown decade view for year selection.',
    valueType: 'BsDate | null',
    defaultValue: null,
    render: (
      value: BsDate | null,
      setValue: (v: BsDate | null) => void,
      numeralSystem: NepaliNumeralSystem,
      disabled: boolean,
      readOnly: boolean,
    ) => (
      <YearPickerInput
        numeralSystem={numeralSystem}
        disabled={disabled}
        readOnly={readOnly}
        label="Pick year"
        placeholderText="Pick year"
        value={value}
        onChange={(next) => setValue(toSingleDate(next))}
      />
    ),
    formatValue: (v: BsDate | null) => formatBsValue(v),
    code: `import { useState } from 'react';
import { YearPickerInput } from 'nepalidatepicker-react';
import type { BsDate } from 'nepalidatepicker';
import { CalendarDays, ChevronDown } from 'lucide-react';

function Demo() {
  const [value, setValue] = useState<BsDate | null>(null);

  return (
    <>
      <YearPickerInput
        label="Pick year"
        placeholderText="Pick year"
        numeralSystem="nepali"
        leftSection={<CalendarDays size={16} strokeWidth={1.8} />}
        rightSection={<ChevronDown size={16} strokeWidth={1.8} />}
        value={value}
        onChange={setValue}
      />
      <p>Selected year: {value ? value.year : 'null'}</p>
    </>
  );
}`,
  },
  {
    id: 'year-picker',
    label: 'YearPicker',
    description: 'Inline year picker with decade navigation.',
    valueType: 'BsDate | null',
    defaultValue: null,
    render: (
      value: BsDate | null,
      setValue: (v: BsDate | null) => void,
      numeralSystem: NepaliNumeralSystem,
      disabled: boolean,
      readOnly: boolean,
    ) => (
      <YearPicker
        numeralSystem={numeralSystem}
        disabled={disabled}
        readOnly={readOnly}
        value={value}
        onChange={(next) => setValue(toSingleDate(next))}
      />
    ),
    formatValue: (v: BsDate | null) => formatBsValue(v),
    code: `import { useState } from 'react';
import { YearPicker } from 'nepalidatepicker-react';
import type { BsDate } from 'nepalidatepicker';

function Demo() {
  const [value, setValue] = useState<BsDate | null>(null);

  return (
    <>
      <YearPicker numeralSystem="nepali" value={value} onChange={setValue} />
      <p>Selected year: {value ? value.year : 'null'}</p>
    </>
  );
}`,
  },
] as const as unknown as PlaygroundTab[];
