/**
 * Utility functions for testing
 */

/**
 * Deep clone an object for testing
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Generate random test data
 */
function generateRandomArray(length = 10, min = 0, max = 100) {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

/**
 * Check if two arrays are equal
 */
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
}

/**
 * Measure execution time
 */
function measureExecutionTime(fn, ...args) {
  const start = performance.now();
  const result = fn(...args);
  const end = performance.now();
  return {
    result,
    executionTime: end - start
  };
}

module.exports = {
  deepClone,
  generateRandomArray,
  arraysEqual,
  measureExecutionTime
};