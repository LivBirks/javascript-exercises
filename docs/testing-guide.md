# Testing Guide

## Overview

The JavaScript Exercises project uses **Jest** as its testing framework with a sophisticated setup that supports individual exercise testing, category-based testing, coverage reporting, and performance benchmarking across 4,905 exercises.

## Quick Testing Commands

### Run All Tests
```bash
npm test                    # Run complete test suite
```

### Category-Specific Testing
```bash
npm run test:basic          # Basic exercises only
npm run test:functions      # Functions category only
npm run test:es6           # ES6 fundamentals only
npm run test:async         # Async & Promises only
npm run test:dom           # DOM & Events only
```

### Test Modes
```bash
npm run test:watch         # Watch mode - reruns on file changes
npm run test:coverage      # Generate coverage report
npm run test:verbose       # Detailed test output
npm run test:silent        # Minimal output
npm run test:debug         # Debug mode with Node inspector
```

## Testing Individual Exercises

### Using Exercise Runner
```bash
# Run exercise with automatic testing
npm run run:exercise 01-basic 1

# This will:
# - Execute the exercise code
# - Run corresponding tests
# - Show execution time
# - Update progress if tests pass
```

### Direct Jest Commands
```bash
# Test specific exercise
npx jest exercises/01-basic/tests/exercise-001.test.js

# Test specific category
npx jest exercises/01-basic/

# Test with pattern matching
npx jest --testNamePattern="Exercise 1"
```

## Test Structure

### Test File Organization
```
exercises/
├── 01-basic/
│   ├── exercise-001.js          # Exercise implementation
│   ├── tests/
│   │   └── exercise-001.test.js # Corresponding test file
│   └── solutions/               # Reference solutions
├── 02-fundamental-es6-part1/
│   ├── exercise-001.js
│   ├── tests/
│   │   └── exercise-001.test.js
```

### Test File Naming Convention
- Exercise files: `exercise-XXX.js`
- Test files: `exercise-XXX.test.js`
- Located in: `exercises/[category]/tests/`

## Writing Tests

### Basic Test Structure
```javascript
const exerciseFunction = require('../exercise-001');

describe('Exercise 1: Description', () => {
  test('should perform expected behavior', () => {
    const result = exerciseFunction();
    expect(result).toBe(expectedValue);
  });

  test('should handle edge cases', () => {
    expect(exerciseFunction(edgeCase)).toBe(expectedResult);
  });
});
```

### Available Jest Matchers

#### Standard Matchers
```javascript
expect(value).toBe(exact);
expect(value).toEqual(object);
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(array).toContain(item);
expect(string).toMatch(pattern);
```

#### Custom Matchers
```javascript
// Range validation (available globally)
expect(number).toBeWithinRange(min, max);
```

### Testing Utilities

#### Global Utilities (Available in All Tests)
```javascript
// Delay execution
await sleep(1000);

// Mock console output
const mock = mockConsoleLog();
// ... code that logs to console
console.log('test message');
expect(mock.logs).toContain(['test message']);
mock.restore();

// Performance measurement
const result = measurePerformance(expensiveFunction, arg1, arg2);
expect(result.executionTime).toBeLessThan(100); // milliseconds
```

#### Test Helper Functions
```javascript
const { 
  deepClone, 
  generateRandomArray, 
  arraysEqual, 
  measureExecutionTime 
} = require('../../../utils/test-helpers');

// Deep clone objects for testing
const original = { a: 1, b: { c: 2 } };
const copy = deepClone(original);

// Generate test data
const randomNumbers = generateRandomArray(10, 1, 100);

// Compare arrays
expect(arraysEqual([1, 2, 3], [1, 2, 3])).toBe(true);

// Measure performance
const { result, executionTime } = measureExecutionTime(myFunction, args);
```

## Coverage Reports

### Generate Coverage
```bash
npm run test:coverage
```

### Coverage Output
```
--------------------------|---------|----------|---------|---------|-------------------
File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------------------|---------|----------|---------|---------|-------------------
All files                 |   85.2   |   78.9   |   90.1  |   84.7  |                   
 01-basic                 |   88.5   |   82.1   |   92.3  |   87.9  |                   
  exercise-001.js         |   100    |   50     |   100   |   100   | 11                
```

### Coverage Files
- **HTML Report**: `coverage/lcov-report/index.html`
- **LCOV Data**: `coverage/lcov.info`
- **JSON Report**: `coverage/coverage-final.json`

## Testing Patterns

### Testing Console Output
```javascript
test('should output correct format', () => {
  const mock = mockConsoleLog();
  
  exerciseFunction();
  
  expect(mock.logs[0]).toEqual(['Expected output']);
  mock.restore();
});
```

### Testing Return Values
```javascript
test('should return object with correct properties', () => {
  const result = exerciseFunction();
  
  expect(result).toHaveProperty('day');
  expect(result).toHaveProperty('time');
  expect(result.day).toMatch(/Today is : (Monday|Tuesday|...)/);
});
```

### Testing Error Handling
```javascript
test('should handle invalid input', () => {
  expect(() => exerciseFunction(null)).toThrow();
  expect(() => exerciseFunction(undefined)).toThrow('Invalid input');
});
```

### Testing Async Functions
```javascript
test('should handle promises correctly', async () => {
  const result = await asyncExerciseFunction();
  expect(result).toBe(expectedValue);
});

test('should reject with error', async () => {
  await expect(failingAsyncFunction()).rejects.toThrow();
});
```

### Performance Testing
```javascript
test('should complete within time limit', () => {
  const { executionTime } = measurePerformance(expensiveFunction);
  expect(executionTime).toBeLessThan(1000); // 1 second
});
```

## Debugging Tests

### Debug Mode
```bash
# Start tests in debug mode
npm run test:debug

# Then in Chrome/Edge, navigate to:
chrome://inspect
```

### Verbose Output
```bash
# See detailed test information
npm run test:verbose

# See test results only
npm run test:silent
```

### Single Test File
```bash
# Run specific test file
npx jest exercises/01-basic/tests/exercise-001.test.js --verbose
```

## Test Organization by Category

### Basic Exercises (`01-basic`)
- Fundamental JavaScript concepts
- Variable declarations, operators
- Basic control structures

### Functions (`03-functions`)
- Function declarations and expressions
- Arrow functions, closures
- Higher-order functions

### ES6 Features (`02-fundamental-es6-part1`)
- Let/const, template literals
- Destructuring, spread operator
- Classes and modules

### Async Programming (`11-async`, `12-promises`)
- Callbacks and promises
- Async/await patterns
- Error handling in async code

### DOM Manipulation (`17-dom`, `18-events`)
- DOM querying and modification
- Event handling and delegation
- Browser API usage

## Best Practices

### Test Writing
1. **Descriptive test names** that explain the expected behavior
2. **Single responsibility** - one concept per test
3. **Clear assertions** with meaningful error messages
4. **Edge case coverage** for boundary conditions
5. **Setup/teardown** for complex test scenarios

### Performance Considerations
1. **Mock external dependencies** to isolate exercise logic
2. **Use appropriate timeouts** for async operations
3. **Clean up resources** in teardown methods
4. **Parallel execution** for independent tests

### Code Quality
```bash
# Run quality checks before testing
npm run lint          # Check code style
npm run format        # Auto-format code
npm test              # Run all tests
```

## Continuous Integration

### Pre-commit Hooks
The project supports automated testing on commits:
```bash
# Install git hooks
npm run prepare

# Tests run automatically before commits
git commit -m "Add new exercise"
```

### GitHub Actions Integration
Tests can be configured to run on:
- Pull requests
- Push to main branch
- Scheduled intervals
- Manual triggers

## Troubleshooting

### Common Test Failures

#### Import/Export Issues
```javascript
// Ensure proper module exports
module.exports = functionName;

// Correct import in tests
const functionName = require('../exercise-001');
```

#### Timeout Errors
```javascript
// Increase timeout for slow operations
test('slow operation', async () => {
  // Test code here
}, 15000); // 15 second timeout
```

#### Mock Issues
```javascript
// Always restore mocks
afterEach(() => {
  jest.restoreAllMocks();
});
```

### Performance Issues
```bash
# Run tests with increased memory
node --max-old-space-size=4096 node_modules/.bin/jest

# Run specific test suites
npm run test:basic
```

This testing framework provides comprehensive coverage and flexibility for validating JavaScript exercise solutions across all skill levels and categories.