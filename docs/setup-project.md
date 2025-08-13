# Setup Documentation

## Installation & Configuration

### Prerequisites
- **Node.js** (v16+ recommended)
- **npm** (comes with Node.js)
- **Git** (for version control)

### Quick Setup
```bash
# Clone and navigate to the repository
cd javascript-exercises

# Install dependencies
npm install

# Verify setup is working
npm test
npm run check:progress
```

## Project Structure

```
javascript-exercises/
├── docs/                          # Documentation
│   ├── setup.md                   # This file
│   ├── testing-guide.md          # Testing instructions
│   └── progress-tracker.md       # Progress tracking guide
├── exercises/                     # Exercise categories
│   ├── 01-basic/                 # Basic JavaScript exercises
│   ├── 02-fundamental-es6-part1/ # ES6 fundamentals
│   ├── 03-functions/             # Function exercises
│   └── ...                       # Additional categories
├── utils/                         # Utility scripts
│   ├── exercise-runner.js        # Exercise execution system
│   ├── progress-tracker.js       # Progress monitoring
│   ├── exercise-template.js      # Template generator
│   └── test-helpers.js          # Testing utilities
├── jest.config.js                # Jest configuration
├── jest.setup.js                 # Test setup
├── jest.global-setup.js          # Global test setup
├── jest.global-teardown.js       # Global test teardown
└── package.json                  # Project configuration
```

## Configuration Files

### Jest Configuration (`jest.config.js`)
```javascript
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  globalSetup: '<rootDir>/jest.global-setup.js',
  globalTeardown: '<rootDir>/jest.global-teardown.js',
  testMatch: ['**/tests/**/*.test.js', '**/*.test.js'],
  collectCoverageFrom: ['exercises/**/*.js', '!exercises/**/tests/**'],
  projects: [
    {
      displayName: 'Basic Exercises',
      testMatch: ['<rootDir>/exercises/01-basic/**/*.test.js']
    },
    // Additional project configurations...
  ],
  testTimeout: 10000,
  verbose: true
};
```

### Package.json Scripts
All available commands are configured in `package.json`:

#### Testing Commands
```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:basic": "jest --selectProjects='Basic Exercises'",
  "test:functions": "jest --selectProjects='Functions'",
  "test:es6": "jest --selectProjects='ES6 Fundamentals Part 1'",
  "test:async": "jest --selectProjects='Async & Promises'",
  "test:dom": "jest --selectProjects='DOM & Events'",
  "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
  "test:silent": "jest --silent",
  "test:verbose": "jest --verbose"
}
```

#### Exercise Management Commands
```json
{
  "run:exercise": "node utils/exercise-runner.js run",
  "run:category": "node utils/exercise-runner.js category",
  "run:batch": "node utils/exercise-runner.js batch",
  "benchmark": "node utils/exercise-runner.js benchmark",
  "exercises:list": "node utils/exercise-runner.js list",
  "exercises:report": "node utils/exercise-runner.js report",
  "check:progress": "node utils/progress-tracker.js"
}
```

#### Code Quality Commands
```json
{
  "lint": "eslint exercises/**/*.js",
  "format": "prettier --write exercises/**/*.js"
}
```

## Dependencies

### Development Dependencies
```json
{
  "jest": "^29.7.0",           # Testing framework
  "eslint": "^8.57.0",         # Code linting
  "prettier": "^3.2.5",       # Code formatting
  "@babel/preset-env": "^7.23.9", # ES6+ transpilation
  "babel-jest": "^29.7.0"     # Jest Babel integration
}
```

## Environment Configuration

### Test Environment Setup
The project is configured with:
- **Node.js test environment** for server-side JavaScript
- **Custom Jest matchers** for enhanced testing
- **Global test utilities** for common operations
- **Performance measurement tools** for benchmarking
- **Console mocking utilities** for output testing

### Global Test Utilities
Automatically available in all tests:
```javascript
// Custom Jest matchers
expect(value).toBeWithinRange(min, max);

// Utility functions
await sleep(1000);                    // Delay execution
const mock = mockConsoleLog();        // Mock console output
const result = measurePerformance(fn, ...args); // Benchmark functions
```

## Verification Steps

### 1. Test Installation
```bash
# Run all tests
npm test

# Should show test results and coverage
```

### 2. Test Exercise Runner
```bash
# List available exercises
npm run exercises:list

# Run a single exercise
npm run run:exercise 01-basic 1
```

### 3. Test Progress Tracking
```bash
# Check initial progress (should show 0%)
npm run check:progress
```

### 4. Test Benchmarking
```bash
# Benchmark an exercise
npm run benchmark 01-basic 1
```

## Troubleshooting

### Common Issues

#### Jest Configuration Errors
```bash
# If you see "expect is not defined" errors
# Ensure jest.config.js properly references jest.setup.js
```

#### Missing Dependencies
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Permission Errors
```bash
# Fix file permissions
chmod +x utils/*.js
```

#### Test Path Issues
```bash
# Ensure test files are in correct directories
# Tests should be in: exercises/[category]/tests/*.test.js
```

### Performance Optimization

#### Large Test Suites
```bash
# Run tests in parallel (default)
npm test

# Run tests serially for debugging
npm run test:debug
```

#### Memory Usage
```bash
# Monitor memory usage during tests
node --max-old-space-size=4096 node_modules/.bin/jest
```

## Development Workflow

### Adding New Exercises
1. Create exercise file in appropriate category
2. Add corresponding test file
3. Update progress tracker totals if needed
4. Verify with `npm run exercises:list`

### Creating Test Files
```bash
# Use the template system
node utils/exercise-template.js
```

### Running Quality Checks
```bash
# Before committing changes
npm run lint
npm run format
npm test
```

## Advanced Configuration

### Custom Jest Projects
Add new test projects in `jest.config.js`:
```javascript
{
  displayName: 'New Category',
  testMatch: ['<rootDir>/exercises/new-category/**/*.test.js']
}
```

### Environment Variables
```bash
# Set test timeout
JEST_TIMEOUT=15000 npm test

# Enable verbose logging
DEBUG=true npm test
```

The setup is designed to be robust, scalable, and easy to maintain across thousands of exercises while providing comprehensive testing and progress tracking capabilities.