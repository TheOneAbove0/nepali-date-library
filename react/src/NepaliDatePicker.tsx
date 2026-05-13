import { CalendarView } from './NepaliDatePickerCalendar';
import { ChevronDownIcon, ClearIcon } from './NepaliDatePicker.icons';
import { PickerInputControl } from './NepaliDatePickerInput';
import type {
  CalendarProps,
  DateInputProps,
  DatePickerInputProps,
  DatePickerProps,
  MonthPickerInputProps,
  MonthPickerProps,
  NepaliDatePickerClassNames,
  NepaliDatePickerCustomInputProps,
  NepaliDatePickerDayNameProps,
  NepaliDatePickerHeaderProps,
  NepaliDateHoliday,
  NepaliDateHolidayInput,
  NepaliDatePickerLevel,
  NepaliDatePickerProps,
  NepaliDatePickerSlot,
  NepaliDatePickerStyles,
  NepaliDatePickerSize,
  NepaliDatePickerType,
  NepaliDatePickerValue,
  NepaliDatePickerVariables,
  NepaliNumeralSystem,
  YearPickerInputProps,
  YearPickerProps,
} from './NepaliDatePicker.types';
import { getRootStyle, getSlotClassName, getSlotStyle } from './NepaliDatePicker.utils';
import { useNepaliDatePickerController } from './useNepaliDatePickerController';

export type {
  CalendarProps,
  DateInputProps,
  DatePickerInputProps,
  DatePickerProps,
  MonthPickerInputProps,
  MonthPickerProps,
  NepaliDatePickerClassNames,
  NepaliDatePickerCustomInputProps,
  NepaliDatePickerDayNameProps,
  NepaliDatePickerHeaderProps,
  NepaliDateHoliday,
  NepaliDateHolidayInput,
  NepaliDatePickerLevel,
  NepaliDatePickerProps,
  NepaliDatePickerSlot,
  NepaliDatePickerStyles,
  NepaliDatePickerSize,
  NepaliDatePickerType,
  NepaliDatePickerValue,
  NepaliDatePickerVariables,
  NepaliNumeralSystem,
  YearPickerInputProps,
  YearPickerProps,
} from './NepaliDatePicker.types';

export function NepaliDatePicker(props: NepaliDatePickerProps) {
  const controller = useNepaliDatePickerController(props);

  const calendar = (
    <CalendarView
      calendarId={controller.calendarId}
      calendarLevel={controller.calendarLevel}
      disabled={controller.disabled}
      holidays={controller.holidays}
      isDateDisabled={controller.isDateDisabled}
      numeralSystem={controller.numeralSystem}
      onChangeLevel={controller.setCalendarLevel}
      onSelectDate={controller.selectDate}
      picker={controller.picker}
      pickerType={controller.pickerType}
      props={props}
      rangeValue={controller.rangeDraft}
      selectionType={controller.selectionType}
    />
  );

  if (controller.inline) {
    return (
      <div
        className={getSlotClassName(props, 'root', 'nepali-date-picker', 'nepali-date-picker--inline', props.className)}
        data-inline="true"
        data-picker-type={controller.pickerType}
        data-selection-type={controller.selectionType}
        ref={controller.rootRef}
        style={getRootStyle(props)}
      >
        {props.label && (
          <div className={getSlotClassName(props, 'label', 'nepali-date-picker__label')} style={getSlotStyle(props, 'label')}>
            {props.label}
          </div>
        )}
        {props.description && (
          <div className={getSlotClassName(props, 'description', 'nepali-date-picker__description')} style={getSlotStyle(props, 'description')}>
            {props.description}
          </div>
        )}
        {calendar}
      </div>
    );
  }

  return (
    <div
      className={getSlotClassName(props, 'root', 'nepali-date-picker', props.className)}
      data-inline="false"
      data-open={controller.isOpen || undefined}
      data-picker-type={controller.pickerType}
      data-selection-type={controller.selectionType}
      ref={controller.rootRef}
      style={getRootStyle(props)}
    >
      {props.label && (
        <label className={getSlotClassName(props, 'label', 'nepali-date-picker__label')} style={getSlotStyle(props, 'label')}>
          {props.label}
        </label>
      )}
      {props.description && (
        <div className={getSlotClassName(props, 'description', 'nepali-date-picker__description')} style={getSlotStyle(props, 'description')}>
          {props.description}
        </div>
      )}
      <div className={getSlotClassName(props, 'inputShell', 'nepali-date-picker__input-shell')} style={getSlotStyle(props, 'inputShell')}>
        <PickerInputControl
          inputValue={controller.inputValue}
          isInputTypeable={controller.isInputTypeable}
          onInputBlur={controller.onInputBlur}
          onInputKeyDown={controller.onInputKeyDown}
          onInputValueChange={controller.onInputValueChange}
          openCalendar={controller.openCalendar}
          props={props}
        />
        {(props.showIcon || controller.pickerType !== 'date') && (
          <button
            aria-label="Open calendar"
            className={getSlotClassName(props, 'iconButton', 'nepali-date-picker__icon-button')}
            disabled={props.disabled || props.readOnly}
            onClick={props.toggleCalendarOnIconClick ? controller.toggleCalendar : controller.openCalendar}
            style={getSlotStyle(props, 'iconButton')}
            type="button"
          >
            {typeof props.icon === 'string' ? <span aria-hidden="true" className={props.icon} /> : props.icon ?? <ChevronDownIcon />}
          </button>
        )}
        {controller.isClearable && controller.selectedDate && (
          <button
            aria-label="Clear selected date"
            className={getSlotClassName(props, 'clearButton', 'nepali-date-picker__clear-button')}
            disabled={props.disabled || props.readOnly}
            onClick={controller.clearValue}
            style={getSlotStyle(props, 'clearButton')}
            type="button"
          >
            <ClearIcon />
          </button>
        )}
      </div>
      {controller.isOpen && (
        <div
          className={getSlotClassName(props, 'popper', 'nepali-date-picker__popper', props.popperClassName)}
          id={controller.calendarId}
          style={getSlotStyle(props, 'popper')}
        >
          {calendar}
        </div>
      )}
    </div>
  );
}

export function DatePickerInput(props: DatePickerInputProps) {
  return <NepaliDatePicker {...props} pickerType="date" />;
}

export function DateInput(props: DateInputProps) {
  return <NepaliDatePicker {...props} pickerType="date" />;
}

export function DatePicker(props: DatePickerProps) {
  return <NepaliDatePicker {...props} inline={props.inline ?? true} pickerType="date" />;
}

export function MonthPickerInput(props: MonthPickerInputProps) {
  return <NepaliDatePicker {...props} pickerType="month" />;
}

export function MonthPicker(props: MonthPickerProps) {
  return <NepaliDatePicker {...props} inline={props.inline ?? true} pickerType="month" />;
}

export function YearPickerInput(props: YearPickerInputProps) {
  return <NepaliDatePicker {...props} pickerType="year" />;
}

export function YearPicker(props: YearPickerProps) {
  return <NepaliDatePicker {...props} inline={props.inline ?? true} pickerType="year" />;
}

export function Calendar(props: CalendarProps) {
  return <NepaliDatePicker {...props} inline={props.inline ?? true} pickerType="date" />;
}
