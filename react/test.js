const {
  getSupportedDaysInMonth,
  MAX_SUPPORTED_YEAR,
  MIN_SUPPORTED_YEAR,
} = require('nepali-date-library/datepicker-core');
const lib = require('nepali-date-library');
console.log(lib.MAX_SUPPORTED_YEAR || lib.maxSupportedYear);
console.log(getSupportedDaysInMonth);
