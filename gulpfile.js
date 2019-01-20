const gulp = require('gulp');

// Functions
const styles = () => {
	return gulp.src('./src/css/*.css')
	  .pipe(gulp.dest('./build/styles'));
};
const scripts = () => {
  return gulp.src('./src/js/*.js')
    .pipe(gulp.dest('./build/scripts'));
};

// Tasks
gulp.task('styles', styles);
gulp.task('scripts', scripts);

gulp.task('build', ['styles', 'scripts']);