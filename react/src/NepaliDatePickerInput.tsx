import { cloneElement, isValidElement, type ReactNode } from 'react';
import type {
  NepaliDatePickerCustomInputProps,
  NepaliDatePickerProps,
} from './NepaliDatePicker.types';
import { getSlotClassName, getSlotStyle, joinClassNames } from './NepaliDatePicker.utils';

interface PickerInputControlProps {
  props: NepaliDatePickerProps;
  inputValue: string;
  isInputTypeable: boolean;
  openCalendar: () => void;
  onInputBlur: () => void;
  onInputKeyDown: (key: string) => void;
  onInputValueChange: (
    nextValue: string,
    cursorPosition?: number | null,
    isDeleting?: boolean,
  ) => void;
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
  const placeholderText = props.placeholder ?? props.placeholderText;

  const inputProps: NepaliDatePickerCustomInputProps = {
    value: inputValue,
    placeholder: placeholderText,
    disabled: props.disabled,
    readOnly: !isInputTypeable,
    onClick: openCalendar,
    onFocus: openCalendar,
    onBlur: () => onInputBlur(),
    onChange: (event) =>
      onInputValueChange(
        event.target.value,
        event.target.selectionStart,
        event.target.value.length < inputValue.length,
      ),
    onKeyDown: (event) => {
      if (event.key === 'Backspace' && isInputTypeable) {
        const nextValue = removePreviousSeparator(event.currentTarget);
        if (nextValue) {
          event.preventDefault();
          onInputValueChange(nextValue.value, nextValue.cursorPosition, true);
          return;
        }
      }

      onInputKeyDown(event.key);
    },
  };

  if (props.customInput && isValidElement(props.customInput)) {
    return cloneElement(
      props.customInput,
      inputProps,
      inputValue || placeholderText || 'Pick date',
    );
  }

  return (
    <input
      aria-haspopup="dialog"
      className={joinClassNames(
        getSlotClassName(props, 'input', 'nepali-date-picker__input'),
        props.inputClassName,
      )}
      disabled={props.disabled}
      onClick={openCalendar}
      onFocus={openCalendar}
      onBlur={inputProps.onBlur}
      onChange={inputProps.onChange}
      onKeyDown={inputProps.onKeyDown}
      placeholder={placeholderText}
      readOnly={!isInputTypeable}
      style={getSlotStyle(props, 'input')}
      type="text"
      value={inputValue}
    />
  );
}

function removePreviousSeparator(
  input: HTMLInputElement,
): { value: string; cursorPosition: number } | null {
  const start = input.selectionStart;
  const end = input.selectionEnd;
  if (start === null || end === null || start !== end || start < 1) {
    return null;
  }

  if (!/[-/.]/.test(input.value[start - 1])) {
    return null;
  }

  return {
    value: `${input.value.slice(0, start - 1)}${input.value.slice(end)}`,
    cursorPosition: start - 1,
  };
}
