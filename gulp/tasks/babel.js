const gulp = require('gulp');
const paths = require('../paths');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');

gulp.task('babel', () => {
  return gulp.src(paths.src)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.distSrc));
});

gulp.task('babel-test', () => {
  return gulp.src(paths.test)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.distTest));
});
