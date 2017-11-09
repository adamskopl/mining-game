const gulp = require('gulp');
const paths = require('../paths');
const run = require('gulp-run');

// outputs changes to files to the console
function reportChange(event) {
  console.log(`File ${event.path} was ${event.type}, running tasks...`);
}

// Plans: how to make a proper test running chain? Watching on change of src
// files is wrong: test should be run after finished transpilation.

gulp.task('run-tests', () => {
  return run('node test/run.js | faucet').exec();
});

// watching for src changes. not correct.
gulp.task('test', ['babel-test', 'run-tests'], () => {
  gulp.watch([paths.src, paths.test], ['babel-test', 'run-tests']).on('change', reportChange);
});
