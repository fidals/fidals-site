// ================================================================
// REQUIRES
// ================================================================
var gulp = require('gulp'),
  jade = require('gulp-jade'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  combineMedia = require('gulp-combine-mq'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  minifyCSS = require('gulp-cssnano'),
  rename = require('gulp-rename'),
  plumber = require('gulp-plumber'),
  connect = require('gulp-connect'),
  marked = require('jstransformer')(require('jstransformer-marked')),
  del = require('del'),
  es = require('event-stream'),
  sequence = require('run-sequence');

// ================================================================
// PATHS
// ================================================================
var htmlFile = 'index',
//var	htmlFile    = 'index',
  imgSrcFolder = './src/images/**/*',
  imgDistFolder = './dist/images',

  src_html_folder = './src/',
  src_js_folder = './src/js/',
  dist_html_folder = './dist/pages/',
  jade_file = src_html_folder + htmlFile + '.jade';

var sassCommon = [
  './src/scss/common/styles.scss',
];

var sassPages = [
  './src/scss/pages/blog.scss',
  './src/scss/pages/contacts.scss',
  './src/scss/pages/portfolio.scss',
];

// ================================================================
// BUILD
// ================================================================
gulp.task('build', function(callback) {
  sequence(
    'clean',
    'jade-build',
    'sass',
    'fonts-build',
    'img-build',
    'js-build',
    callback
  );
});

// ================================================================
// CLEAN
// ================================================================
gulp.task('clean', function() {
  return del([
    'dist/**/*'
  ]);
});

// ================================================================
// HTML : build
// ================================================================
gulp.task('jade-build', function() {
  return es.concat(
    // Index page
    gulp.src('./src/index.jade')
      .pipe(jade({pretty: true}))
      .pipe(gulp.dest('./dist/')),

    // Static pages
    gulp.src(['./src/pages/*.jade'])
      .pipe(jade({pretty: true}))
      .pipe(gulp.dest('./dist/pages')),

    // Blog pages
    gulp.src(['./src/blog/*.jade'])
      .pipe(jade({pretty: true}))
      .pipe(gulp.dest('./dist/blog'))
  );
});

// ================================================================
// SASS : build
// ================================================================
gulp.task('sass', function() {
  return es.concat(
    gulp.src(sassCommon)
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(combineMedia({
        beautify: false
      }))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(minifyCSS())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./dist/css')),

    gulp.src(sassPages)
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(concat('pages.css'))
      .pipe(combineMedia({
        beautify: false
      }))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(minifyCSS())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./dist/css'))
  )
});

// ================================================================
// Fonts : build
// ================================================================
gulp.task('fonts-build', function() {
  gulp.src('./src/scss/fonts/**/*')
    .pipe(gulp.dest('./dist/css/fonts'));
});

// ================================================================
// JS : build
// ================================================================
gulp.task('js-build', function() {
  return es.concat(
    // Copy all js files
    gulp.src('./src/js/**/*')
      .pipe(gulp.dest('./dist/js')),

    // Vendors js for main page
    gulp.src([
      './src/js/libs/jquery-2.2.0.min.js',
      './src/js/libs/jquery.mmenu.min.all.js'
    ])
      .pipe(concat('vendor.js'))

      .pipe(gulp.dest('dist/js/libs'))

      .pipe(rename({
        suffix: '.min'
      }))

      .pipe(uglify())

      .pipe(sourcemaps.write('./'))

      .pipe(gulp.dest('dist/js/libs')),

    // main.min.js
    gulp.src('./src/js/common/main.js')
      .pipe(concat('main.js'))

      .pipe(gulp.dest('dist/js/common'))

      .pipe(rename({
        suffix: '.min'
      }))

      .pipe(uglify())

      .pipe(sourcemaps.write('./'))

      .pipe(gulp.dest('dist/js/common'))
  );
});

// ================================================================
// Images : build
// ================================================================
gulp.task('img-build', function() {
  return gulp.src(imgSrcFolder)
    .pipe(gulp.dest(imgDistFolder));
});

// ================================================================
// HTML : Compiles current jade file
// ================================================================
gulp.task('jade', function() {
  gulp.src(jade_file)
    .pipe(plumber())

    .pipe(jade({pretty: true}))

    .pipe(gulp.dest(dist_html_folder))

    .pipe(connect.reload());
});

// ================================================================
// JS : Compiles current stylesheet
// ================================================================
gulp.task('js', function() {
  return gulp.src('./src/js/**/*')
    .pipe(gulp.dest('./dist/js'));
});

// ================================================================
// LiveReload
// ================================================================
gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

// ================================================================
// WATCH
// ================================================================
gulp.task('watch', function() {
  gulp.watch(jade_file, ['jade']);
  gulp.watch([sassCommon, sassPages], ['sass']);
  gulp.watch(src_js_folder + '**/*', ['js']);
});

// ================================================================
// DEFAULT
// ================================================================
gulp.task('default', ['watch', 'connect']);
