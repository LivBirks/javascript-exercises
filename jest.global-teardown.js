/**
 * Jest Global Teardown - Runs once after all tests
 */

module.exports = async () => {
  console.log('✅ JavaScript Exercises Test Suite Complete!');

  // Cleanup any global resources
  console.log('🧹 Cleaning up test environment...');
};