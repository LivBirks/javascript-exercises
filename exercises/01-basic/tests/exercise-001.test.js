const getCurrentDayAndTime = require('../exercise-001');

describe('Exercise 1: Current Day and Time', () => {
  test('should return an object with day and time properties', () => {
    const result = getCurrentDayAndTime();

    expect(result).toHaveProperty('day');
    expect(result).toHaveProperty('time');
  });

  test('should format day correctly', () => {
    const result = getCurrentDayAndTime();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const dayPattern = new RegExp(`Today is : (${days.join('|')})\\.`);
    expect(result.day).toMatch(dayPattern);
  });

  test('should format time correctly (H:MM:SS with AM/PM)', () => {
    const result = getCurrentDayAndTime();
    const timePattern = /^Current time is : \d{1,2} (AM|PM) : \d{2} : \d{2}$/;

    expect(result.time).toMatch(timePattern);
  });
});