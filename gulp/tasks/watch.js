const gulp = require('gulp');
const paths = require('../paths');
const browserSync = require('browser-sync');

// outputs changes to files to the console
function reportChange(event) {
  console.log(`File ${event.path} was ${event.type}, running tasks...`);
}

gulp.task('watch', ['babel', 'babel-test', 'serve', 'run-tests'], () => {
  gulp.watch([paths.src, paths.test], ['babel', 'babel-test', browserSync.reload, 'babel-test']).on('change', reportChange);
});
