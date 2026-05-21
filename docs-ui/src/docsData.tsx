import type { ReactNode } from 'react';
import {
  ConstraintsDemo,
  CustomHeaderDemo,
  CustomInputDemo,
  CustomNamesDemo,
  DayClassDemo,
  HolidayDemo,
  NepaliNumeralsDemo,
  StylingDemo,
  SizeDemo,
  WeekendHolidayDemo,
} from './docsDemos';
import { PlaygroundDemo } from './PlaygroundDemo';
import { CopyButton } from './CopyButton';
import { CodePanel } from './CodePanel';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface DocSection {
  id: string;
  title: string;
  summary: string;
  Demo?: (props: { onCodeChange?: (code: string) => void }) => ReactNode;
  code?: string;
  content?: ReactNode;
  /** If true the section renders its Demo without a sectionCard wrapper. */
  bare?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Section list (10 sections, down from 20)                           */
/* ------------------------------------------------------------------ */

export const sections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    summary:
      'Install the React package — the core nepali-date-library is included as a dependency automatically.',
    content: (
      <>
        <div className="installBlock">
          <div className="installRow">
            <span className="installLabel">npm</span>
            <pre className="installCode">
              <code>npm install nepali-date-library-react</code>
            </pre>
            <CopyButton text="npm install nepali-date-library-react" />
          </div>
          <div className="installRow">
            <span className="installLabel">yarn</span>
            <pre className="installCode">
              <code>yarn add nepali-date-library-react</code>
            </pre>
            <CopyButton text="yarn add nepali-date-library-react" />
          </div>
          <div className="installRow">
            <span className="installLabel">pnpm</span>
            <pre className="installCode">
              <code>pnpm add nepali-date-library-react</code>
            </pre>
            <CopyButton text="pnpm add nepali-date-library-react" />
          </div>
          <div className="installRow">
            <span className="installLabel">bun</span>
            <pre className="installCode">
              <code>bun add nepali-date-library-react</code>
            </pre>
            <CopyButton text="bun add nepali-date-library-react" />
          </div>
        </div>
        <p className="sectionNote">
          Start with the shipped day, month, and year picker variants, then override visuals with{' '}
          <code>variables</code>, <code>styles</code>, <code>classNames</code>,{' '}
          <code>dayClassName</code>, and <code>holidays</code> when you need a branded surface.
        </p>
      </>
    ),
  },
  {
    id: 'playground',
    title: 'Playground',
    summary:
      'Try every picker and input variant in one place. All demos use `numeralSystem="nepali"` — switch to `"latin"` for English digits. Each tab shows the live component, its value type, and a copy-paste code example.',
    Demo: PlaygroundDemo,
    bare: true,
  },
  {
    id: 'styling',
    title: 'Styling',
    summary:
      'Use CSS variables for color and radius, `styles` for slot spacing, and `classNames` for state-aware custom CSS.',
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
      leftSection={<CalendarDays size={16} />}
      rightSection={<ChevronDown size={16} />}
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
      customInput={<button className="custom-trigger" type="button" />}
      dateFormat={formatBsDateNepali}
    />
  );
}

/* Strip the default input shell so only your button is visible */
/* .nepali-date-picker__input-shell:has(.custom-trigger) {
  border: 0;
  background: transparent;
  padding: 0;
} */`,
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
          <button className="custom-header__nav" onClick={decrease}>
            <ChevronLeft size={15} />
            <span>Prev</span>
          </button>
          <strong>
            <span className="custom-header__chip">BS</span>
            <span>{label}</span>
          </strong>
          <button className="custom-header__nav" onClick={increase}>
            <span>Next</span>
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    />
  );
}`,
  },
  {
    id: 'custom-names',
    title: 'Custom names',
    summary:
      'Override month and weekday labels with `monthNames`, `weekdayShortNames`, and `weekdayNames`. Useful for English transliterations or any locale.',
    Demo: CustomNamesDemo,
    code: `import { DatePicker } from 'nepali-date-library-react';

const monthNames = [
  'Baisakh', 'Jestha', 'Asar', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra',
];

const weekdayShortNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function Demo() {
  return (
    <DatePicker
      monthNames={monthNames}
      weekdayShortNames={weekdayShortNames}
      numeralSystem="latin"
    />
  );
}`,
  },
  {
    id: 'day-class-name',
    title: 'Day class name',
    summary:
      'Style specific dates with `dayClassName` while keeping the base picker layout intact.',
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
  {
    id: 'constraints',
    title: 'Constraints',
    summary: 'Limit the selectable window with `min`, `max`, `excludeDates`, or a custom filter.',
    Demo: ConstraintsDemo,
    code: `import { CalendarDays, ChevronDown } from 'lucide-react';
import { DatePickerInput } from 'nepali-date-library-react';

function Demo() {
  return (
    <DatePickerInput
      label="Booking date"
      placeholderText="Pick available date"
      leftSection={<CalendarDays size={16} />}
      rightSection={<ChevronDown size={16} />}
      min="2083-01-05"
      max="2083-01-28"
      excludeDates={['2083-01-11', '2083-01-18']}
    />
  );
}`,
  },
  {
    id: 'holidays',
    title: 'Holidays & weekends',
    summary:
      'Festival dates can be highlighted or disabled with the `holidays` prop. Use column-based CSS to style weekends.',
    Demo: HolidayDemo,
    code: `import { CalendarDays, ChevronDown } from 'lucide-react';
import { DatePickerInput } from 'nepali-date-library-react';

function Demo() {
  return (
    <DatePickerInput
      label="Holiday dates"
      placeholderText="Pick festival date"
      leftSection={<CalendarDays size={16} />}
      rightSection={<ChevronDown size={16} />}
      holidays={[
        { date: { year: 2083, month: 1, day: 1 }, label: 'New year', className: 'holiday-accent' },
        { date: { year: 2083, month: 1, day: 15 }, label: 'Office closed', className: 'holiday-accent', disabled: true },
      ]}
    />
  );
}`,
    content: (
      <div className="sectionCard" style={{ marginTop: 16 }}>
        <div className="demoStage">
          <WeekendHolidayDemo />
        </div>
        <CodePanel
          code={`import { DatePickerInput } from 'nepali-date-library-react';

function Demo() {
  return (
    <DatePickerInput
      label="Weekend holidays"
      classNames={{ calendar: 'weekend-calendar' }}
    />
  );
}

/* Column-based CSS — targets every Sunday (1st) and Saturday (7th) */
/* .weekend-calendar th:nth-child(7),
.weekend-calendar td:nth-child(7) .nepali-date-picker__day {
  color: #cf3f34;
  font-weight: 700;
  background: #fff3ef;
} */`}
        />
      </div>
    ),
  },
  {
    id: 'nepali-numerals',
    title: 'Nepali numerals',
    summary:
      'Set `numeralSystem="nepali"` to render input values, headers, year lists, and day numbers with Nepali digits.',
    Demo: NepaliNumeralsDemo,
    code: `import { CalendarDays, ChevronDown } from 'lucide-react';
import { DatePickerInput } from 'nepali-date-library-react';

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
];
