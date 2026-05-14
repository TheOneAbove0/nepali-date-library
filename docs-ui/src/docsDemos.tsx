import {
  Calendar,
  DateInput,
  DateTimePicker,
  DatePicker,
  DatePickerInput,
  MonthPicker,
  MonthPickerInput,
  type NepaliDatePickerSize,
  TimeInput,
  TimePicker,
  YearPicker,
  YearPickerInput,
} from 'nepali-date-library-react';
import { useRef, useState } from 'react';
import { formatBsDateNepali, type BsDate } from 'nepali-date-library';
import {
  brandedStyles,
  brandedVariables,
  sampleBs,
  sharedPickerProps,
  toDateRange,
  toSingleDate,
} from './docsShared';

export function DatePickerInputDemo() {
  const [value, setValue] = useState<BsDate | null>(sampleBs);

  return (
    <DatePickerInput
      {...sharedPickerProps}
      label="Pick date"
      placeholderText="Pick date"
      showIcon
      value={value}
      onChange={(next) => setValue(toSingleDate(next))}
    />
  );
}

export function DateInputDemo() {
  const [value, setValue] = useState<BsDate | null>(sampleBs);

  return (
    <DateInput
      {...sharedPickerProps}
      clearable
      label="Pick date"
      placeholderText="Pick date"
      showIcon
      value={value}
      onChange={(next) => setValue(toSingleDate(next))}
    />
  );
}

export function TypeableDateInputDemo() {
  const [value, setValue] = useState<BsDate | null>(sampleBs);

  return (
    <DatePickerInput
      {...sharedPickerProps}
      description="Type a BS date, then press Enter or blur the field to commit it."
      label="Typeable date input"
      placeholderText="YYYY-MM-DD"
      showIcon
      typeable
      value={value}
      onChange={(next) => setValue(toSingleDate(next))}
    />
  );
}

export function DatePickerDemo() {
  const [value, setValue] = useState<BsDate | null>(sampleBs);

  return (
    <DatePicker
      {...sharedPickerProps}
      value={value}
      onChange={(next) => setValue(toSingleDate(next))}
    />
  );
}

export function MonthPickerInputDemo() {
  const [value, setValue] = useState<BsDate | null>({ year: 2083, month: 1, day: 1 });

  return (
    <MonthPickerInput
      {...sharedPickerProps}
      label="Pick month"
      placeholderText="Pick month"
      value={value}
      onChange={(next) => setValue(toSingleDate(next))}
    />
  );
}

export function MonthPickerDemo() {
  const [value, setValue] = useState<BsDate | null>({ year: 2083, month: 1, day: 1 });

  return (
    <MonthPicker
      {...sharedPickerProps}
      value={value}
      onChange={(next) => setValue(toSingleDate(next))}
    />
  );
}

export function YearPickerInputDemo() {
  const [value, setValue] = useState<BsDate | null>({ year: 2083, month: 1, day: 1 });

  return (
    <YearPickerInput
      label="Pick year"
      placeholderText="Pick year"
      value={value}
      onChange={(next) => setValue(toSingleDate(next))}
    />
  );
}

export function YearPickerDemo() {
  const [value, setValue] = useState<BsDate | null>({ year: 2083, month: 1, day: 1 });

  return <YearPicker value={value} onChange={(next) => setValue(toSingleDate(next))} />;
}

export function CalendarDemo() {
  const [value, setValue] = useState<BsDate | null>(sampleBs);

  return (
    <Calendar
      {...sharedPickerProps}
      value={value}
      onChange={(next) => setValue(toSingleDate(next))}
    >
      <div className="calendarFooter">Selected: {value ? formatBsDateNepali(value) : 'None'}</div>
    </Calendar>
  );
}

export function HolidayDemo() {
  const [value, setValue] = useState<BsDate | null>(sampleBs);

  return (
    <DatePickerInput
      {...sharedPickerProps}
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
      label="Holiday dates"
      placeholderText="Pick festival date"
      showIcon
      value={value}
      onChange={(next) => setValue(toSingleDate(next))}
    />
  );
}

export function WeekendHolidayDemo() {
  const [value, setValue] = useState<BsDate | null>(sampleBs);

  return (
    <DatePickerInput
      {...sharedPickerProps}
      classNames={{ calendar: 'docsWeekendHolidayCalendar' }}
      description="Use column-based CSS when the same weekday should always look like a holiday."
      label="Weekend holidays"
      placeholderText="Pick date"
      showIcon
      value={value}
      onChange={(next) => setValue(toSingleDate(next))}
    />
  );
}

export function ConstraintsDemo() {
  const [value, setValue] = useState<BsDate | null>(sampleBs);

  return (
    <DatePickerInput
      {...sharedPickerProps}
      excludeDates={['2083-01-11', '2083-01-18']}
      label="Booking date"
      max="2083-01-28"
      min="2083-01-05"
      placeholderText="Pick available date"
      showIcon
      value={value}
      onChange={(next) => setValue(toSingleDate(next))}
    />
  );
}

export function CustomInputDemo() {
  const [value, setValue] = useState<BsDate | null>(sampleBs);

  return (
    <DatePickerInput
      {...sharedPickerProps}
      customInput={<button className="docsCustomInput" type="button" />}
      dateFormat={formatBsDateNepali}
      value={value}
      onChange={(next) => setValue(toSingleDate(next))}
    />
  );
}

export function CustomHeaderDemo() {
  const [value, setValue] = useState<BsDate | null>(sampleBs);

  return (
    <DatePicker
      {...sharedPickerProps}
      renderCustomHeader={({ label, decrease, increase }) => (
        <div className="docsCustomHeader">
          <button onClick={decrease} type="button">
            Prev
          </button>
          <strong>{label}</strong>
          <button onClick={increase} type="button">
            Next
          </button>
        </div>
      )}
      value={value}
      onChange={(next) => setValue(toSingleDate(next))}
    />
  );
}

export function DayClassDemo() {
  const [value, setValue] = useState<BsDate | null>(sampleBs);

  return (
    <DatePicker
      {...sharedPickerProps}
      dayClassName={(date) => {
        if (date.day === 1) return 'docsMonthOpeningDay';
        if (date.day === 15) return 'docsMidMonthDay';
        return '';
      }}
      value={value}
      onChange={(next) => setValue(toSingleDate(next))}
    />
  );
}

export function DateRangeDemo() {
  const [value, setValue] = useState<[BsDate | null, BsDate | null]>([
    { year: sampleBs.year, month: sampleBs.month, day: 6 },
    { year: sampleBs.year, month: sampleBs.month, day: 14 },
  ]);

  return (
    <DatePicker
      {...sharedPickerProps}
      type="range"
      value={value}
      onChange={(next) => setValue(toDateRange(next))}
    />
  );
}

export function DateTimePickerDemo() {
  const [value, setValue] = useState<{ date: BsDate | null; time: string }>({
    date: sampleBs,
    time: '15:22',
  });
  const [format, setFormat] = useState<'12h' | '24h'>('24h');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<0 | 1 | 6>(1);
  const [withCellSpacing, setWithCellSpacing] = useState(true);
  const [typeable, setTypeable] = useState(true);

  return (
    <div className="docsInlinePlayground">
      <div className="docsInlinePlayground__preview">
        <DateTimePicker
          {...sharedPickerProps}
          clearable
          firstDayOfWeek={firstDayOfWeek}
          label="Pick date and time"
          placeholder="Pick date and time"
          showIcon
          timePickerProps={{
            format,
            withDropdown: true,
          }}
          timeLabel="Time"
          typeable={typeable}
          value={value}
          withCellSpacing={withCellSpacing}
          onChange={setValue}
        />
      </div>
      <aside className="docsInlinePlayground__controls">
        <div className="docsControlGroup">
          <label className="docsControlLabel">Time format</label>
          <div className="docsSegmented">
            <button
              className={format === '24h' ? 'is-active' : undefined}
              onClick={() => setFormat('24h')}
              type="button"
            >
              24h
            </button>
            <button
              className={format === '12h' ? 'is-active' : undefined}
              onClick={() => setFormat('12h')}
              type="button"
            >
              12h
            </button>
          </div>
        </div>

        <div className="docsControlGroup">
          <label className="docsControlLabel" htmlFor="week-start">
            Week starts on
          </label>
          <select
            className="docsControlSelect"
            id="week-start"
            onChange={(event) => setFirstDayOfWeek(Number(event.currentTarget.value) as 0 | 1 | 6)}
            value={String(firstDayOfWeek)}
          >
            <option value="0">Sunday</option>
            <option value="1">Monday</option>
            <option value="6">Saturday</option>
          </select>
        </div>

        <label className="docsControlToggle">
          <input
            checked={withCellSpacing}
            onChange={(event) => setWithCellSpacing(event.currentTarget.checked)}
            type="checkbox"
          />
          <span>Cell spacing</span>
        </label>

        <label className="docsControlToggle">
          <input
            checked={typeable}
            onChange={(event) => setTypeable(event.currentTarget.checked)}
            type="checkbox"
          />
          <span>Typeable input</span>
        </label>
      </aside>
    </div>
  );
}

export function TimeInputDemo() {
  const ref = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState('15:22');

  return (
    <TimeInput
      description="Native browser picker with optional trigger button."
      label="Click icon to show browser picker"
      ref={ref}
      showPickerButton
      value={value}
      onChange={(next) => setValue(next)}
    />
  );
}

export function TimePickerDemo() {
  const [value24, setValue24] = useState('');
  const [value12, setValue12] = useState('');
  const [withDropdown, setWithDropdown] = useState(true);
  const [withSeconds, setWithSeconds] = useState(true);

  return (
    <div className="docsInlinePlayground">
      <div className="docsInlinePlayground__preview">
        <div style={{ width: '100%', maxWidth: 420 }}>
          <TimePicker
            label="Enter time (24h format)"
            value={value24}
            withDropdown={withDropdown}
            withSeconds={withSeconds}
            onChange={setValue24}
          />
          <TimePicker
            format="12h"
            label="Enter time (12h format)"
            mt="md"
            value={value12}
            withDropdown={withDropdown}
            withSeconds={withSeconds}
            onChange={setValue12}
          />
        </div>
      </div>
      <aside className="docsInlinePlayground__controls">
        <label className="docsControlToggle">
          <input
            checked={withDropdown}
            onChange={(event) => setWithDropdown(event.currentTarget.checked)}
            type="checkbox"
          />
          <span>With dropdown</span>
        </label>

        <label className="docsControlToggle">
          <input
            checked={withSeconds}
            onChange={(event) => setWithSeconds(event.currentTarget.checked)}
            type="checkbox"
          />
          <span>With seconds</span>
        </label>
      </aside>
    </div>
  );
}

export function NepaliNumeralsDemo() {
  const [value, setValue] = useState<BsDate | null>(sampleBs);

  return (
    <DatePickerInput
      label="Nepali numerals"
      numeralSystem="nepali"
      placeholderText="मिति छान्नुहोस्"
      value={value}
      onChange={(next) => setValue(toSingleDate(next))}
    />
  );
}

export function StylingDemo() {
  const [value, setValue] = useState<BsDate | null>(sampleBs);

  return (
    <DatePickerInput
      {...sharedPickerProps}
      classNames={{
        calendar: 'docsStyledCalendar',
        day: 'docsStyledDay',
        headerLabel: 'docsStyledHeaderLabel',
      }}
      description="Colors, radius, background, and state styling can all be overridden."
      label="Fully customizable surface"
      numeralSystem="nepali"
      placeholderText="Pick date"
      showIcon
      styles={brandedStyles}
      value={value}
      variables={brandedVariables}
      onChange={(next) => setValue(toSingleDate(next))}
    />
  );
}

export function SizeDemo() {
  const [value, setValue] = useState<BsDate | null>(sampleBs);
  const [size, setSize] = useState<NepaliDatePickerSize>('md');

  return (
    <div style={{ display: 'grid', gap: '14px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {(['sm', 'md', 'lg', 'xl'] as const).map((option) => (
          <button
            key={option}
            onClick={() => setSize(option)}
            style={{
              border: '1px solid var(--line)',
              borderRadius: '999px',
              minHeight: '32px',
              padding: '0 12px',
              color: size === option ? 'var(--green)' : 'var(--ink)',
              background: size === option ? 'var(--green-soft)' : 'var(--paper)',
              fontWeight: 700,
            }}
            type="button"
          >
            {option.toUpperCase()}
          </button>
        ))}
      </div>

      <DatePicker
        {...sharedPickerProps}
        size={size}
        value={value}
        onChange={(next) => setValue(toSingleDate(next))}
      />
    </div>
  );
}
