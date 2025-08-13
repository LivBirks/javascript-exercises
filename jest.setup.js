/**
 * Jest Setup - Runs before each test file
 */

// Extend Jest matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Global test utilities
global.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock console.log for exercises that use it
global.mockConsoleLog = () => {
  const originalLog = console.log;
  const logs = [];
  console.log = (...args) => {
    logs.push(args);
  };
  return {
    logs,
    restore: () => { console.log = originalLog; }
  };
};

// Performance testing helper
global.measurePerformance = (fn, ...args) => {
  const start = performance.now();
  const result = fn(...args);
  const end = performance.now();
  return {
    result,
    executionTime: end - start
  };
};

// Set longer timeout for complex exercises
jest.setTimeout(10000);