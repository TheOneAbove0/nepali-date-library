var test = require('node:test');
var assert = require('node:assert/strict');

var describe = test.describe;
var it = test.it;

var core = require('../dist/datepicker-core.cjs');

describe('nepali-date-library datepicker-core', function() {
  describe('#generateMonthGrid()', function() {
    it('should generate full calendar weeks for a month', function() {
      var grid = core.generateMonthGrid(2083, 1, { weekStartsOn: 0 });

      assert.ok(grid.weeks.length >= 4);
      assert.ok(grid.weeks.length <= 6);
      assert.equal(grid.weeks[0].length, 7);

      var dayCount = 0;
      grid.weeks.forEach(function(week) {
        week.forEach(function(cell) {
          if(cell.inCurrentMonth) dayCount += 1;
        });
      });

      assert.equal(dayCount, 31);
    });

    it('should mark dates outside min/max range as disabled', function() {
      var grid = core.generateMonthGrid(2083, 1, {
        constraints: {
          min: '2083-01-05',
          max: '2083-01-20',
        },
      });

      var beforeMin = null;
      var withinRange = null;
      var afterMax = null;

      grid.weeks.forEach(function(week) {
        week.forEach(function(cell) {
          if(cell.inCurrentMonth && cell.date.day === 3) beforeMin = cell;
          if(cell.inCurrentMonth && cell.date.day === 10) withinRange = cell;
          if(cell.inCurrentMonth && cell.date.day === 28) afterMax = cell;
        });
      });

      assert.equal(beforeMin.isDisabled, true);
      assert.equal(withinRange.isDisabled, false);
      assert.equal(afterMax.isDisabled, true);
    });
  });

  describe('#createDatePickerState()', function() {
    it('should clamp focused/selected dates to constraints', function() {
      var state = core.createDatePickerState({
        focusedDate: '2083-01-01',
        selectedDate: '2083-12-01',
        constraints: {
          min: '2083-02-10',
          max: '2083-10-05',
        },
      });

      assert.deepEqual(state.focusedDate, { year: 2083, month: 2, day: 10 });
      assert.deepEqual(state.selectedDate, { year: 2083, month: 10, day: 5 });
    });
  });

  describe('#navigateByKey()', function() {
    it('should add days across BS month boundaries without Gregorian roundtrips', function() {
      assert.deepEqual(core.addBsDays('2083-01-30', 2), { year: 2083, month: 2, day: 1 });
      assert.deepEqual(core.addBsDays('2083-02-01', -2), { year: 2083, month: 1, day: 30 });
    });

    it('should move one day with arrow keys', function() {
      var state = core.createDatePickerState({ focusedDate: '2083-01-10' });
      var next = core.navigateByKey(state, 'ArrowRight');

      assert.deepEqual(next.focusedDate, { year: 2083, month: 1, day: 11 });
    });

    it('should move 12 months with shift + PageDown', function() {
      var state = core.createDatePickerState({ focusedDate: '2083-01-10' });
      var next = core.navigateByKey(state, 'PageDown', { shiftKey: true });

      assert.equal(next.focusedDate.year, 2084);
      assert.equal(next.focusedDate.month, 1);
      assert.equal(next.focusedDate.day, 10);
    });

    it('should reject fractional month navigation deltas', function() {
      assert.throws(function() {
        core.addBsMonths('2083-01-10', 1.5);
      }, /Invalid monthsToAdd/);
    });

    it('should select focused date on Enter if enabled', function() {
      var state = core.createDatePickerState({ focusedDate: '2083-01-10' });
      var next = core.navigateByKey(state, 'Enter');

      assert.deepEqual(next.selectedDate, { year: 2083, month: 1, day: 10 });
    });

    it('should not select disabled date on Enter', function() {
      var state = core.createDatePickerState({
        focusedDate: '2083-01-10',
        constraints: {
          isDisabled: function(date) {
            return date.day === 10;
          },
        },
      });

      var next = core.navigateByKey(state, 'Enter');
      assert.equal(next.selectedDate, null);
    });
  });
});
