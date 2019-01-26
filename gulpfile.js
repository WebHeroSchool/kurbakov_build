const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const env = require('gulp-env');
const gulpif = require('gulp-if');
const clean = require('gulp-clean');

// Env
env({
  file: '.env',
  type: 'ini'
});

// Paths
const paths = {
  src: {
    styles: 'src/css/*.css',
    scripts: 'src/js/*.js'
  },
  dest: {
    styles: './build/css',
    scripts: './build/js'
  },
  names: {
    styles: 'index.min.css',
    scripts: 'index.min.js'
  }
};

// Functions
const styles = () => {
	gulp.src(paths.src.styles)
    .pipe(sourcemaps.init())
      .pipe(concat(paths.names.styles))
      .pipe(gulpif(process.env.NODE_ENV === 'production', cssnano()))
    .pipe(sourcemaps.write())
	  .pipe(gulp.dest(paths.dest.styles));
};
const scripts = () => {
  gulp.src(paths.src.scripts)
    .pipe(sourcemaps.init())
      .pipe(concat(paths.names.scripts))
      .pipe(babel({
        presets: ['@babel/env']
      }))
      .pipe(gulpif(process.env.NODE_ENV === 'production', uglify()))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dest.scripts));
};
const watch = () => {
  gulp.watch(paths.src.styles, styles);
  gulp.watch(paths.src.scripts, scripts);
};

const server = () => {
  browserSync.init({
    server: {
      baseDir: './',
    },
    notify: false
  });
  gulp.watch(paths.src.styles, ['css-watch']);
  gulp.watch(paths.src.scripts, ['js-watch']);
};

const reload = () => browserSync.reload();

const cleaning = () => {
  gulp.src('./build', {read: false})
    .pipe(clean());
};

// Tasks
gulp.task('css', styles);
gulp.task('js', scripts);
gulp.task('css-watch', ['css'], reload);
gulp.task('js-watch', ['js'], reload);
gulp.task('browserSync', server);
gulp.task('build', ['css', 'js']);
gulp.task('clean', cleaning);
gulp.task('default', ['build']);
gulp.task('dev', ['build', 'browserSync']);