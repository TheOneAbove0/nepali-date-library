import { cloneElement, isValidElement, type ReactNode } from 'react';
import type { NepaliDatePickerCustomInputProps, NepaliDatePickerProps } from './NepaliDatePicker.types';
import { getSlotClassName, getSlotStyle, joinClassNames } from './NepaliDatePicker.utils';

interface PickerInputControlProps {
  props: NepaliDatePickerProps;
  inputValue: string;
  isInputTypeable: boolean;
  openCalendar: () => void;
  onInputBlur: () => void;
  onInputKeyDown: (key: string) => void;
  onInputValueChange: (nextValue: string) => void;
}

export function PickerInputControl({
  props,
  inputValue,
  isInputTypeable,
  openCalendar,
  onInputBlur,
  onInputKeyDown,
  onInputValueChange,
}: PickerInputControlProps): ReactNode {
  const inputProps: NepaliDatePickerCustomInputProps = {
    value: inputValue,
    placeholder: props.placeholderText,
    disabled: props.disabled,
    readOnly: !isInputTypeable,
    onClick: openCalendar,
    onFocus: openCalendar,
    onBlur: () => onInputBlur(),
    onChange: (event) => onInputValueChange(event.target.value),
    onKeyDown: (event) => onInputKeyDown(event.key),
  };

  if (props.customInput && isValidElement(props.customInput)) {
    return cloneElement(props.customInput, inputProps, inputValue || props.placeholderText || 'Pick date');
  }

  return (
    <input
      aria-haspopup="dialog"
      className={joinClassNames(getSlotClassName(props, 'input', 'nepali-date-picker__input'), props.inputClassName)}
      disabled={props.disabled}
      onClick={openCalendar}
      onFocus={openCalendar}
      onBlur={inputProps.onBlur}
      onChange={inputProps.onChange}
      onKeyDown={inputProps.onKeyDown}
      placeholder={props.placeholderText}
      readOnly={!isInputTypeable}
      style={getSlotStyle(props, 'input')}
      type="text"
      value={inputValue}
    />
  );
}
