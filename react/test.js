const {
  getSupportedDaysInMonth,
  MAX_SUPPORTED_YEAR,
  MIN_SUPPORTED_YEAR,
} = require('@theoneabove0/nepalidatepicker/datepicker-core');
const lib = require('@theoneabove0/nepalidatepicker');
console.log(lib.MAX_SUPPORTED_YEAR || lib.maxSupportedYear);
console.log(getSupportedDaysInMonth);
