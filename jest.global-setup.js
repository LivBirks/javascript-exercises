/**
 * Jest Global Setup - Runs once before all tests
 */

module.exports = async () => {
  console.log('=€ Starting JavaScript Exercises Test Suite...');
  console.log('=Ú Loading exercise configurations...');
  
  // Set up global test environment
  process.env.NODE_ENV = 'test';
  
  // Initialize any global test resources here
  console.log(' Global setup complete!');
};