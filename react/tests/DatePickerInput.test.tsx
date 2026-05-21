import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import { DatePickerInput } from '../src/NepaliDatePicker';

describe('DatePickerInput', () => {
  test('renders the input field correctly', () => {
    render(<DatePickerInput placeholder="Select date" />);
    const input = screen.getByPlaceholderText('Select date');
    expect(input).toBeInTheDocument();
  });

  test('opens calendar popover when clicked', () => {
    render(<DatePickerInput placeholder="Click me" />);
    const input = screen.getByPlaceholderText('Click me');

    // Calendar should not be open initially
    expect(screen.queryByRole('button', { name: /Previous period/i })).not.toBeInTheDocument();

    fireEvent.click(input);

    // Calendar should open
    // Calendar should open, find it by class or role
    expect(screen.getByRole('button', { name: /Previous period/i })).toBeInTheDocument();
  });
});
