const fs = require('fs');
const path = require('path');

class ProgressTracker {
  constructor() {
    this.progressFile = path.join(__dirname, '..', 'progress.json');
    this.loadProgress();
  }

  loadProgress() {
    try {
      this.progress = JSON.parse(fs.readFileSync(this.progressFile, 'utf8'));
    } catch (error) {
      this.progress = this.initializeProgress();
    }
  }

  initializeProgress() {
    return {
      totalExercises: 4905,
      completed: 0,
      startDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      categories: {
        "01-basic": { total: 600, completed: 0, exercises: [] },
        "02-fundamental-es6-part1": { total: 600, completed: 0, exercises: [] },
        "02-fundamental-es6-part2": { total: 590, completed: 0, exercises: [] },
        "03-functions": { total: 145, completed: 0, exercises: [] },
        "04-recursion": { total: 65, completed: 0, exercises: [] },
        "05-arrays": { total: 265, completed: 0, exercises: [] },
        "06-strings": { total: 315, completed: 0, exercises: [] },
        "07-math": { total: 570, completed: 0, exercises: [] },
        "08-date": { total: 285, completed: 0, exercises: [] },
        "09-conditional-loops": { total: 60, completed: 0, exercises: [] },
        "10-error-handling": { total: 65, completed: 0, exercises: [] },
        "11-async": { total: 45, completed: 0, exercises: [] },
        "12-promises": { total: 100, completed: 0, exercises: [] },
        "13-modules": { total: 100, completed: 0, exercises: [] },
        "14-stack": { total: 175, completed: 0, exercises: [] },
        "15-linked-list": { total: 175, completed: 0, exercises: [] },
        "16-objects": { total: 90, completed: 0, exercises: [] },
        "17-dom": { total: 65, completed: 0, exercises: [] },
        "18-events": { total: 105, completed: 0, exercises: [] },
        "19-drawing": { total: 30, completed: 0, exercises: [] },
        "20-bit-manipulation": { total: 75, completed: 0, exercises: [] },
        "21-regex": { total: 105, completed: 0, exercises: [] },
        "22-validation": { total: 50, completed: 0, exercises: [] }
      }
    };
  }

  markComplete(category, exerciseNumber) {
    if (!this.progress.categories[category]) {
      console.error(`Category ${category} not found`);
      return;
    }

    const exercises = this.progress.categories[category].exercises;
    if (!exercises.includes(exerciseNumber)) {
      exercises.push(exerciseNumber);
      this.progress.categories[category].completed = exercises.length;
      this.progress.completed = Object.values(this.progress.categories)
        .reduce((sum, cat) => sum + cat.completed, 0);
      this.progress.lastUpdated = new Date().toISOString().split('T')[0];
      this.saveProgress();
      console.log(`✅ Completed ${category}/exercise-${exerciseNumber.toString().padStart(3, '0')}`);
    }
  }

  getProgress() {
    const percentage = ((this.progress.completed / this.progress.totalExercises) * 100).toFixed(2);
    console.log(`\n📊 Progress Report`);
    console.log(`Total: ${this.progress.completed}/${this.progress.totalExercises} (${percentage}%)`);
    console.log(`Started: ${this.progress.startDate}`);
    console.log(`Last Updated: ${this.progress.lastUpdated}\n`);

    Object.entries(this.progress.categories).forEach(([cat, data]) => {
      const catPercentage = ((data.completed / data.total) * 100).toFixed(1);
      console.log(`${cat}: ${data.completed}/${data.total} (${catPercentage}%)`);
    });
  }

  saveProgress() {
    fs.writeFileSync(this.progressFile, JSON.stringify(this.progress, null, 2));
  }
}

// CLI usage
if (require.main === module) {
  const tracker = new ProgressTracker();
  const args = process.argv.slice(2);
  
  if (args[0] === 'complete' && args[1] && args[2]) {
    tracker.markComplete(args[1], parseInt(args[2]));
  } else {
    tracker.getProgress();
  }
}

module.exports = ProgressTracker;