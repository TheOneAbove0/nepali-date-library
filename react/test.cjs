const { parseBsDate } = require('@theoneabove0/nepalidatepicker');

try {
  parseBsDate({ year: 2093, month: 1, day: 1 });
  console.log('Success');
} catch (e) {
  console.error('Error:', e.message);
}
