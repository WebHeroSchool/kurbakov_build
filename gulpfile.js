const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');

// Functions
const styles = () => {
	gulp.src('./src/css/*.css')
    .pipe(sourcemaps.init())
      .pipe(concat('index.css'))
      .pipe(cssnano())
    .pipe(sourcemaps.write())
	  .pipe(gulp.dest('./build/css'));
};
const scripts = () => {
  gulp.src('./src/js/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('index.js'))
      .pipe(babel({
        presets: ['@babel/env']
      }))
      .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/js'));
};

// Tasks
gulp.task('css', styles);
gulp.task('js', scripts);

gulp.task('default', ['css', 'js']);
