/**
 * Template generator for new exercises
 */

function createExerciseTemplate(exerciseNumber, title, description, difficulty = 1) {
  const stars = '⭐'.repeat(difficulty);

  return `/**
 * Exercise ${exerciseNumber}: ${title}
 * 
 * ${description}
 * 
 * Difficulty: ${stars}
 * Category: [Category Name]
 * 
 * TODO:
 * 1. [Step 1]
 * 2. [Step 2]
 * 3. [Step 3]
 */

function exercise${exerciseNumber.toString().padStart(3, '0')}() {
  // Your solution here
  
}

// Test your solution
console.log(exercise${exerciseNumber.toString().padStart(3, '0')}());

module.exports = exercise${exerciseNumber.toString().padStart(3, '0')};`;
}

module.exports = { createExerciseTemplate };