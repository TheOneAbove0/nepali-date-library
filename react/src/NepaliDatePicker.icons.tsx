function ChevronLeftIcon() {
  return (
    <svg aria-hidden="true" className="nepali-date-picker__icon" viewBox="0 0 16 16">
      <path
        d="M10 3 5 8l5 5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg aria-hidden="true" className="nepali-date-picker__icon" viewBox="0 0 16 16">
      <path
        d="m6 3 5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" className="nepali-date-picker__icon" viewBox="0 0 16 16">
      <path
        d="m3.5 6 4.5 4 4.5-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg aria-hidden="true" className="nepali-date-picker__icon" viewBox="0 0 16 16">
      <path
        d="m4 4 8 8M12 4 4 12"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" className="nepali-date-picker__icon" viewBox="0 0 16 16">
      <circle cx="8" cy="8" fill="none" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 5v3l2 1"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ClearIcon, ClockIcon };
