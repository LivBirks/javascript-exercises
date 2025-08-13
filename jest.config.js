/**
 * Jest Configuration
 */

export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  globalSetup: '<rootDir>/jest.global-setup.js',
  globalTeardown: '<rootDir>/jest.global-teardown.js',
  testMatch: [
    '**/tests/**/*.test.js',
    '**/*.test.js'
  ],
  collectCoverageFrom: [
    'exercises/**/*.js',
    '!exercises/**/tests/**'
  ],
  projects: [
    {
      displayName: 'Basic Exercises',
      testMatch: ['<rootDir>/exercises/01-basic/**/*.test.js']
    },
    {
      displayName: 'Functions',
      testMatch: ['<rootDir>/exercises/03-functions/**/*.test.js']
    },
    {
      displayName: 'ES6 Fundamentals Part 1',
      testMatch: ['<rootDir>/exercises/02-fundamental-es6-part1/**/*.test.js']
    },
    {
      displayName: 'Async & Promises',
      testMatch: ['<rootDir>/exercises/11-async/**/*.test.js', '<rootDir>/exercises/12-promises/**/*.test.js']
    },
    {
      displayName: 'DOM & Events',
      testMatch: ['<rootDir>/exercises/17-dom/**/*.test.js', '<rootDir>/exercises/18-events/**/*.test.js']
    }
  ],
  testTimeout: 10000,
  verbose: true
};