import {
  CalendarDays,
  Check,
  Clipboard,
  Code2,
  ExternalLink,
  Github,
  PackageCheck,
  Settings2,
} from 'lucide-react';
import { StrictMode, useState, useEffect, useRef, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  formatBsDate,
  formatBsDateNepali,
  toBik,
  type BsDate,
} from 'nepali-date-library';
import { NepaliDatePicker, type NepaliDatePickerHeaderProps } from 'nepali-date-library-react';
import './styles.css';

const sampleAd = '2026-05-13';
const sampleBs = toBik(sampleAd);
const romanMonthNames = [
  'Baisakh',
  'Jestha',
  'Ashadh',
  'Shrawan',
  'Bhadra',
  'Ashwin',
  'Kartik',
  'Mangsir',
  'Poush',
  'Magh',
  'Falgun',
  'Chaitra',
];

interface Example {
  id: string;
  title: string;
  summary: string;
  code: string;
  Demo: () => ReactNode;
}

function DefaultExample() {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(sampleBs);

  return <NepaliDatePicker value={selectedDate} onChange={setSelectedDate} />;
}

function CalendarIconExample() {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(sampleBs);

  return (
    <NepaliDatePicker
      showIcon
      icon={<CalendarDays size={18} />}
      value={selectedDate}
      onChange={setSelectedDate}
    />
  );
}

function ToggleIconExample() {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(sampleBs);

  return (
    <NepaliDatePicker
      showIcon
      toggleCalendarOnIconClick
      icon={<CalendarDays size={18} />}
      value={selectedDate}
      onChange={setSelectedDate}
    />
  );
}

function ClearableInputExample() {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(sampleBs);

  return (
    <NepaliDatePicker
      isClearable
      placeholderText="Choose a BS date"
      value={selectedDate}
      onChange={setSelectedDate}
    />
  );
}

function CustomInputExample() {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(sampleBs);

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      customInput={<button className="exampleCustomInput" type="button" />}
      dateFormat={formatBsDateNepali}
    />
  );
}

function CustomHeaderExample() {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(sampleBs);
  const years = Array.from({ length: 9 }, (_, index) => 2079 + index);

  const renderHeader = ({
    viewYear,
    viewMonth,
    decreaseMonth,
    increaseMonth,
    changeYear,
    changeMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: NepaliDatePickerHeaderProps) => (
    <div className="customHeader">
      <button disabled={prevMonthButtonDisabled} onClick={decreaseMonth} type="button">
        Prev
      </button>
      <select value={viewMonth} onChange={(event) => changeMonth(Number(event.target.value))}>
        {romanMonthNames.map((month, index) => (
          <option key={month} value={index + 1}>
            {month}
          </option>
        ))}
      </select>
      <select value={viewYear} onChange={(event) => changeYear(Number(event.target.value))}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <button disabled={nextMonthButtonDisabled} onClick={increaseMonth} type="button">
        Next
      </button>
    </div>
  );

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      renderCustomHeader={renderHeader}
      monthNames={romanMonthNames}
    />
  );
}

function CustomDayNamesExample() {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(sampleBs);

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      renderCustomDayName={({ shortName, fullName }) => (
        <span title={fullName}>{shortName.toUpperCase()}</span>
      )}
      weekdayShortNames={['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']}
    />
  );
}

function CustomDayExample() {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(sampleBs);

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      renderDayContents={(day, date) => (
        <span title={formatBsDate(date, 'D MMMM YYYY')}>{day}</span>
      )}
    />
  );
}

function CustomClassExample() {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(sampleBs);

  return (
    <NepaliDatePicker
      className="festivalPicker"
      calendarClassName="festivalCalendar"
      value={selectedDate}
      onChange={setSelectedDate}
    />
  );
}

function CustomDayClassExample() {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(sampleBs);

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      dayClassName={(date) => (date.day === 1 ? 'monthOpeningDay' : '')}
    />
  );
}

function CustomDateFormatExample() {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(sampleBs);

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      dateFormat={(date) => formatBsDate(date, 'D MMMM YYYY')}
    />
  );
}

function DateRangeExample() {
  const [startDate, setStartDate] = useState<BsDate | null>({ year: 2083, month: 1, day: 12 });
  const [endDate, setEndDate] = useState<BsDate | null>({ year: 2083, month: 1, day: 30 });

  return (
    <div className="rangeDemo">
      <NepaliDatePicker value={startDate} onChange={setStartDate} />
      <NepaliDatePicker value={endDate} min={startDate ?? undefined} onChange={setEndDate} />
    </div>
  );
}

function ExcludeDatesExample() {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(sampleBs);

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      excludeDates={[
        { year: 2083, month: 1, day: 15 },
        { year: 2083, month: 1, day: 30 },
      ]}
    />
  );
}

function IncludeDatesExample() {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(null);

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      placeholderText="Only 3 available days"
      includeDates={[
        { year: 2083, month: 1, day: 10 },
        { year: 2083, month: 1, day: 20 },
        { year: 2083, month: 1, day: 30 },
      ]}
    />
  );
}

function FilterDatesExample() {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(null);

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      placeholderText="Days after 20 only"
      filterDate={(date) => date.day > 20}
    />
  );
}

function MinMaxExample() {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(null);

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      min="2083-01-10"
      max="2083-02-15"
      placeholderText="2083-01-10 to 2083-02-15"
    />
  );
}

function InlineExample() {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(sampleBs);

  return <NepaliDatePicker inline value={selectedDate} onChange={setSelectedDate} />;
}

function DisabledInlineExample() {
  return <NepaliDatePicker disabled inline defaultValue={sampleBs} />;
}

function InlineToggleExample() {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(sampleBs);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="toggleInlineDemo">
      <button className="exampleCustomInput" type="button" onClick={() => setIsOpen((open) => !open)}>
        {selectedDate ? formatBsDate(selectedDate) : 'Select date'}
      </button>
      {isOpen && <NepaliDatePicker inline value={selectedDate} onChange={setSelectedDate} />}
    </div>
  );
}

function PlaceholderExample() {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(null);

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      placeholderText="Click to select a BS date"
    />
  );
}

function CalendarStartDayExample() {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(sampleBs);

  return <NepaliDatePicker calendarStartDay={1} value={selectedDate} onChange={setSelectedDate} />;
}

function ChildrenExample() {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(sampleBs);

  return (
    <NepaliDatePicker inline value={selectedDate} onChange={setSelectedDate}>
      <div className="calendarNote">Selected: {selectedDate ? formatBsDateNepali(selectedDate) : 'None'}</div>
    </NepaliDatePicker>
  );
}

const examples: Example[] = [
  {
    id: 'default',
    title: 'Default',
    summary: 'Controlled BS date value with the built-in input and popup calendar.',
    Demo: DefaultExample,
    code: `import { useState } from 'react';
import { NepaliDatePicker } from 'nepali-date-library-react';
import type { BsDateInput } from 'nepali-date-library';

const Default = () => {
  const [selectedDate, setSelectedDate] = useState<BsDateInput | null>('2083-01-30');

  return <NepaliDatePicker value={selectedDate} onChange={setSelectedDate} />;
};`,
  },
  {
    id: 'calendar-icon',
    title: 'Calendar Icon',
    summary: 'Add an icon button next to the input while keeping the same selected value API.',
    Demo: CalendarIconExample,
    code: `const CalendarIcon = () => {
  const [selectedDate, setSelectedDate] = useState<BsDateInput | null>('2083-01-30');

  return (
    <NepaliDatePicker
      showIcon
      icon={<CalendarDays size={18} />}
      value={selectedDate}
      onChange={setSelectedDate}
    />
  );
};`,
  },
  {
    id: 'toggle-calendar-on-icon-click',
    title: 'Toggle Calendar on Icon Click',
    summary: 'Use the icon as a compact disclosure control for opening and closing the calendar.',
    Demo: ToggleIconExample,
    code: `const ToggleCalendarOnIconClick = () => {
  const [selectedDate, setSelectedDate] = useState<BsDateInput | null>('2083-01-30');

  return (
    <NepaliDatePicker
      showIcon
      toggleCalendarOnIconClick
      icon={<CalendarDays size={18} />}
      value={selectedDate}
      onChange={setSelectedDate}
    />
  );
};`,
  },
  {
    id: 'clearable-input',
    title: 'Clearable Datepicker Input',
    summary: 'Expose a clear button that resets the selected date to null.',
    Demo: ClearableInputExample,
    code: `const ClearableInput = () => {
  const [selectedDate, setSelectedDate] = useState<BsDateInput | null>('2083-01-30');

  return (
    <NepaliDatePicker
      isClearable
      placeholderText="Choose a BS date"
      value={selectedDate}
      onChange={setSelectedDate}
    />
  );
};`,
  },
  {
    id: 'custom-input',
    title: 'Custom Input',
    summary: 'Replace the input element with your own React element.',
    Demo: CustomInputExample,
    code: `const CustomInput = () => {
  const [selectedDate, setSelectedDate] = useState<BsDateInput | null>('2083-01-30');

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      customInput={<button className="example-custom-input" type="button" />}
      dateFormat={formatBsDateNepali}
    />
  );
};`,
  },
  {
    id: 'custom-header',
    title: 'Custom Header',
    summary: 'Render your own month and year controls with the header render prop.',
    Demo: CustomHeaderExample,
    code: `const CustomHeader = () => {
  const [selectedDate, setSelectedDate] = useState<BsDateInput | null>('2083-01-30');

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      monthNames={romanMonthNames}
      renderCustomHeader={({ viewYear, viewMonth, changeYear, changeMonth, decreaseMonth, increaseMonth }) => (
        <div className="custom-header">
          <button onClick={decreaseMonth}>Prev</button>
          <select value={viewMonth} onChange={(event) => changeMonth(Number(event.target.value))}>
            {romanMonthNames.map((month, index) => (
              <option key={month} value={index + 1}>{month}</option>
            ))}
          </select>
          <select value={viewYear} onChange={(event) => changeYear(Number(event.target.value))}>
            {[2079, 2080, 2081, 2082, 2083, 2084, 2085].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button onClick={increaseMonth}>Next</button>
        </div>
      )}
    />
  );
};`,
  },
  {
    id: 'custom-day-names',
    title: 'Custom Day Names',
    summary: 'Control weekday labels and the displayed weekday order.',
    Demo: CustomDayNamesExample,
    code: `const CustomDayNames = () => {
  const [selectedDate, setSelectedDate] = useState<BsDateInput | null>('2083-01-30');

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      weekdayShortNames={['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']}
      renderCustomDayName={({ shortName, fullName }) => (
        <span title={fullName}>{shortName.toUpperCase()}</span>
      )}
    />
  );
};`,
  },
  {
    id: 'custom-day',
    title: 'Custom Day',
    summary: 'Customize the contents of each day cell while the grid engine keeps selection state.',
    Demo: CustomDayExample,
    code: `const CustomDay = () => {
  const [selectedDate, setSelectedDate] = useState<BsDateInput | null>('2083-01-30');

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      renderDayContents={(day, date) => (
        <span title={formatBsDate(date, 'D MMMM YYYY')}>{day}</span>
      )}
    />
  );
};`,
  },
  {
    id: 'custom-calendar-class-name',
    title: 'Custom Calendar Class Name',
    summary: 'Attach your own classes to the root and calendar panels for design-system styling.',
    Demo: CustomClassExample,
    code: `const CustomCalendarClassName = () => {
  const [selectedDate, setSelectedDate] = useState<BsDateInput | null>('2083-01-30');

  return (
    <NepaliDatePicker
      className="festival-picker"
      calendarClassName="festival-calendar"
      value={selectedDate}
      onChange={setSelectedDate}
    />
  );
};`,
  },
  {
    id: 'custom-day-class-name',
    title: 'Custom Day Class Name',
    summary: 'Return a class per date for holidays, fiscal markers, or status-driven styling.',
    Demo: CustomDayClassExample,
    code: `const CustomDayClassName = () => {
  const [selectedDate, setSelectedDate] = useState<BsDateInput | null>('2083-01-30');

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      dayClassName={(date) => (date.day === 1 ? 'month-opening-day' : '')}
    />
  );
};`,
  },
  {
    id: 'custom-date-format',
    title: 'Custom Date Format',
    summary: 'Format the input value with a built-in BS pattern or a custom formatter function.',
    Demo: CustomDateFormatExample,
    code: `const CustomDateFormat = () => {
  const [selectedDate, setSelectedDate] = useState<BsDateInput | null>('2083-01-30');

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      dateFormat={(date) => formatBsDate(date, 'D MMMM YYYY')}
    />
  );
};`,
  },
  {
    id: 'date-range',
    title: 'Date Range',
    summary: 'Compose two datepickers and pass the start date as the second picker minimum.',
    Demo: DateRangeExample,
    code: `const DateRange = () => {
  const [startDate, setStartDate] = useState<BsDate | null>({ year: 2083, month: 1, day: 12 });
  const [endDate, setEndDate] = useState<BsDate | null>({ year: 2083, month: 1, day: 30 });

  return (
    <>
      <NepaliDatePicker value={startDate} onChange={setStartDate} />
      <NepaliDatePicker value={endDate} min={startDate ?? undefined} onChange={setEndDate} />
    </>
  );
};`,
  },
  {
    id: 'exclude-dates',
    title: 'Exclude Dates',
    summary: 'Disable specific BS dates while keeping the rest of the month selectable.',
    Demo: ExcludeDatesExample,
    code: `const ExcludeDates = () => {
  const [selectedDate, setSelectedDate] = useState<BsDateInput | null>('2083-01-30');

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      excludeDates={['2083-01-15', '2083-01-30']}
    />
  );
};`,
  },
  {
    id: 'include-dates',
    title: 'Include Dates',
    summary: 'Limit the picker to an allow-list of known valid dates.',
    Demo: IncludeDatesExample,
    code: `const IncludeDates = () => {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(null);

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      placeholderText="Only 3 available days"
      includeDates={['2083-01-10', '2083-01-20', '2083-01-30']}
    />
  );
};`,
  },
  {
    id: 'filter-dates',
    title: 'Filter Dates',
    summary: 'Use a predicate when availability comes from business rules.',
    Demo: FilterDatesExample,
    code: `const FilterDates = () => {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(null);

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      placeholderText="Days after 20 only"
      filterDate={(date) => date.day > 20}
    />
  );
};`,
  },
  {
    id: 'min-max',
    title: 'Min Date and Max Date',
    summary: 'Constrain navigation and selection to a specific BS date window.',
    Demo: MinMaxExample,
    code: `const MinMaxDate = () => {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(null);

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      min="2083-01-10"
      max="2083-02-15"
      placeholderText="2083-01-10 to 2083-02-15"
    />
  );
};`,
  },
  {
    id: 'inline',
    title: 'Inline Version',
    summary: 'Render the calendar directly in the layout instead of using an input popup.',
    Demo: InlineExample,
    code: `const Inline = () => {
  const [selectedDate, setSelectedDate] = useState<BsDateInput | null>('2083-01-30');

  return <NepaliDatePicker inline value={selectedDate} onChange={setSelectedDate} />;
};`,
  },
  {
    id: 'inline-disabled',
    title: 'Inline Version Disabled',
    summary: 'Disable selection while preserving the visible month grid.',
    Demo: DisabledInlineExample,
    code: `const DisabledInline = () => {
  return <NepaliDatePicker disabled inline defaultValue="2083-01-30" />;
};`,
  },
  {
    id: 'inline-toggle',
    title: 'Button to Toggle Inline Datepicker Visibility',
    summary: 'Use your own trigger and conditionally render the inline calendar.',
    Demo: InlineToggleExample,
    code: `const InlineVisible = () => {
  const [selectedDate, setSelectedDate] = useState<BsDateInput | null>('2083-01-30');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen((open) => !open)}>
        {selectedDate ? formatBsDate(selectedDate) : 'Select date'}
      </button>
      {isOpen && <NepaliDatePicker inline value={selectedDate} onChange={setSelectedDate} />}
    </>
  );
};`,
  },
  {
    id: 'placeholder-text',
    title: 'Placeholder Text',
    summary: 'Show empty-state copy before a user selects a date.',
    Demo: PlaceholderExample,
    code: `const PlaceholderText = () => {
  const [selectedDate, setSelectedDate] = useState<BsDate | null>(null);

  return (
    <NepaliDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      placeholderText="Click to select a BS date"
    />
  );
};`,
  },
  {
    id: 'calendar-start-day',
    title: 'Calendar Start Day',
    summary: 'Shift the week grid to start on Monday, Saturday, or any supported weekday index.',
    Demo: CalendarStartDayExample,
    code: `const CalendarStartDay = () => {
  const [selectedDate, setSelectedDate] = useState<BsDateInput | null>('2083-01-30');

  return <NepaliDatePicker calendarStartDay={1} value={selectedDate} onChange={setSelectedDate} />;
};`,
  },
  {
    id: 'children',
    title: 'Render Children in Datepicker',
    summary: 'Add extra footer content inside the calendar surface.',
    Demo: ChildrenExample,
    code: `const Children = () => {
  const [selectedDate, setSelectedDate] = useState<BsDateInput | null>('2083-01-30');

  return (
    <NepaliDatePicker inline value={selectedDate} onChange={setSelectedDate}>
      <div>Selected: {selectedDate ? formatBsDateNepali(selectedDate) : 'None'}</div>
    </NepaliDatePicker>
  );
};`,
  },
];

function App() {
  const [activeNav, setActiveNav] = useState(examples[0].id);
  const selectedForSummary = examples.find((example) => example.id === activeNav) ?? examples[0];
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Create intersection observer to track which section is in view
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the section that is most in view
        let mostVisibleEntry: IntersectionObserverEntry | null = null;
        let maxIntersection = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Calculate how much of the element is visible
            const rect = entry.boundingClientRect;
            const visibleHeight = Math.min(rect.height, window.innerHeight - Math.max(0, rect.top));
            const intersectionRatio = visibleHeight / rect.height;

            if (intersectionRatio > maxIntersection) {
              maxIntersection = intersectionRatio;
              mostVisibleEntry = entry;
            }
          }
        });

        if (mostVisibleEntry && maxIntersection > 0.1) {
          const entry = mostVisibleEntry as IntersectionObserverEntry;
          const sectionId = (entry.target as HTMLElement).id;
          setActiveNav(sectionId);
        }
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: '-80px 0px -80px 0px', // Trigger near the top of viewport
      }
    );

    // Observe all sections
    const installationSection = document.getElementById('installation');
    const examplesSection = document.getElementById('examples');
    
    if (installationSection) observerRef.current.observe(installationSection);
    if (examplesSection) observerRef.current.observe(examplesSection);

    const exampleBlocks = document.querySelectorAll('.exampleBlock');
    exampleBlocks.forEach((block) => {
      observerRef.current?.observe(block);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <main className="docsShell">
      <aside className="sidebar" aria-label="Examples navigation">
        <a className="brand" href="#top" onClick={() => setActiveNav(examples[0].id)}>
          <CalendarDays size={24} />
          <span>Nepali React Datepicker</span>
        </a>
        <nav>
          <a
            className={activeNav === 'installation' ? 'active' : undefined}
            href="#installation"
            onClick={() => setActiveNav('installation')}
          >
            Installation
          </a>
          <a
            className={activeNav === 'examples' ? 'active' : undefined}
            href="#examples"
            onClick={() => setActiveNav('examples')}
          >
            Examples
          </a>
          {examples.map((example) => (
            <a
              className={example.id === activeNav ? 'active' : undefined}
              href={`#${example.id}`}
              key={example.id}
              onClick={() => setActiveNav(example.id)}
            >
              {example.title}
            </a>
          ))}
        </nav>
      </aside>

      <section className="content" id="top">
        <header className="topbar">
          <div>
            <p className="kicker">Crafted for Bikram Sambat interfaces</p>
            <h1>React Nepali Datepicker</h1>
            <p className="lede">
              A customizable React datepicker for BS dates, backed by the shared Nepali Date Library conversion and
              calendar engine.
            </p>
          </div>
          <div className="quickPreview">
            <span>Gregorian sample</span>
            <strong>{sampleAd}</strong>
            <span>BS value</span>
            <strong>{formatBsDateNepali(sampleBs)}</strong>
          </div>
        </header>

        <div className="badges" aria-label="Package status">
          <span><PackageCheck size={14} /> npm v0.1.0</span>
          <span><Check size={14} /> TypeScript</span>
          <span><Check size={14} /> Shared core</span>
        </div>

        <section className="installBand" id="installation">
          <div>
            <h2>Installation</h2>
            <p>The React wrapper uses the same BS parser, formatter, and month grid logic as the core package.</p>
          </div>
          <div className="installGrid">
            <CodePanel code="npm install nepali-date-library nepali-date-library-react" compact />
            <CodePanel code="yarn add nepali-date-library nepali-date-library-react" compact />
          </div>
        </section>

        <section className="introGrid">
          <article>
            <Settings2 size={20} />
            <h2>Customization Surface</h2>
            <p>
              Replace the input, calendar header, weekday labels, day contents, and per-day classes without replacing the
              conversion or navigation logic.
            </p>
          </article>
          <article>
            <Code2 size={20} />
            <h2>Current Example</h2>
            <p>{selectedForSummary.title}: {selectedForSummary.summary}</p>
          </article>
        </section>

        <section className="examplesHeader" id="examples">
          <h2>Examples</h2>
          <p>Each example renders live on the right and shows the TypeScript usage on the left.</p>
        </section>

        <div className="examples">
          {examples.map((example) => (
            <ExampleBlock example={example} key={example.id} />
          ))}
        </div>

        <footer>
          <Github size={18} />
          <span>Docs are local to this repo and use the published package API shape.</span>
        </footer>
      </section>
    </main>
  );
}

function ExampleBlock({ example }: { example: Example }) {
  const Demo = example.Demo;

  return (
    <section className="exampleBlock" id={example.id}>
      <div className="exampleMeta">
        <h3>{example.title}</h3>
        <p>{example.summary}</p>
      </div>
      <CodePanel code={example.code} />
      <div className="examplePreview">
        <Demo />
      </div>
    </section>
  );
}

function CodePanel({ code, compact = false }: { code: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard?.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className={compact ? 'codePanel codePanelCompact' : 'codePanel'}>
      <div className="codeTabs">
        <span>TypeScript</span>
        <button aria-label="Copy code" onClick={copy} type="button">
          {copied ? <Check size={15} /> : <Clipboard size={15} />}
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
