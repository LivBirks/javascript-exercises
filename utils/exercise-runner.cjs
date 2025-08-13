/**
 * Exercise Runner Utility
 * 
 * Provides functionality to run, test, and manage JavaScript exercises
 * Supports running individual exercises, batches, categories, and progress tracking
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const ProgressTracker = require('./progress-tracker.cjs');

class ExerciseRunner {
  constructor() {
    this.exercisesDir = path.join(__dirname, '..', 'exercises');
    this.progressTracker = new ProgressTracker();
    this.results = [];
    this.startTime = null;
    this.categories = this.loadCategories();
  }

  /**
   * Load all available exercise categories
   */
  loadCategories() {
    const categories = {};
    const categoryDirs = fs.readdirSync(this.exercisesDir)
      .filter(dir => fs.statSync(path.join(this.exercisesDir, dir)).isDirectory());

    categoryDirs.forEach(categoryDir => {
      const categoryPath = path.join(this.exercisesDir, categoryDir);
      const exercises = fs.readdirSync(categoryPath)
        .filter(file => file.startsWith('exercise-') && file.endsWith('.js'))
        .map(file => ({
          number: parseInt(file.match(/exercise-(\d+)\.js/)[1]),
          file: file,
          path: path.join(categoryPath, file)
        }))
        .sort((a, b) => a.number - b.number);

      if (exercises.length > 0) {
        categories[categoryDir] = {
          name: this.formatCategoryName(categoryDir),
          path: categoryPath,
          exercises: exercises,
          count: exercises.length
        };
      }
    });

    return categories;
  }

  /**
   * Format category directory name for display
   */
  formatCategoryName(dirName) {
    return dirName
      .replace(/^\d+-/, '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Run a single exercise
   */
  async runExercise(category, exerciseNumber, options = {}) {
    const {
      showOutput = true,
      measureTime = true,
      runTests = false,
      updateProgress = false
    } = options;

    console.log(`\n🚀 Running ${category}/exercise-${exerciseNumber.toString().padStart(3, '0')}`);

    if (!this.categories[category]) {
      throw new Error(`Category '${category}' not found`);
    }

    const exercise = this.categories[category].exercises
      .find(ex => ex.number === exerciseNumber);

    if (!exercise) {
      throw new Error(`Exercise ${exerciseNumber} not found in category '${category}'`);
    }

    const result = {
      category,
      exerciseNumber,
      success: false,
      output: null,
      error: null,
      executionTime: null,
      testsPassed: null
    };

    try {
      // Measure execution time
      const startTime = measureTime ? performance.now() : null;

      // Run the exercise
      const output = await this.executeFile(exercise.path);

      if (measureTime) {
        result.executionTime = performance.now() - startTime;
      }

      result.success = true;
      result.output = output;

      if (showOutput) {
        console.log('📤 Output:');
        console.log(output);

        if (measureTime) {
          console.log(`⏱️  Execution time: ${result.executionTime.toFixed(2)}ms`);
        }
      }

      // Run tests if requested
      if (runTests) {
        const testResult = await this.runExerciseTests(category, exerciseNumber);
        result.testsPassed = testResult.passed;

        if (showOutput) {
          console.log(`🧪 Tests: ${testResult.passed ? '✅ PASSED' : '❌ FAILED'}`);
          if (!testResult.passed && testResult.error) {
            console.log(`   Error: ${testResult.error}`);
          }
        }
      }

      // Update progress if requested
      if (updateProgress && result.success && (!runTests || result.testsPassed)) {
        this.progressTracker.markComplete(category, exerciseNumber);
      }

    } catch (error) {
      result.error = error.message;
      console.error(`❌ Error: ${error.message}`);
    }

    this.results.push(result);
    return result;
  }

  /**
   * Execute a JavaScript file and capture output
   */
  async executeFile(filePath) {
    return new Promise((resolve, reject) => {
      const child = spawn('node', [filePath], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: path.dirname(filePath)
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(new Error(stderr.trim() || `Process exited with code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });

      // Set timeout to prevent hanging
      setTimeout(() => {
        child.kill();
        reject(new Error('Exercise execution timed out'));
      }, 10000);
    });
  }

  /**
   * Run tests for a specific exercise
   */
  async runExerciseTests(category, exerciseNumber) {
    const testFile = path.join(
      this.exercisesDir,
      category,
      'tests',
      `exercise-${exerciseNumber.toString().padStart(3, '0')}.test.js`
    );

    if (!fs.existsSync(testFile)) {
      return { passed: null, error: 'No test file found' };
    }

    try {
      const output = execSync(`npm test -- --testPathPattern="${testFile}"`, {
        cwd: path.join(__dirname, '..'),
        encoding: 'utf8',
        stdio: 'pipe'
      });

      return { passed: !output.includes('FAIL'), error: null };
    } catch (error) {
      return { passed: false, error: error.message };
    }
  }

  /**
   * Run all exercises in a category
   */
  async runCategory(categoryName, options = {}) {
    const {
      startFrom = 1,
      endAt = null,
      showProgress = true,
      stopOnError = false
    } = options;

    console.log(`\n📚 Running category: ${this.categories[categoryName]?.name || categoryName}`);

    if (!this.categories[categoryName]) {
      throw new Error(`Category '${categoryName}' not found`);
    }

    const exercises = this.categories[categoryName].exercises
      .filter(ex => ex.number >= startFrom && (endAt === null || ex.number <= endAt));

    const categoryResults = {
      category: categoryName,
      totalExercises: exercises.length,
      completed: 0,
      failed: 0,
      results: []
    };

    for (const exercise of exercises) {
      if (showProgress) {
        console.log(`\n[${categoryResults.completed + 1}/${exercises.length}]`);
      }

      try {
        const result = await this.runExercise(categoryName, exercise.number, {
          ...options,
          showOutput: false
        });

        categoryResults.results.push(result);

        if (result.success) {
          categoryResults.completed++;
          console.log(`✅ Exercise ${exercise.number}: PASSED`);
        } else {
          categoryResults.failed++;
          console.log(`❌ Exercise ${exercise.number}: FAILED - ${result.error}`);

          if (stopOnError) {
            break;
          }
        }
      } catch (error) {
        categoryResults.failed++;
        console.log(`❌ Exercise ${exercise.number}: ERROR - ${error.message}`);

        if (stopOnError) {
          break;
        }
      }
    }

    console.log(`\n📊 Category Summary:`);
    console.log(`   Completed: ${categoryResults.completed}/${categoryResults.totalExercises}`);
    console.log(`   Failed: ${categoryResults.failed}/${categoryResults.totalExercises}`);
    console.log(`   Success Rate: ${((categoryResults.completed / categoryResults.totalExercises) * 100).toFixed(1)}%`);

    return categoryResults;
  }

  /**
   * Run a batch of exercises with pattern matching
   */
  async runBatch(pattern, options = {}) {
    console.log(`\n🔍 Running exercises matching pattern: ${pattern}`);

    const matches = this.findExercisesByPattern(pattern);

    if (matches.length === 0) {
      console.log('❌ No exercises found matching the pattern');
      return;
    }

    console.log(`📝 Found ${matches.length} exercises:`);
    matches.forEach(match => {
      console.log(`   - ${match.category}/exercise-${match.number.toString().padStart(3, '0')}`);
    });

    const batchResults = {
      pattern,
      totalExercises: matches.length,
      completed: 0,
      failed: 0,
      results: []
    };

    for (const match of matches) {
      const result = await this.runExercise(match.category, match.number, {
        ...options,
        showOutput: false
      });

      batchResults.results.push(result);

      if (result.success) {
        batchResults.completed++;
      } else {
        batchResults.failed++;
      }
    }

    console.log(`\n📊 Batch Summary:`);
    console.log(`   Completed: ${batchResults.completed}/${batchResults.totalExercises}`);
    console.log(`   Failed: ${batchResults.failed}/${batchResults.totalExercises}`);

    return batchResults;
  }

  /**
   * Find exercises by pattern (category, number range, etc.)
   */
  findExercisesByPattern(pattern) {
    const matches = [];

    // Pattern examples:
    // "01-basic" - all exercises in basic category
    // "01-basic:1-10" - exercises 1-10 in basic category
    // "functions:palindrome" - exercises with "palindrome" in name
    // "1-5" - exercises 1-5 in all categories

    if (pattern.includes(':')) {
      const [categoryPattern, exercisePattern] = pattern.split(':');

      Object.entries(this.categories).forEach(([categoryKey, category]) => {
        if (categoryKey.includes(categoryPattern) || category.name.toLowerCase().includes(categoryPattern.toLowerCase())) {
          category.exercises.forEach(exercise => {
            if (this.matchesExercisePattern(exercise, exercisePattern)) {
              matches.push({
                category: categoryKey,
                number: exercise.number,
                file: exercise.file
              });
            }
          });
        }
      });
    } else {
      // Check if it's a category name
      const categoryMatch = Object.entries(this.categories)
        .find(([key, cat]) => key === pattern || cat.name.toLowerCase() === pattern.toLowerCase());

      if (categoryMatch) {
        const [categoryKey, category] = categoryMatch;
        category.exercises.forEach(exercise => {
          matches.push({
            category: categoryKey,
            number: exercise.number,
            file: exercise.file
          });
        });
      } else {
        // Check if it's a number range (e.g., "1-10")
        const rangeMatch = pattern.match(/^(\d+)-(\d+)$/);
        if (rangeMatch) {
          const [, start, end] = rangeMatch.map(Number);
          Object.entries(this.categories).forEach(([categoryKey, category]) => {
            category.exercises.forEach(exercise => {
              if (exercise.number >= start && exercise.number <= end) {
                matches.push({
                  category: categoryKey,
                  number: exercise.number,
                  file: exercise.file
                });
              }
            });
          });
        }
      }
    }

    return matches.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.number - b.number;
    });
  }

  /**
   * Check if exercise matches pattern
   */
  matchesExercisePattern(exercise, pattern) {
    // Number range pattern (e.g., "1-10")
    const rangeMatch = pattern.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const [, start, end] = rangeMatch.map(Number);
      return exercise.number >= start && exercise.number <= end;
    }

    // Specific number
    const numberMatch = pattern.match(/^\d+$/);
    if (numberMatch) {
      return exercise.number === parseInt(pattern);
    }

    // Text search in filename (for future enhancement)
    return exercise.file.toLowerCase().includes(pattern.toLowerCase());
  }

  /**
   * Benchmark exercises (compare performance)
   */
  async benchmarkExercise(category, exerciseNumber, iterations = 10) {
    console.log(`\n⏱️  Benchmarking ${category}/exercise-${exerciseNumber} (${iterations} iterations)`);

    const times = [];

    for (let i = 0; i < iterations; i++) {
      const result = await this.runExercise(category, exerciseNumber, {
        showOutput: false,
        measureTime: true
      });

      if (result.success && result.executionTime !== null) {
        times.push(result.executionTime);
      }
    }

    if (times.length === 0) {
      console.log('❌ No successful runs for benchmarking');
      return null;
    }

    const stats = {
      iterations: times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      average: times.reduce((a, b) => a + b, 0) / times.length,
      median: times.sort((a, b) => a - b)[Math.floor(times.length / 2)]
    };

    console.log('📊 Benchmark Results:');
    console.log(`   Min: ${stats.min.toFixed(2)}ms`);
    console.log(`   Max: ${stats.max.toFixed(2)}ms`);
    console.log(`   Average: ${stats.average.toFixed(2)}ms`);
    console.log(`   Median: ${stats.median.toFixed(2)}ms`);

    return stats;
  }

  /**
   * List all available exercises
   */
  listExercises(categoryFilter = null) {
    console.log('\n📚 Available Exercises:\n');

    Object.entries(this.categories).forEach(([categoryKey, category]) => {
      if (categoryFilter && !categoryKey.includes(categoryFilter)) {
        return;
      }

      console.log(`${category.name} (${categoryKey}):`);
      console.log(`   📝 ${category.count} exercises`);

      if (category.count <= 10) {
        category.exercises.forEach(exercise => {
          console.log(`   ${exercise.number.toString().padStart(3, '0')}. ${exercise.file}`);
        });
      } else {
        console.log(`   001-${category.exercises[category.exercises.length - 1].number.toString().padStart(3, '0')} (${category.count} total)`);
      }
      console.log('');
    });
  }

  /**
   * Generate exercise report
   */
  generateReport() {
    if (this.results.length === 0) {
      console.log('📝 No exercises have been run yet');
      return;
    }

    const report = {
      totalRun: this.results.length,
      successful: this.results.filter(r => r.success).length,
      failed: this.results.filter(r => !r.success).length,
      averageTime: this.results
        .filter(r => r.executionTime !== null)
        .reduce((sum, r) => sum + r.executionTime, 0) /
        this.results.filter(r => r.executionTime !== null).length || 0,
      categories: {}
    };

    // Group by category
    this.results.forEach(result => {
      if (!report.categories[result.category]) {
        report.categories[result.category] = {
          total: 0,
          successful: 0,
          failed: 0
        };
      }

      report.categories[result.category].total++;
      if (result.success) {
        report.categories[result.category].successful++;
      } else {
        report.categories[result.category].failed++;
      }
    });

    console.log('\n📊 Exercise Report:');
    console.log(`   Total Exercises Run: ${report.totalRun}`);
    console.log(`   Successful: ${report.successful} (${((report.successful / report.totalRun) * 100).toFixed(1)}%)`);
    console.log(`   Failed: ${report.failed} (${((report.failed / report.totalRun) * 100).toFixed(1)}%)`);

    if (report.averageTime > 0) {
      console.log(`   Average Execution Time: ${report.averageTime.toFixed(2)}ms`);
    }

    console.log('\n📈 By Category:');
    Object.entries(report.categories).forEach(([category, stats]) => {
      const successRate = ((stats.successful / stats.total) * 100).toFixed(1);
      console.log(`   ${category}: ${stats.successful}/${stats.total} (${successRate}%)`);
    });

    return report;
  }

  /**
   * Clear results history
   */
  clearResults() {
    this.results = [];
    console.log('🧹 Results history cleared');
  }
}

// CLI interface when run directly
if (require.main === module) {
  const runner = new ExerciseRunner();
  const args = process.argv.slice(2);

  async function main() {
    try {
      if (args.length === 0) {
        console.log(`
🚀 Exercise Runner CLI

Usage:
  node utils/exercise-runner.js <command> [options]

Commands:
  run <category> <number>     Run a specific exercise
  category <name>             Run all exercises in a category
  batch <pattern>             Run exercises matching a pattern
  list [category]             List available exercises
  benchmark <category> <number> [iterations]  Benchmark an exercise
  report                      Show execution report

Examples:
  node utils/exercise-runner.js run 01-basic 1
  node utils/exercise-runner.js category functions
  node utils/exercise-runner.js batch "01-basic:1-10"
  node utils/exercise-runner.js list
  node utils/exercise-runner.js benchmark 01-basic 1 20
        `);
        return;
      }

      const command = args[0];

      switch (command) {
        case 'run':
          if (args.length < 3) {
            console.log('Usage: run <category> <number>');
            return;
          }
          await runner.runExercise(args[1], parseInt(args[2]), {
            runTests: true,
            updateProgress: true
          });
          break;

        case 'category':
          if (args.length < 2) {
            console.log('Usage: category <name>');
            return;
          }
          await runner.runCategory(args[1], {
            runTests: true,
            updateProgress: true
          });
          break;

        case 'batch':
          if (args.length < 2) {
            console.log('Usage: batch <pattern>');
            return;
          }
          await runner.runBatch(args[1], {
            runTests: true,
            updateProgress: true
          });
          break;

        case 'list':
          runner.listExercises(args[1]);
          break;

        case 'benchmark':
          if (args.length < 3) {
            console.log('Usage: benchmark <category> <number> [iterations]');
            return;
          }
          const iterations = args[3] ? parseInt(args[3]) : 10;
          await runner.benchmarkExercise(args[1], parseInt(args[2]), iterations);
          break;

        case 'report':
          runner.generateReport();
          break;

        default:
          console.log(`Unknown command: ${command}`);
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  }

  main();
}

module.exports = ExerciseRunner;