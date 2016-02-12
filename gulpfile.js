// ================================================================
// REQUIRES
// ================================================================
var gulp		 = require('gulp'),
	jade		 = require('gulp-jade'),
	sass		 = require('gulp-sass'),
	sourcemaps   = require('gulp-sourcemaps'),
	combineMedia = require('gulp-combine-mq'),
	concat       = require('gulp-concat'),
	uglify       = require('gulp-uglify'),
	rename	     = require('gulp-rename'),
	minifyCSS	 = require('gulp-cssnano'),
	plumber	     = require('gulp-plumber'),
	//spritePNG	 = require('gulp.spritesmith'),
	connect	     = require('gulp-connect'),
	marked       = require('marked'),
	del          = require('del'),
	es           = require('event-stream'),
	sequence	 = require('run-sequence');

// ================================================================
// PATHS
// ================================================================
var htmlFile    = 'contacts',
//var	htmlFile    = 'index',
	styleFile	= 'common/styles',
	//styleFile	= 'pages/blog',
	img_folder	= './dist/images/',

	src_sass_folder  = './src/scss/',
	src_html_folder  = './src/pages/',
	src_js_folder	 = './src/js/',
	dist_css_folder  = './dist/css/',
	dist_html_folder = './dist/pages/',

	jade_file = src_html_folder + htmlFile  + '.jade',
	sass_file = src_sass_folder + styleFile + '.scss';

// ================================================================
// BUILD
// ================================================================
gulp.task('build', function(callback) {
	sequence(
		'clean',
		'jade-build',
		'sass-build',
		'fonts-build',
		'css-build',
		'img-build',
		'js-build',
		callback
	);
});

// ================================================================
// CLEAN
// ================================================================
gulp.task('clean', function () {
	return del([
		// here we use a globbing pattern to match everything inside the `mobile` folder
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
			.pipe( jade({ pretty : true }) )
			.pipe( gulp.dest('./dist/') ),

		// Static pages
		gulp.src([ './src/pages/*.jade' ])
			.pipe( jade({ pretty : true }) )
			.pipe( gulp.dest( './dist/pages' ) ),

		// Blog pages
		gulp.src([ './src/blog/*.md' ])
			.pipe( jade({ pretty : true }) )
			.pipe( gulp.dest( './dist/blog' ) )
	);
});

// ================================================================
// SASS : build
// ================================================================
gulp.task('sass-build', function() {
	gulp.src([
			'./src/scss/pages/blog.scss',
			'./src/scss/pages/contacts.scss',
			'./src/scss/pages/portfolio.scss'
		])
		.pipe( sourcemaps.init() )
		.pipe( sass() )
		.pipe( sourcemaps.write('.') )
		.pipe( gulp.dest('./dist/css')
	);
});

// ================================================================
// Fonts : build
// ================================================================
gulp.task('fonts-build', function() {
	gulp.src([
			'./src/scss/fonts/**/*'
		])

		.pipe( gulp.dest('./dist/css/fonts')
	);
});

// ================================================================
// CSS : build
// ================================================================
gulp.task('css-build', function() {
	// Main styles file minification
	gulp.src('./src/scss/common/styles.scss')
		.pipe( sass() )

		.pipe( combineMedia({
			beautify: false
		}) )

		.pipe( rename({
			suffix: '.min'
		}) )

		.pipe( minifyCSS() )

		.pipe( gulp.dest('./dist/css') );
});

// ================================================================
// JS : build
// ================================================================
gulp.task('js-build', function() {
	return es.concat(
		// Copy all js files
		gulp.src('./src/js/**/*')
			.pipe( gulp.dest( './dist/js' ) ),

		// Vendors js for main page
		gulp.src([
				'./src/js/libs/jquery-2.2.0.min.js',
				'./src/js/libs/jquery.mmenu.min.all.js'
			])
			.pipe( concat('vendor.js') )

			.pipe( gulp.dest('dist/js/libs') )

			.pipe( rename({
				suffix: '.min'
			}))

			.pipe( uglify() )

			.pipe( sourcemaps.write('./') )

			.pipe( gulp.dest('dist/js/libs') ),

		// main.min.js
		gulp.src('./src/js/common/main.js')
			.pipe( concat('main.js') )

			.pipe( gulp.dest('dist/js/common') )

			.pipe( rename({
				suffix: '.min'
			}))

			.pipe( uglify() )

			.pipe( sourcemaps.write('./') )

			.pipe( gulp.dest('dist/js/common') )
	);
});

// ================================================================
// Images : build
// ================================================================
gulp.task('img-build', function() {
	return gulp.src( './src/images/**/*' )
		.pipe( gulp.dest( './dist/images' ) );
});

// ================================================================
// HTML : Compiles current jade file
// ================================================================
gulp.task('jade', function() {
	gulp.src( jade_file )
		.pipe( plumber() )

		.pipe( jade({ pretty : true }))

		.pipe( gulp.dest( dist_html_folder ) )

		.pipe( connect.reload() );
});

// ================================================================
// SASS : Compiles current stylesheet
// ================================================================
gulp.task('sass', function () {
	gulp.src( sass_file )
		.pipe( sourcemaps.init() )

		.pipe( plumber() )

		.pipe( sass() )

		.pipe( sourcemaps.write('.') )

		.pipe( gulp.dest( dist_css_folder ) )

		.pipe( connect.reload() );
});

// ================================================================
// JS : Compiles current stylesheet
// ================================================================
gulp.task('js', function() {
	return gulp.src( './src/js/**/*' )
		.pipe( gulp.dest( './dist/js' ) );
});

// ================================================================
// Sprite : Retina
// ================================================================
gulp.task('retina', function() {
	var sprite_name = 'socials';

	gulp.src( img_folder + 'sprite_source/' + sprite_name + '/*.png' )

	.pipe( spritePNG({
		imgName : 'sprite-' + sprite_name + '.png',
		cssName : '../../' + src_sass_folder + 'framework/mixins/_sprite-' + sprite_name + '.scss',
		padding : 1,
		retinaSrcFilter : [ img_folder + 'sprite_source/' + sprite_name + '/*-2x.png' ],
		retinaImgName   : 'sprite-' + sprite_name + '-2x.png'
	}) )

	.pipe( gulp.dest( img_folder ) );
});

// ================================================================
// Sprite : PNG
// ================================================================
gulp.task('png', function() {
	var sprite_name = 'socials';

	gulp.src( img_folder + 'sprite_source/*.png' )

	.pipe( spritePNG({
		imgName   : 'sprite-' + sprite_name + '.png',
		cssName   : '../../' + src_sass_folder + 'framework/mixins/_sprite-' + sprite_name + '.scss',
		cssFormat : 'scss',
		padding   : 1
	}) )

	.pipe( gulp.dest( img_folder ) );
});

// ================================================================
// LiveReload
// ================================================================
gulp.task('connect', function() {
	connect.server({
		root	   : 'dist',
		livereload : true
	});
});

// ================================================================
// WATCH
// ================================================================
gulp.task('watch', function() {
	gulp.watch( jade_file, ['jade'] );
	gulp.watch( sass_file, ['sass'] );
	gulp.watch( src_js_folder + '**/*', ['js'] );
});

// ================================================================
// DEFAULT
// ================================================================
gulp.task( 'default', ['watch', 'connect'] );