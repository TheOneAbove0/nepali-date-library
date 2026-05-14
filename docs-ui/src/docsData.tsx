import type { ReactNode } from 'react';
import {
  CalendarDemo,
  ConstraintsDemo,
  CustomHeaderDemo,
  CustomInputDemo,
  DateInputDemo,
  DatePickerDemo,
  DatePickerInputDemo,
  DateRangeDemo,
  DateTimePickerDemo,
  DayClassDemo,
  HolidayDemo,
  MonthPickerDemo,
  MonthPickerInputDemo,
  NepaliNumeralsDemo,
  TimeInputDemo,
  TimePickerDemo,
  TypeableDateInputDemo,
  StylingDemo,
  SizeDemo,
  WeekendHolidayDemo,
  YearPickerDemo,
  YearPickerInputDemo,
} from './docsDemos';

export interface DocSection {
  id: string;
  title: string;
  summary: string;
  Demo?: () => ReactNode;
  code?: string;
  content?: ReactNode;
}

export const sections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    summary: 'Simple date, month, and year pickers for Bikram Sambat interfaces.',
    content: (
      <>
        <div className="calloutGrid">
          <article>
            <h3>Install with Yarn</h3>
            <pre className="inlineCode">
              <code>yarn add nepali-date-library nepali-date-library-react</code>
            </pre>
          </article>
          <article>
            <h3>Install with npm</h3>
            <pre className="inlineCode">
              <code>npm install nepali-date-library nepali-date-library-react</code>
            </pre>
          </article>
        </div>
        <div className="calloutNote">
          Start with the shipped day, month, and year picker variants, then override visuals with
          `variables`, `styles`, `classNames`, `dayClassName`, and `holidays` when you need a
          branded surface.
        </div>
      </>
    ),
  },
  {
    id: 'date-picker-input',
    title: 'DatePickerInput',
    summary: 'Simple input with a dropdown day picker.',
    Demo: DatePickerInputDemo,
    code: `import { useState } from 'react';
import { DatePickerInput } from 'nepali-date-library-react';
import type { BsDate } from 'nepali-date-library';

function Demo() {
  const [value, setValue] = useState<BsDate | null>({ year: 2083, month: 1, day: 30 });

  return (
    <DatePickerInput
      label="Pick date"
      placeholderText="Pick date"
      showIcon
      monthNames={['Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra']}
      weekdayShortNames={['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']}
      value={value}
      onChange={setValue}
    />
  );
}`,
  },
  {
    id: 'date-input',
    title: 'DateInput',
    summary:
      'Input-first alias with the same dropdown calendar surface and clearable value support.',
    Demo: DateInputDemo,
    code: `import { DateInput } from 'nepali-date-library-react';

function Demo() {
  return (
    <DateInput
      clearable
      label="Pick date"
      placeholderText="Pick date"
      showIcon
    />
  );
}`,
  },
  {
    id: 'typeable-date-input',
    title: 'Typeable date input',
    summary: 'Enable typing in the popup date input with the `typeable` prop.',
    Demo: TypeableDateInputDemo,
    code: `import { useState } from 'react';
import { DatePickerInput } from 'nepali-date-library-react';
import type { BsDate } from 'nepali-date-library';

function Demo() {
  const [value, setValue] = useState<BsDate | null>({ year: 2083, month: 1, day: 30 });

  return (
    <DatePickerInput
      label="Typeable date input"
      placeholderText="YYYY-MM-DD"
      showIcon
      typeable
      value={value}
      onChange={setValue}
    />
  );
}`,
  },
  {
    id: 'date-picker',
    title: 'DatePicker',
    summary: 'Inline day picker for dashboards, forms, and embedded calendar panels.',
    Demo: DatePickerDemo,
    code: `import { DatePicker } from 'nepali-date-library-react';

function Demo() {
  return <DatePicker />;
}`,
  },
  {
    id: 'date-range',
    title: 'Dates range',
    summary:
      'Set \`type="range"\` to allow users to pick a start and end date from the same calendar.',
    Demo: DateRangeDemo,
    code: `import { useState } from 'react';
import { DatePicker } from 'nepali-date-library-react';
import type { BsDate } from 'nepali-date-library';

function Demo() {
  const [value, setValue] = useState<[BsDate | null, BsDate | null]>([
    { year: 2083, month: 1, day: 6 },
    { year: 2083, month: 1, day: 14 },
  ]);

  return (
    <DatePicker
      type="range"
      monthNames={['Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra']}
      weekdayShortNames={['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']}
      value={value}
      onChange={setValue}
    />
  );
}`,
  },
  {
    id: 'date-time-picker',
    title: 'DateTimePicker',
    summary:
      'Combined BS date + time picker with explicit 12h/24h format, first day of week control, and calendar spacing.',
    Demo: DateTimePickerDemo,
    code: `import { useState } from 'react';
import { DateTimePicker } from 'nepali-date-library-react';

function Demo() {
  const [value, setValue] = useState({
    date: { year: 2083, month: 1, day: 30 },
    time: '15:22',
  });

  return (
    <DateTimePicker
      label="Pick date and time"
      placeholderText="Pick date and time"
      firstDayOfWeek={0}
      withCellSpacing
      timePickerProps={{ format: '12h', withDropdown: true }}
      value={value}
      onChange={setValue}
    />
  );
}`,
  },
  {
    id: 'time-input',
    title: 'TimeInput',
    summary: 'Native browser time input with optional clock trigger button.',
    Demo: TimeInputDemo,
    code: `import { useRef } from 'react';
import { TimeInput } from 'nepali-date-library-react';

function Demo() {
  const ref = useRef<HTMLInputElement | null>(null);

  return (
    <TimeInput
      label="Click icon to show browser picker"
      ref={ref}
      showPickerButton
    />
  );
}`,
  },
  {
    id: 'time-picker',
    title: 'TimePicker',
    summary: 'Lightweight select-based time picker with 12h/24h format and optional seconds.',
    Demo: TimePickerDemo,
    code: `import { useState } from 'react';
import { TimePicker } from 'nepali-date-library-react';

function Demo() {
  const [value24, setValue24] = useState('');
  const [value12, setValue12] = useState('');

  return (
    <>
      <TimePicker label="Enter time (24h format)" withSeconds withDropdown value={value24} onChange={setValue24} />
      <TimePicker label="Enter time (12h format)" withSeconds withDropdown format="12h" mt="md" value={value12} onChange={setValue12} />
    </>
  );
}`,
  },
  {
    id: 'month-picker-input',
    title: 'MonthPickerInput',
    summary: 'Dropdown month selector with the same compact input shell.',
    Demo: MonthPickerInputDemo,
    code: `import { MonthPickerInput } from 'nepali-date-library-react';

function Demo() {
  return (
    <MonthPickerInput
      label="Pick month"
      placeholderText="Pick month"
    />
  );
}`,
  },
  {
    id: 'month-picker',
    title: 'MonthPicker',
    summary: 'Inline month grid with year navigation.',
    Demo: MonthPickerDemo,
    code: `import { MonthPicker } from 'nepali-date-library-react';

function Demo() {
  return <MonthPicker />;
}`,
  },
  {
    id: 'year-picker-input',
    title: 'YearPickerInput',
    summary: 'Input and dropdown decade view for year selection.',
    Demo: YearPickerInputDemo,
    code: `import { YearPickerInput } from 'nepali-date-library-react';

function Demo() {
  return (
    <YearPickerInput
      label="Pick year"
      placeholderText="Pick year"
    />
  );
}`,
  },
  {
    id: 'year-picker',
    title: 'YearPicker',
    summary: 'Inline year picker with decade navigation.',
    Demo: YearPickerDemo,
    code: `import { YearPicker } from 'nepali-date-library-react';

function Demo() {
  return <YearPicker />;
}`,
  },
  {
    id: 'calendar',
    title: 'Calendar',
    summary: 'Inline calendar alias for layouts that need an always-visible date surface.',
    Demo: CalendarDemo,
    code: `import { Calendar } from 'nepali-date-library-react';

function Demo() {
  return <Calendar />;
}`,
  },
  {
    id: 'holiday-dates',
    title: 'Holiday dates',
    summary: 'Festival dates can be highlighted or disabled with the \`holidays\` prop.',
    Demo: HolidayDemo,
    code: `import { DatePickerInput } from 'nepali-date-library-react';

function Demo() {
  return (
    <DatePickerInput
      label="Holiday dates"
      placeholderText="Pick festival date"
      showIcon
      holidays={[
        { date: { year: 2083, month: 1, day: 1 }, label: 'New year', className: 'holiday-accent' },
        { date: { year: 2083, month: 1, day: 15 }, label: 'Office closed', className: 'holiday-accent', disabled: true },
      ]}
    />
  );
}`,
  },
  {
    id: 'weekend-holidays',
    title: 'Weekend holidays',
    summary:
      'Style every Sunday or Saturday like a holiday by targeting the weekday column with a calendar class.',
    Demo: WeekendHolidayDemo,
    code: `import { DatePickerInput } from 'nepali-date-library-react';

function Demo() {
  return (
    <DatePickerInput
      label="Weekend holidays"
      placeholderText="Pick date"
      showIcon
      weekdayShortNames={['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']}
      classNames={{ calendar: 'weekend-holiday-calendar' }}
    />
  );
}

/* Sunday column */
.weekend-holiday-calendar th:nth-child(1),
.weekend-holiday-calendar td:nth-child(1) .nepali-date-picker__day {
  color: #d92d20;
}

/* Saturday column */
.weekend-holiday-calendar th:nth-child(7),
.weekend-holiday-calendar td:nth-child(7) .nepali-date-picker__day {
  color: #d92d20;
  background: #fff1f3;
  font-weight: 700;
}`,
  },
  {
    id: 'constraints',
    title: 'Constraints',
    summary:
      'Limit the selectable window with \`min\`, \`max\`, \`excludeDates\`, or a custom filter.',
    Demo: ConstraintsDemo,
    code: `import { DatePickerInput } from 'nepali-date-library-react';

function Demo() {
  return (
    <DatePickerInput
      label="Booking date"
      placeholderText="Pick available date"
      showIcon
      min="2083-01-05"
      max="2083-01-28"
      excludeDates={['2083-01-11', '2083-01-18']}
    />
  );
}`,
  },
  {
    id: 'nepali-numerals',
    title: 'Nepali numerals',
    summary:
      'Set \`numeralSystem="nepali"\` to render input values, headers, year lists, and day numbers with Nepali digits.',
    Demo: NepaliNumeralsDemo,
    code: `import { DatePickerInput } from 'nepali-date-library-react';

function Demo() {
  return (
    <DatePickerInput
      label="Nepali numerals"
      placeholderText="मिति छान्नुहोस्"
      numeralSystem="nepali"
    />
  );
}`,
  },
  {
    id: 'styling',
    title: 'Styling',
    summary:
      'Use CSS variables for color and radius, \`styles\` for slot spacing, and \`classNames\` for state-aware custom CSS.',
    Demo: StylingDemo,
    code: `import { DatePickerInput } from 'nepali-date-library-react';

const variables = {
  '--nepali-date-picker-accent': '#c97012',
  '--nepali-date-picker-accent-soft': '#fff0de',
  '--nepali-date-picker-input-radius': '18px',
  '--nepali-date-picker-calendar-radius': '22px',
  '--nepali-date-picker-input-bg': '#fffdf8',
  '--nepali-date-picker-calendar-bg': '#fffdf8',
};

const styles = {
  inputShell: { paddingInline: '4px' },
  day: { borderRadius: '14px' },
  tile: { borderRadius: '14px' },
};

function Demo() {
  return (
    <DatePickerInput
      label="Fully customizable surface"
      showIcon
      variables={variables}
      styles={styles}
      classNames={{
        calendar: 'brand-calendar',
        day: 'brand-day',
      }}
    />
  );
}`,
  },
  {
    id: 'size',
    title: 'Size',
    summary:
      'Control calendar scale directly from props with preset sizes or a numeric scale value.',
    Demo: SizeDemo,
    code: `import { DatePicker } from 'nepali-date-library-react';

function Demo() {
  return <DatePicker size="lg" />;
}

// Presets: "sm" | "md" | "lg" | "xl"
// Custom scale: size={1.3}`,
  },
  {
    id: 'custom-input',
    title: 'Custom input',
    summary: 'Replace the default input shell while keeping the same picker state and dropdown.',
    Demo: CustomInputDemo,
    code: `import { DatePickerInput } from 'nepali-date-library-react';
import { formatBsDateNepali } from 'nepali-date-library';

function Demo() {
  return (
    <DatePickerInput
      customInput={<button className="custom-input" type="button" />}
      dateFormat={formatBsDateNepali}
    />
  );
}`,
  },
  {
    id: 'custom-header',
    title: 'Custom header',
    summary: 'Override the navigation header when you need branded controls or a different layout.',
    Demo: CustomHeaderDemo,
    code: `import { DatePicker } from 'nepali-date-library-react';

function Demo() {
  return (
    <DatePicker
      renderCustomHeader={({ label, decrease, increase }) => (
        <div className="custom-header">
          <button onClick={decrease}>Prev</button>
          <strong>{label}</strong>
          <button onClick={increase}>Next</button>
        </div>
      )}
    />
  );
}`,
  },
  {
    id: 'day-class-name',
    title: 'Day class name',
    summary:
      'Style specific dates with \`dayClassName\` while keeping the base picker layout intact.',
    Demo: DayClassDemo,
    code: `import { DatePicker } from 'nepali-date-library-react';

function Demo() {
  return (
    <DatePicker
      dayClassName={(date) => {
        if (date.day === 1) return 'month-opening-day';
        if (date.day === 15) return 'mid-month-day';
        return '';
      }}
    />
  );
}`,
  },
];
