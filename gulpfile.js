// ================================================================
// REQUIRES
// ================================================================
var gulp         = require('gulp'),
	jade         = require('gulp-jade'),
	sass         = require('gulp-sass'),
	clean        = require('gulp-clean');
	chmod        = require('gulp-chmod');
	sourcemaps   = require('gulp-sourcemaps'),
	combineMedia = require('gulp-combine-mq'),
	rename       = require('gulp-rename'),
	minifyCSS    = require('gulp-minify-css'),
	plumber      = require('gulp-plumber'),
	sequence     = require('run-sequence'),
	spritePNG    = require('gulp.spritesmith'),
	connect      = require('gulp-connect');

// ================================================================
// PATHS
// ================================================================
var htmlFile         = 'contacts',
//var	htmlFile         = 'index',
	styleFile        = 'common/styles',
//	styleFile        = 'pages/blog',
	img_folder       = './dist/images/',

	src_sass_folder  = './src/scss/',
	dist_css_folder  = './dist/css/',
	src_html_folder  = './src/',
	dist_html_folder = './dist',
	src_js_folder    = './src/js/',

	jade_file        = src_html_folder + htmlFile  + '.jade',
	sass_file        = src_sass_folder + styleFile + '.scss',
	css_file         = dist_css_folder + styleFile + '.css';

// ================================================================
// BUILD
// ================================================================
gulp.task('build', function(callback) {
	sequence(
		'clean',
		'jade-build',
		'sass-build',
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
    return gulp.src([
    		'./dist/*.html',
    		'./dist/css/*.css',
    		'./dist/js/**/*.js',
    		'./dist/images/**/*'
		], {
    		read : false
    	})
        .pipe( clean() );
});

// ================================================================
// HTML : build
// ================================================================
gulp.task('jade-build', function() {
	gulp.src([
			'./src/index.jade',
			'./src/blog.jade',
			'./src/blog-inner.jade',
			'./src/contacts.jade',
			'./src/projects.jade'
		])
		.pipe( jade({
			pretty : true
		}) )

		.pipe( gulp.dest( dist_html_folder ) );
});

// ================================================================
// SASS : build
// ================================================================
gulp.task('sass-build', function() {
	return gulp.src([
			'./src/scss/common/styles.scss',
			'./src/scss/pages/blog.scss',
			'./src/scss/pages/contacts.scss',
			'./src/scss/pages/portfolio.scss'
		])
		.pipe( sourcemaps.init() )
		.pipe( sass() )
		.pipe( sourcemaps.write('.') )
		.pipe( gulp.dest('./dist/css') );
});

// ================================================================
// CSS : build
// ================================================================
gulp.task('css-build', function() {
	return gulp.src('./dist/css/*.css')
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
	return gulp.src( './src/js/**/*' )
		.pipe( chmod(772) )

		.pipe( gulp.dest( './dist/js' ) );
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

		.pipe( jade({
			pretty : true
		}))

		.pipe( gulp.dest( dist_html_folder ) )

		.pipe( connect.reload() );
});

// ================================================================
// STYLES : Compiles current stylesheet
// ================================================================
gulp.task('styles', function(callback) {
	sequence( 'sass', 'css', callback );
});

// ================================================================
// SASS
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
// CSS
// ================================================================
gulp.task('css', function() {
	return gulp.src( css_file )
		.pipe( combineMedia({
			log: true
		}) )

		.pipe( rename({
			suffix: '.min'
		}) )

		.pipe( minifyCSS() )

		.pipe( gulp.dest( dist_css_folder ) );
});

// ================================================================
// JS
// ================================================================
gulp.task('js', function() {
	return gulp.src( './src/js/**/*' )
		.pipe( chmod(772) )

		.pipe( gulp.dest( './dist/js' ) );
});

// ================================================================
// Sprite : Retina
// ================================================================
gulp.task('retina', function() {
	var sprite_name = 'socials';

	gulp.src( img_folder + 'sprite_source/' + sprite_name + '/*.png' )

	.pipe( spritePNG({
		imgName         : 'sprite-' + sprite_name + '.png',
		cssName         : '../../' + src_sass_folder + 'framework/mixins/_sprite-' + sprite_name + '.scss',
		padding         : 1,
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
    	root       : 'dist',
        livereload : true
    });
});

// ================================================================
// WATCH
// ================================================================
gulp.task('watch', function() {
	gulp.watch( jade_file, ['jade'] );
	gulp.watch( sass_file, ['styles'] );
	gulp.watch( src_js_folder + '**/*', ['js'] );
});

// ================================================================
// DEFAULT
// ================================================================
gulp.task( 'default', ['watch', 'connect'] );