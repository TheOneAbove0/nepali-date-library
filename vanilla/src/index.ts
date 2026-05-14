import { parseBsDate, type BsDate, type BsDateInput, type WeekdayIndex } from 'nepali-date-library';
import {
  createDatePickerState,
  generateMonthGrid,
  navigateByKey,
  type DatePickerKey,
  type DatePickerState,
} from 'nepali-date-library/datepicker-core';

const MONTH_NAMES = [
  'बैशाख',
  'जेठ',
  'असार',
  'साउन',
  'भदौ',
  'असोज',
  'कार्तिक',
  'मंसिर',
  'पौष',
  'माघ',
  'फाल्गुन',
  'चैत',
];
const WEEKDAY_NAMES = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिही', 'शुक्र', 'शनि'];
const NAVIGATION_KEYS = new Set<string>([
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
  'PageUp',
  'PageDown',
]);

export interface NepaliDatePickerOptions {
  value?: BsDateInput | null;
  defaultValue?: BsDateInput | null;
  min?: BsDateInput;
  max?: BsDateInput;
  isDateDisabled?: (date: BsDate) => boolean;
  weekStartsOn?: WeekdayIndex;
  className?: string;
  onChange?: (value: BsDate | null) => void;
}

export class NepaliDatePicker {
  private readonly root: HTMLElement;
  private readonly options: NepaliDatePickerOptions;
  private state: DatePickerState;

  constructor(target: string | HTMLElement, options: NepaliDatePickerOptions = {}) {
    const element =
      typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    if (!element) {
      throw new Error(`NepaliDatePicker target not found: ${String(target)}`);
    }

    this.root = element;
    this.options = options;
    const initialValue = options.value ?? options.defaultValue ?? undefined;
    this.state = createDatePickerState({
      selectedDate: initialValue ?? undefined,
      focusedDate: initialValue ?? undefined,
      weekStartsOn: options.weekStartsOn,
      constraints: {
        min: options.min,
        max: options.max,
        isDisabled: options.isDateDisabled,
      },
    });

    this.render();
  }

  getValue(): BsDate | null {
    return this.state.selectedDate;
  }

  setValue(value: BsDateInput | null): void {
    if (value === null) {
      this.state = { ...this.state, selectedDate: null };
      this.render();
      this.options.onChange?.(null);
      return;
    }

    const selected = parseBsDate(value);
    this.state = {
      ...this.state,
      selectedDate: selected,
      focusedDate: selected,
      viewYear: selected.year,
      viewMonth: selected.month,
    };
    this.render();
    this.options.onChange?.(selected);
  }

  destroy(): void {
    this.root.innerHTML = '';
  }

  private navigate(key: DatePickerKey, shiftKey = false): void {
    this.state = navigateByKey(this.state, key, { shiftKey });
    this.render();
  }

  private render(): void {
    const grid = generateMonthGrid(this.state.viewYear, this.state.viewMonth, {
      weekStartsOn: this.state.weekStartsOn,
      constraints: this.state.constraints,
      selectedDate: this.state.selectedDate,
      focusedDate: this.state.focusedDate,
    });

    this.root.innerHTML = '';
    this.root.className = this.options.className ?? 'npdl-picker';
    this.root.setAttribute('role', 'application');
    this.root.setAttribute('aria-label', 'Nepali date picker');

    const header = document.createElement('div');
    header.className = 'npdl-picker__header';
    header.append(
      this.createNavButton('<', 'Previous month', () => this.navigate('PageUp')),
      this.createMonthLabel(),
      this.createNavButton('>', 'Next month', () => this.navigate('PageDown')),
    );

    const body = document.createElement('div');
    body.className = 'npdl-picker__grid';
    body.setAttribute('role', 'grid');

    WEEKDAY_NAMES.forEach((name) => {
      const weekday = document.createElement('span');
      weekday.className = 'npdl-picker__weekday';
      weekday.textContent = name;
      body.append(weekday);
    });

    grid.weeks.flat().forEach((cell) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = [
        'npdl-picker__day',
        cell.inCurrentMonth ? '' : 'npdl-picker__day--muted',
        cell.isSelected ? 'npdl-picker__day--selected' : '',
        cell.isToday ? 'npdl-picker__day--today' : '',
      ]
        .filter(Boolean)
        .join(' ');
      button.disabled = cell.isDisabled;
      button.textContent = String(cell.date.day);
      button.setAttribute('role', 'gridcell');
      button.setAttribute('aria-selected', String(cell.isSelected));
      button.setAttribute('aria-label', `${cell.date.year}-${cell.date.month}-${cell.date.day}`);
      button.addEventListener('click', () => this.setValue(cell.date));
      button.addEventListener('keydown', (event) => this.onDayKeydown(event, cell.date));
      body.append(button);
    });

    this.root.append(header, body);
  }

  private createMonthLabel(): HTMLElement {
    const label = document.createElement('strong');
    label.className = 'npdl-picker__month';
    label.textContent = `${MONTH_NAMES[this.state.viewMonth - 1]} ${this.state.viewYear}`;
    return label;
  }

  private createNavButton(
    label: string,
    ariaLabel: string,
    onClick: () => void,
  ): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'npdl-picker__nav';
    button.textContent = label;
    button.setAttribute('aria-label', ariaLabel);
    button.addEventListener('click', onClick);
    return button;
  }

  private onDayKeydown(event: KeyboardEvent, date: BsDate): void {
    if (NAVIGATION_KEYS.has(event.key)) {
      event.preventDefault();
      this.navigate(event.key as DatePickerKey, event.shiftKey);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.setValue(date);
    }
  }
}
