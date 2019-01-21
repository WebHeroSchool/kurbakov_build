const gulp = require('gulp');
const babel = require('gulp-babel');

// Functions
const styles = () => {
	gulp.src('./src/css/*.css')
	  .pipe(gulp.dest('./build/css'));
};
const scripts = () => {
  gulp.src('./src/js/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('./build/js'));
};

// Tasks
gulp.task('css', styles);
gulp.task('js', scripts);

gulp.task('build', ['css', 'js']);
