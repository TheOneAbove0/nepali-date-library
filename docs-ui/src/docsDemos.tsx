import {
  DatePicker,
  DatePickerInput,
  type NepaliDatePickerSize,
  type NepaliDatePickerValue,
} from 'nepali-date-library-react';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatBsDateNepali, type BsDate } from 'nepali-date-library';
import { brandedStyles, brandedVariables, sampleBs, toSingleDate } from './docsShared';
import { useNumeralSystem } from './NumeralSystemContext';

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

type DemoProps = { onCodeChange?: (code: string) => void };

/** Reduces boilerplate: every feature demo needs BS date state + onChange. */
function useBsDateState(initial: BsDate | null = sampleBs) {
  const [value, setValue] = useState<BsDate | null>(initial);
  const handleChange = (next: NepaliDatePickerValue) => setValue(toSingleDate(next));
  return [value, handleChange] as const;
}

/** Shared input section icons — avoids repeating JSX in every demo. */
const icons = {
  left: <CalendarDays size={16} strokeWidth={1.8} />,
  right: <ChevronDown size={16} strokeWidth={1.8} />,
};

/* ------------------------------------------------------------------ */
/*  Feature demos                                                      */
/* ------------------------------------------------------------------ */

export function HolidayDemo() {
  const [value, handleChange] = useBsDateState();
  const { numeralSystem } = useNumeralSystem();

  return (
    <DatePickerInput
      numeralSystem={numeralSystem}
      holidays={[
        {
          date: { year: 2083, month: 1, day: 1 },
          label: 'New year',
          className: 'docsHolidayAccent',
        },
        {
          date: { year: 2083, month: 1, day: 15 },
          label: 'Office closed',
          className: 'docsHolidayAccent',
          disabled: true,
        },
        {
          date: { year: 2083, month: 1, day: 23 },
          label: 'Festival release',
          className: 'docsHolidayMuted',
        },
      ]}
      leftSection={icons.left}
      label="Holiday dates"
      placeholderText="Pick festival date"
      rightSection={icons.right}
      value={value}
      onChange={handleChange}
    />
  );
}

export function WeekendHolidayDemo() {
  const [value, handleChange] = useBsDateState();
  const { numeralSystem } = useNumeralSystem();

  return (
    <DatePickerInput
      numeralSystem={numeralSystem}
      classNames={{ calendar: 'docsWeekendHolidayCalendar' }}
      description="Use column-based CSS when the same weekday should always look like a holiday."
      leftSection={icons.left}
      label="Weekend holidays"
      placeholderText="Pick date"
      rightSection={icons.right}
      value={value}
      onChange={handleChange}
    />
  );
}

export function ConstraintsDemo() {
  const [value, handleChange] = useBsDateState();
  const { numeralSystem } = useNumeralSystem();

  return (
    <DatePickerInput
      numeralSystem={numeralSystem}
      excludeDates={['2083-01-11', '2083-01-18']}
      leftSection={icons.left}
      label="Booking date"
      max="2083-01-28"
      min="2083-01-05"
      placeholderText="Pick available date"
      rightSection={icons.right}
      value={value}
      onChange={handleChange}
    />
  );
}

export function CustomInputDemo() {
  const [value, handleChange] = useBsDateState();
  const { numeralSystem } = useNumeralSystem();

  return (
    <DatePickerInput
      numeralSystem={numeralSystem}
      customInput={<button className="docsCustomInput" type="button" />}
      dateFormat={formatBsDateNepali}
      value={value}
      onChange={handleChange}
    />
  );
}

export function CustomHeaderDemo() {
  const [value, handleChange] = useBsDateState();
  const { numeralSystem } = useNumeralSystem();

  return (
    <DatePicker
      numeralSystem={numeralSystem}
      renderCustomHeader={({ label, decrease, increase }) => (
        <div className="docsCustomHeader">
          <button onClick={decrease} type="button">
            <ChevronLeft size={14} />
          </button>
          <span className="docsCustomHeader__label">
            <span className="docsCustomHeader__chip">BS</span>
            {label}
          </span>
          <button onClick={increase} type="button">
            <ChevronRight size={14} />
          </button>
        </div>
      )}
      value={value}
      onChange={handleChange}
    />
  );
}

const englishMonthNames = [
  'Baisakh',
  'Jestha',
  'Asar',
  'Shrawan',
  'Bhadra',
  'Ashwin',
  'Kartik',
  'Mangsir',
  'Poush',
  'Magh',
  'Falgun',
  'Chaitra',
] as const;

const englishWeekdayShort = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

export function CustomNamesDemo() {
  const [value, handleChange] = useBsDateState();

  return (
    <DatePicker
      monthNames={englishMonthNames}
      weekdayShortNames={englishWeekdayShort}
      numeralSystem="latin"
      value={value}
      onChange={handleChange}
    />
  );
}

export function DayClassDemo() {
  const [value, handleChange] = useBsDateState();
  const { numeralSystem } = useNumeralSystem();

  return (
    <DatePicker
      numeralSystem={numeralSystem}
      dayClassName={(date) => {
        if (date.day === 1) return 'docsMonthOpeningDay';
        if (date.day === 15) return 'docsMidMonthDay';
        return '';
      }}
      value={value}
      onChange={handleChange}
    />
  );
}

export function NepaliNumeralsDemo() {
  const [value, handleChange] = useBsDateState();

  return (
    <DatePickerInput
      label="Nepali numerals"
      numeralSystem="nepali"
      placeholderText="मिति छान्नुहोस्"
      value={value}
      onChange={handleChange}
    />
  );
}

export function StylingDemo() {
  const [value, handleChange] = useBsDateState();
  const { numeralSystem } = useNumeralSystem();

  return (
    <DatePickerInput
      numeralSystem={numeralSystem}
      classNames={{
        calendar: 'docsStyledCalendar',
        day: 'docsStyledDay',
        headerLabel: 'docsStyledHeaderLabel',
      }}
      description="Colors, radius, background, and state styling can all be overridden."
      label="Fully customizable surface"
      leftSection={icons.left}
      placeholderText="Pick date"
      rightSection={icons.right}
      styles={brandedStyles}
      value={value}
      variables={brandedVariables}
      onChange={handleChange}
    />
  );
}

export function SizeDemo({ onCodeChange }: DemoProps) {
  const [value, handleChange] = useBsDateState();
  const { numeralSystem } = useNumeralSystem();
  const [size, setSize] = useState<NepaliDatePickerSize>('md');
  const [customValue, setCustomValue] = useState('1.3');
  const isCustom = typeof size === 'number';

  useEffect(() => {
    const sizeStr = typeof size === 'number' ? `size={${size}}` : `size="${size}"`;
    onCodeChange?.(`import { DatePicker } from 'nepali-date-library-react';

function Demo() {
  return <DatePicker ${sizeStr} />;
}

// Presets: "sm" | "md" | "lg" | "xl"
// Custom scale: size={1.3}  (any number)`);
  }, [onCodeChange, size]);

  return (
    <div style={{ display: 'grid', gap: '14px' }}>
      <div className="sizePills">
        {(['sm', 'md', 'lg', 'xl'] as const).map((opt) => (
          <button
            key={opt}
            className={`sizePill${size === opt ? ' is-active' : ''}`}
            onClick={() => setSize(opt)}
            type="button"
          >
            {opt.toUpperCase()}
          </button>
        ))}
        <span className="sizeDivider" />
        <button
          className={`sizePill${isCustom ? ' is-active' : ''}`}
          onClick={() => setSize(parseFloat(customValue) || 1)}
          type="button"
        >
          Custom
        </button>
        {isCustom && (
          <input
            aria-label="Custom scale value"
            className="sizeInput"
            max="3"
            min="0.5"
            step="0.1"
            type="number"
            value={customValue}
            onChange={(e) => {
              setCustomValue(e.target.value);
              const n = parseFloat(e.target.value);
              if (n > 0 && n <= 3) setSize(n);
            }}
          />
        )}
      </div>

      <DatePicker numeralSystem={numeralSystem} size={size} value={value} onChange={handleChange} />
    </div>
  );
}
