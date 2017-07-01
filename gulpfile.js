var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	minifyCSS = require('gulp-minify-css'),
	plumber = require('gulp-plumber'),
	imagemin = require('gulp-imagemin'),
	inline = require('gulp-inline'),
	minifyHTML = require('gulp-minify-html'),
	pngquant = require('imagemin-pngquant'),
	imageminJpegRecompress = require('imagemin-jpeg-recompress'),
	imageminWebp = require('imagemin-webp');

// Paths to various files
var paths = {
    scripts: ['dev/js/*.js'],
    styles: ['dev/css/*.css'],
    images: ['dev/img/*'],
    content: ['dev/index.html', 'dev/project-2048.html', 
    	'dev/project-mobile.html', 'dev/project-webperf.html'],
    pizzaScripts: ['dev/views/js/*.js'],
    pizzaStyles: ['dev/views/css/*.css'],
    pizzaImages: ['dev/views/images/*'],
    pizzaContent: ['dev/views/pizza.html']
};


/* Optimizes our pizza image files and outputs them to prod/image/ */
gulp.task('pizzaImg', function() {
    return gulp.src(paths.pizzaImages)
 		.pipe(imagemin({
			progressive: false,
			optimizationLevel: 7,
			use: [pngquant({quality: '65-80', speed: 6})],
			use: [imageminWebp({quality: 70})]
		}))
		.pipe(gulp.dest('prod/views/images/'));
            
});


/* Minifies our Pizza HTML files and outputs them to prod/*.html */
gulp.task('pizzaHTML', function() {
    return gulp.src(paths.pizzaContent)
        .pipe(inline({
    	base: paths.pizzaContent,
    	js: uglify,
    	css: minifyCSS,
    	disabledTypes: ['svg', 'img']
        }))
        .pipe(minifyHTML({ empty: true }))
		.pipe(gulp.dest('prod/views/'));
});


/* Minifies our JS files and outputs them to prod/views/js */
gulp.task('scripts', function(){
	/*look for any file that has javascript & css in filename*/
	gulp.src(paths.scripts)
		/* still run watch task even if error in code */
		.pipe(plumber())
		/* minify the file */
		.pipe(uglify())
		/* rename the file */
		.pipe(rename('perfmatters.min.js'))
		.pipe(plumber.stop())
		/*save destination for minified file*/
		.pipe(gulp.dest('prod/js/'));
});

/* Minifies our Pizza JS files and outputs them to prod/views/js */
gulp.task('pizzaJS', function(){
	/*look for any file that has javascript & css in filename*/
	gulp.src(paths.pizzaScripts)
		/* still run watch task even if error in code */
		.pipe(plumber())
		/*minify the file*/
		.pipe(uglify())
		/*rename the file*/
		.pipe(rename('main.min.js'))
		.pipe(plumber.stop())
		/*save destination for minified file*/
		.pipe(gulp.dest('prod/views/js/'));
});

/* Minifies our HTML files and outputs them to prod/*.html */
gulp.task('content', function() {
	return gulp.src(paths.content)
    	.pipe(inline({
    	base: paths.content,
    	js: uglify,
    	css: minifyCSS,
    	disabledTypes: ['svg', 'img'],
    	ignore: ['dev/js/perfmatters.js', 'http://www.google-analytics.com/analytics.js']
        }))
        .pipe(minifyHTML({ empty: true }))
		.pipe(gulp.dest('prod/'));
});

/* Minifies CSS files */
gulp.task('styles', function (){
	gulp.src(paths.styles)
		.pipe(minifyCSS())
		.pipe(gulp.dest('prod/css/'));

});

/* Minifies Pizza CSS files */
gulp.task('pizzaCSS', function (){
	gulp.src(paths.pizzaStyles)
		.pipe(minifyCSS())
		.pipe(gulp.dest('prod/views/css/'));

});

/* Optimizes our portfolio image files and outputs them to prod/image/ */
gulp.task('images', function() {
    return gulp.src(paths.images)
 		.pipe(imagemin({
 			progressive: false,
			optimizationLevel: 7,
			use: [pngquant({quality: '65-80', speed: 6})],
			use: [imageminWebp({quality: 70})]
		}))
		.pipe(gulp.dest('prod/img/'));
            
});


/* run gulp tasks in background when changes are made to file */
gulp.task('watch', function(){
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.styles, ['styles']);
	gulp.watch(paths.content, ['content']);
	gulp.watch(paths.pizzaScripts, ['pizzaJS']);
	gulp.watch(paths.pizzaStyles, ['pizzaCSS']);
	gulp.watch(paths.pizzaContent ['pizzaCSS']);
});

gulp.task('default', ['scripts', 'styles', 
	'content', 'images', 'pizzaImg', 'pizzaCSS',
	'pizzaHTML', 'pizzaJS', 'watch']);