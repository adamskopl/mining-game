const gulp = require('gulp');
const paths = require('../paths');
const run = require('gulp-run');

// outputs changes to files to the console
function reportChange(event) {
  console.log(`File ${event.path} was ${event.type}, running tasks...`);
}

gulp.task('run-tests', () => {
  return run('node test/run.js | faucet').exec();
});

gulp.task('test', ['babel-test', 'run-tests'], () => {
  gulp.watch([paths.src, paths.test], ['babel-test', 'run-tests']).on('change', reportChange);
});
