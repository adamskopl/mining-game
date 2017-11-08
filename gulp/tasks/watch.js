const gulp = require('gulp');
const paths = require('../paths');
const browserSync = require('browser-sync');

// outputs changes to files to the console
function reportChange(event) {
  console.log(`File ${event.path} was ${event.type}, running tasks...`);
}

gulp.task('watch', ['babel', 'babel-test', 'serve'], () => {
  gulp.watch(paths.src, ['babel', browserSync.reload]).on('change', reportChange);
  gulp.watch(paths.test, ['babel-test', browserSync.reload]).on('change', reportChange);
});
