import { useEffect } from 'react';
import { parseBsDate, type BsDate, type BsDateInput, type WeekdayIndex } from 'nepali-date-library';
import { useNepaliDatePickerState } from './useNepaliDatePicker';

const MONTH_NAMES = ['बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत'];

export interface NepaliDatePickerProps {
  value?: BsDateInput | null;
  defaultValue?: BsDateInput | null;
  onChange?: (value: BsDate | null) => void;
  min?: BsDateInput;
  max?: BsDateInput;
  isDateDisabled?: (date: BsDate) => boolean;
  weekStartsOn?: WeekdayIndex;
  className?: string;
}

export function NepaliDatePicker(props: NepaliDatePickerProps) {
  const picker = useNepaliDatePickerState({
    value: props.value,
    defaultValue: props.defaultValue,
    min: props.min,
    max: props.max,
    isDateDisabled: props.isDateDisabled,
    weekStartsOn: props.weekStartsOn,
  });

  useEffect(() => {
    if (typeof props.value === 'undefined') {
      return;
    }

    if (props.value === null) {
      picker.setValue(null);
      return;
    }

    picker.setValue(parseBsDate(props.value));
  }, [props.value]);

  const onDayClick = (date: BsDate): void => {
    if (props.isDateDisabled && props.isDateDisabled(date)) {
      return;
    }

    picker.setValue(date);
    props.onChange?.(date);
  };

  return (
    <div className={props.className ?? 'nepali-date-picker'}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button type="button" onClick={picker.goToPreviousMonth}>{'<'}</button>
        <strong>{MONTH_NAMES[picker.state.viewMonth - 1]} {picker.state.viewYear}</strong>
        <button type="button" onClick={picker.goToNextMonth}>{'>'}</button>
      </div>
      <table>
        <tbody>
          {picker.grid.weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((cell) => (
                <td key={`${cell.date.year}-${cell.date.month}-${cell.date.day}`}>
                  <button
                    type="button"
                    disabled={cell.isDisabled}
                    onClick={() => onDayClick(cell.date)}
                    onKeyDown={(event) => {
                      const key = event.key;
                      if (
                        key === 'ArrowLeft' ||
                        key === 'ArrowRight' ||
                        key === 'ArrowUp' ||
                        key === 'ArrowDown' ||
                        key === 'Home' ||
                        key === 'End' ||
                        key === 'PageUp' ||
                        key === 'PageDown'
                      ) {
                        event.preventDefault();
                        picker.navigate(key, { shiftKey: event.shiftKey });
                      }

                      if ((key === 'Enter' || key === ' ') && !cell.isDisabled) {
                        event.preventDefault();
                        onDayClick(cell.date);
                      }
                    }}
                    style={{
                      opacity: cell.inCurrentMonth ? 1 : 0.55,
                      fontWeight: cell.isSelected ? 'bold' : 'normal',
                      textDecoration: cell.isToday ? 'underline' : 'none',
                    }}
                  >
                    {cell.date.day}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
