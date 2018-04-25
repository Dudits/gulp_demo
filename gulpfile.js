// ASSETS

var gulp = require('gulp');
var compass = require('gulp-compass');
var cleanCSS = require('gulp-clean-css');
var babel = require("gulp-babel");
var sourcemaps = require('gulp-sourcemaps');
var concatenate = require('gulp-concat');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var pump = require('pump');


// CONFIGURATION

var config = {
	paths: {
		distribution: {
			css: {
				root: "distribution/css",
				be: "distribution/css/be",
				beFiles: "distribution/css/be/*.css", 
				nle: "distribution/css/nle",
				nleFiles: "distribution/css/nle/*.css"
			},
			js: {
				base: "distribution/js/base",
				component: "distribution/js/component",
				budget: "distribution/js/budget",
				nle: "distribution/js/nle"
			}
		},
		js: {
			transpiled: {
				baseFiles: "js/custom/base/*.js",
				transpiledBase: "js/transpiled/base",
				componentFiles: "js/custom/component/*.js",
				transpiledComponent: "js/transpiled/component",
				beFiles: "js/custom/be/*.js",
				transpiledBe: "js/transpiled/be",
				nleFiles: "js/custom/nle/*.js",
				transpiledNle: "js/transpiled/nle"
			},
			main: {
				distFile: "main.js",
				file1: "js/transpiled/base/1.js", 
				file2: "js/transpiled/base/2.js",
				file3: "js/transpiled/base/3.js"
			}
		},
		scss: {
			config: "config.rb",
			root: "scss",
			files: "scss/**/*.scss",
			images: "images"
		}
	}
}


// STYLES

gulp.task('compass', function() {

	console.log('Running Compass compilation');

	pump([
		gulp.src(config.paths.scss.files),
		compass({
		    config_file: config.paths.scss.config,
		    css: config.paths.distribution.css.root,
		    sass: config.paths.scss.root,
		    image: config.paths.scss.images
	    }),
	    gulp.dest(config.paths.distribution.css.root)
	]);

});

gulp.task('minifyStylesBe', function() {

	console.log('Minifying the BE CSS-files');

	pump([
		gulp.src(config.paths.distribution.css.beFiles),
		cleanCSS(),
		gulp.dest(config.paths.distribution.css.be)
	]);

});

gulp.task('minifyStylesNle', function() {

	console.log('Minifying the NLE CSS-files');

	pump([
		gulp.src(config.paths.distribution.css.nleFiles),
		cleanCSS(),
		gulp.dest(config.paths.distribution.css.nle)
	]);

});


// JAVASCRIPT

gulp.task('transpileJsBase', function() {

	console.log('Transpiling base javascript files');

    pump([
		gulp.src(config.paths.js.transpiled.baseFiles),
		babel({
            presets: ['env']
        }),
		gulp.dest(config.paths.js.transpiled.transpiledBase)
	]);

});

gulp.task('transpileJsComponent', function() {

	console.log('Transpiling component javascript files');

    pump([
		gulp.src(config.paths.js.transpiled.componentFiles),
		babel({
            presets: ['env']
        }),
		gulp.dest(config.paths.js.transpiled.transpiledComponent)
	]);

});

gulp.task('transpileJsBe', function() {

	console.log('Transpiling BE javascript files');

	pump([
		gulp.src(config.paths.js.transpiled.beFiles),
		babel({
            presets: ['env']
        }),
		gulp.dest(config.paths.js.transpiled.transpiledBe)
	]);

});

gulp.task('transpileJsNle', function() {

	console.log('Transpiling NLE javascript files');

	pump([
		gulp.src(config.paths.js.transpiled.nleFiles),
		babel({
            presets: ['env']
        }),
		gulp.dest(config.paths.js.transpiled.transpiledNle)
	]);

});

gulp.task('distributeMain', function() {

	console.log('Distributing the ' + config.paths.js.main.distFile + ' file');

	pump([
		gulp.src([
			config.paths.js.main.file1, 
			config.paths.js.main.file2,
			config.paths.js.main.file3
		]),
		sourcemaps.init(),
		concatenate(config.paths.js.main.distFile),
		uglify(),
		sourcemaps.write(),
		gulp.dest(config.paths.distribution.js.base)
	]);		

});

// WATCHERS

gulp.task('watch', function() {

	// CSS
	gulp.watch(config.paths.scss.files, ['compass']);
	gulp.watch(config.paths.distribution.css.beFiles, ['minifyStylesBe']);
	gulp.watch(config.paths.distribution.css.nleFiles, ['minifyStylesNle']);

	// JS
	gulp.watch(config.paths.js.transpiled.baseFiles, ['transpileJsBase']);
	gulp.watch(config.paths.js.transpiled.componentFiles, ['transpileJsComponent']);
	gulp.watch(config.paths.js.transpiled.beFiles, ['transpileJsBe']);
	gulp.watch(config.paths.js.transpiled.nleFiles, ['transpileJsNle']);
	gulp.watch([
		config.paths.js.main.file1, 
		config.paths.js.main.file2,
		config.paths.js.main.file3
	], ['distributeMain']);

});

// DEFAULT

gulp.task('default', [
	'compass', 
	'minifyStylesBe', 
	'minifyStylesNle', 
	'transpileJsBase', 
	'transpileJsComponent', 
	'transpileJsBe', 
	'transpileJsNle',
	'distributeMain'
]);
