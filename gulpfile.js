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
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const nested = require('postcss-nested');
const short = require('postcss-short');
const assets = require('postcss-assets');
const postcssPresetEnv = require('postcss-preset-env');
const handlebars = require('gulp-compile-handlebars');
const glob = require('glob');
const rename = require('gulp-rename');
const eslint = require('gulp-eslint');
const stylelint = require('stylelint');
const reporter = require('postcss-reporter');

// Data
const user = require('./src/templates/data/user.json');

// Lint
const rulesStyles = require('./.stylelintrc.json');
const rulesScripts = require('./.eslintrc.json');

// Env
env({
  file: '.env',
  type: 'ini'
});

// Paths
const paths = {
  src: {
    dir: 'src',
    styles: './src/css/*.css',
    scripts: './src/js/*.js'
  },
  dest: {
    dir: 'build',
    styles: './build/css',
    scripts: './build/js'
  },
  names: {
    styles: 'index.min.css',
    scripts: 'index.min.js'
  },
  templates: 'src/templates/**/*.hbs',
  lint: {
    styles: ['**/*.css', '!node_modules/**/*', '!build/**/*'],
    scripts: ['**/*.js', '!node_modules/**/*', '!build/**/*']
  }
};

// Functions
const styles = () => {
  const plugins = [
    autoprefixer({browsers: ['last 2 versions']}),
    nested(),
    short(),
    assets({
      loadPaths: ['src/images/'],
      relativeTo: 'src/css/'
    }),
    postcssPresetEnv({
      importFrom: './src/css/main.css'
    })
  ];

  return gulp.src(paths.src.styles)
    .pipe(sourcemaps.init())
    .pipe(postcss(plugins))
    .pipe(concat(paths.names.styles))
    .pipe(gulpif(process.env.NODE_ENV === 'production', cssnano()))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dest.styles));
};
const scripts = () => {
  return gulp.src(paths.src.scripts)
    .pipe(sourcemaps.init())
    .pipe(concat(paths.names.scripts))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulpif(process.env.NODE_ENV === 'production', uglify()))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dest.scripts));
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

const compile = () => {
  glob(paths.templates, (err, files) => {
    if (!err) {
      const options = {
        ignorePartials: true,
        batch: files.map(item => item.slice(0, item.lastIndexOf('/'))),
        helpers: {
          upper: word => `${word.slice(0, -1)}${word[word.length - 1].toUpperCase()}`,
          expo: (num, exp) => num ** exp 
        }
      };
      return gulp.src(`${paths.src.dir}/templates/index.hbs`)
        .pipe(handlebars(user, options))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('build'));
    }
  });
};

const jslint = () => {
  return gulp.src(paths.lint.scripts)
    .pipe(eslint(rulesScripts))
    .pipe(eslint.format())
};

const csslint = () => {
  return gulp.src(paths.lint.styles)
    .pipe(postcss([
      stylelint(rulesStyles),
      reporter({
        clearMessages: true,
        throwError: false
      })
    ]));
};

// Tasks
gulp.task('css', styles);
gulp.task('js', scripts);
gulp.task('compile', compile);
gulp.task('eslint', jslint);
gulp.task('stylelint', csslint);
gulp.task('lint', ['eslint', 'stylelint']);
gulp.task('css-watch', ['css'], reload);
gulp.task('js-watch', ['js'], reload);
gulp.task('browserSync', server);
gulp.task('build', ['css', 'js', 'compile']);
gulp.task('clean', cleaning);
gulp.task('default', ['build']);
gulp.task('dev', ['build', 'browserSync']);
