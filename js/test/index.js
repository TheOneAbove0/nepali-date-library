var test = require('node:test');
var assert = require('node:assert/strict');

var describe = test.describe;
var it = test.it;

var bs = require('../dist/index.cjs');

function test_data_for(forFn) {
  var fixtureMap = {
    toBik: 'toBik_euro',
    toAD: 'toGreg',
  };

  return require(`../../test-data/${fixtureMap[forFn] || forFn}`);
}

describe('nepali-date-library', function () {
  describe('#toBik_dev()', function () {
    Object.entries({
      // gregorian -> bikram
      '1950-04-13': '२००७-०१-०१',
    }).forEach(function (_entry) {
      var gregorian = _entry[0];
      var expectedBikram = _entry[1];

      it('should convert ' + gregorian + ' AD => ' + expectedBikram + ' BS', function () {
        // expect
        assert.equal(bs.toBik_dev(gregorian), expectedBikram);
      });
    });
  });

  describe('#toBik_text()', function () {
    Object.entries({
      // gregorian -> bikram
      '1950-04-13': '१ बैशाख २००७',
    }).forEach(function (_entry) {
      var gregorian = _entry[0];
      var expectedBikram = _entry[1];

      it('should convert ' + gregorian + ' AD => ' + expectedBikram + ' BS', function () {
        // expect
        assert.equal(bs.toBik_text(gregorian), expectedBikram);
      });
    });
  });

  describe('#toBS()', function () {
    Object.entries({
      // gregorian -> bikram
      '1950-04-13': { day: 1, month: 1, year: 2007 },
    }).forEach(function (_entry) {
      var gregorian = _entry[0];
      var expectedBikram = _entry[1];

      it('should convert ' + gregorian + ' AD => ' + expectedBikram + ' BS', function () {
        // expect
        assert.deepEqual(bs.toBS(gregorian), expectedBikram);
      });
    });

    it('should reject invalid gregorian dates', function () {
      assert.throws(function () {
        bs.toBS('2024-02-31');
      });
      assert.throws(function () {
        bs.toBS('not-a-date');
      });
    });

    it('should accept Date input', function () {
      assert.deepEqual(bs.toBS(new Date(Date.UTC(1950, 3, 13))), {
        day: 1,
        month: 1,
        year: 2007,
      });
    });
  });

  describe('#parseBsDate()', function () {
    it('should parse valid BS strings', function () {
      assert.deepEqual(bs.parseBsDate('2083-01-02'), {
        year: 2083,
        month: 1,
        day: 2,
      });
    });

    it('should reject invalid BS date strings', function () {
      assert.throws(function () {
        bs.parseBsDate('2083-13-01');
      });
    });
  });

  describe('#parseAdDate()', function () {
    it('should parse valid AD strings', function () {
      assert.deepEqual(bs.parseAdDate('2024-07-24'), {
        year: 2024,
        month: 7,
        day: 24,
      });
    });

    it('should parse Date input', function () {
      assert.deepEqual(bs.parseAdDate(new Date(Date.UTC(2024, 6, 24))), {
        year: 2024,
        month: 7,
        day: 24,
      });
    });

    it('should reject invalid AD date strings', function () {
      assert.throws(function () {
        bs.parseAdDate('2024-02-31');
      });
    });
  });

  describe('#isValidBsDate()', function () {
    it('should return true for valid BS date', function () {
      assert.equal(bs.isValidBsDate('2083-01-01'), true);
    });

    it('should return false for invalid BS date', function () {
      assert.equal(bs.isValidBsDate('2083-13-01'), false);
    });
  });

  describe('#formatBsDate()', function () {
    it('should format BS dates in machine and Nepali text formats', function () {
      assert.equal(bs.formatBsDate('2083-01-30'), '2083-01-30');
      assert.equal(bs.formatBsDate('2083-01-30', 'D MMMM YYYY'), '30 बैशाख 2083');
      assert.equal(bs.formatBsDateNepali('2083-01-30'), '३० बैशाख २०८३');
    });

    it('should format AD dates and AD as BS dates', function () {
      assert.equal(bs.formatAdDate('2026-05-13'), '2026-05-13');
      assert.equal(bs.formatAdAsBsDate('2026-05-13'), '2083-01-30');
      assert.equal(bs.formatAdAsBsDateNepali('2026-05-13'), '३० बैशाख २०८३');
    });
  });

  describe('#manipulation()', function () {
    it('should add and subtract BS days, months, and years', function () {
      assert.deepEqual(bs.addBsDays('2083-01-30', 2), {
        year: 2083,
        month: 2,
        day: 1,
      });
      assert.deepEqual(bs.subtractBsDays('2083-02-01', 2), {
        year: 2083,
        month: 1,
        day: 30,
      });
      assert.deepEqual(bs.addBsMonths('2083-01-31', 1), {
        year: 2083,
        month: 2,
        day: 31,
      });
      assert.deepEqual(bs.subtractBsMonths('2083-02-31', 1), {
        year: 2083,
        month: 1,
        day: 31,
      });
      assert.deepEqual(bs.addBsYears('2083-01-31', 1), {
        year: 2084,
        month: 1,
        day: 31,
      });
      assert.deepEqual(bs.subtractBsYears('2084-01-31', 1), {
        year: 2083,
        month: 1,
        day: 31,
      });
    });
  });

  describe('#toDev()', function () {
    it('should convert 2050-2-1 to ', () => {
      assert.deepEqual(bs.toDev(2050, 2, 1), {
        day: '१',
        month: 'जेठ',
        year: '२०५०',
      });
    });
  });

  describe('#toBik_euro()', function () {
    Object.entries(test_data_for('toBik')).forEach(function (_entry) {
      var gregorian = _entry[0];
      var expectedBikram = _entry[1];

      it('should convert ' + gregorian + ' AD => ' + expectedBikram + ' BS', function () {
        // expect
        assert.equal(bs.toBik_euro(gregorian), expectedBikram);
      });
    });
  });

  describe('#toAD()', function () {
    const asDate = (dateParts) => dateParts.join('-');

    test_data_for('toAD').forEach(function (data) {
      const [year, month, day] = data.bs;
      const expectedGreg = data.expectedGreg;

      it(`should convert ${asDate(data.bs)} BS to ${asDate(expectedGreg)} AD`, function () {
        // when
        var actual = bs.toAD(year, month, day);

        // then
        assert.deepEqual([actual.year, actual.month, actual.day], expectedGreg);
      });
    });

    it('should throw Error if year is too small', () => {
      assert.throws(() => bs.toAD(1969, 1, 1));
    });

    it('should throw Error if year is too big', () => {
      assert.throws(() => bs.toAD(9999, 1, 1));
    });

    it('should throw Error if year is NaN', () => {
      assert.throws(() => bs.toAD('', 1, 1));
    });

    it('should throw Error if month is too small', () => {
      assert.throws(() => bs.toAD(2033, 0, 1));
    });

    it('should throw Error if month is too big', () => {
      assert.throws(() => bs.toAD(2033, 13, 1));
    });

    it('should throw Error if month is NaN', () => {
      assert.throws(() => bs.toAD(2033, '', 1));
    });

    it('should throw Error if day is too small', () => {
      assert.throws(() => bs.toAD(2033, 1, 0));
    });

    it('should throw Error if day is too small', () => {
      assert.throws(() => bs.toAD(2033, 1, 0));
    });

    it('should throw Error if day is NaN', () => {
      assert.throws(() => bs.toAD(2033, 1, ''));
    });
  });

  describe('#toGreg_text()', function () {
    it('should translate a bikram date to a zero-padded string', () => {
      // expect
      assert.equal('1955-01-01', bs.toGreg_text(2011, 9, 17));
    });
  });

  describe('#daysInMonth()', function () {
    Object.entries(test_data_for('daysInMonth')).forEach(function (_entry) {
      var year = Number(_entry[0]);
      var monthLengths = _entry[1];

      describe(year + ' BS', function () {
        var month;

        for (month = 1; month <= 12; ++month) {
          var expectedDays = monthLengths[month - 1];

          it(
            'should have ' + expectedDays + ' days in month ' + month,
            (function (year, month, expectedDays) {
              return function () {
                // expect
                assert.equal(bs.daysInMonth(year, month), expectedDays);
              };
            })(year, month, expectedDays),
          );
        }
      });
    });
  });
});
