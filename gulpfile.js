const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');

// Functions
const styles = () => {
	gulp.src('./src/css/*.css')
    .pipe(concat('index.css'))
    .pipe(cssnano())
	  .pipe(gulp.dest('./build/css'));
};
const scripts = () => {
  gulp.src('./src/js/*.js')
    .pipe(concat('index.js'))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
};

// Tasks
gulp.task('css', styles);
gulp.task('js', scripts);

gulp.task('build', ['css', 'js']);
