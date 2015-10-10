'use strict';

var srcDir = './kit-src',
    buildDir = './build',
    pubDir = './www',
    kitPrefix = 'sst-',

    // Plugin definition
    del = require('del'),
    gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),
    imageminPngquant = require('imagemin-pngquant'),
    runSequence = require('run-sequence');

var path = {
    src: { // Sources
        js: srcDir + '/js',
        css: srcDir + '/css',
        img: srcDir + '/img',
        icons: srcDir + '/icons',
        fonts: srcDir + '/fonts'
    },
	
    vendor: { // Vendor dependant sources
        js: srcDir + '/js/vendor',
        css: srcDir + '/css/vendor'
    },
	
    out: { // Output path
        js: buildDir + '/js',
        css: buildDir + '/css',
        img: buildDir + '/images',
        fonts: buildDir + '/fonts'
    }
};

//--------------------------------------------------------------
//    TASKS
//--------------------------------------------------------------

// Compile CSS
gulp.task('compile:css', function () {
    return gulp.src(srcDir + '/toolkit.styl')
        .pipe(plugins.stylus({ // Compiles Stylus
            'include css': true,
            'prefix' : kitPrefix // Adding prefix to all CSS classes
        }))
        .pipe(plugins.autoprefixer({ // Adding CSS vendor prefixes according to www.Caniuse.com
                browsers: [
                    '> 1%',
                    'last 2 versions',
                    'firefox >= 4',
                    'safari 7',
                    'safari 8',
                    'IE 8',
                    'IE 9',
                    'IE 10',
                    'IE 11'
                ], cascade: false
            })
        )
        .pipe(plugins.rename({prefix: kitPrefix}))
        .pipe(gulp.dest(path.out.css))
        .pipe(plugins.livereload());
});

/*
    // Now disabled as useless because of @imports in toolkit.styl
    // Concatenate CSS
    gulp.task('concat:css', function () {
        return gulp.src(path.out.css + '/!*.css')
            .pipe(plugins.concat('toolkit.css'))
            .pipe(plugins.rename({prefix: kitPrefix}))
            .pipe(gulp.dest(pubDir));
    });
*/

// Minify CSS
gulp.task('minify:css', function () {
    return gulp.src([
        path.out.css + '/*.css',
        '!' + path.out.css + '/*.min.css',
        '!' + path.out.css + '/*-min.css'
    ])
        .pipe(plugins.minifyCss())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest(path.out.css));
});

// Compile Icons Font
gulp.task('compile:font', function(){
	return gulp.src([
		path.src.icons + '/*.svg'
	])
	.pipe(plugins.iconfontCss({
		fontName: 'SST Icons',
		path: path.src.icons + '/sst-icons.css',
		targetPath: '../css/sst-icons.css',
		fontPath: '../fonts/',
		cssClass: kitPrefix + 'icon'
	}))
	.pipe(plugins.iconfont({
		fontName: 'SST Icons',
		appendUnicode: true,
		fontWeight: 'normal',
		fontStyle: 'normal',
		//fixedWidth: '20',
		fontHeight: '500',
		round: 100,
		descent: 75,
		normalize: true,
		centerHorizontally: true,
		formats: ['ttf', 'eot', 'woff', 'woff2', 'svg']
	}))
	.pipe(gulp.dest(path.out.fonts));
});

// Compile JS
gulp.task('compile:js', function () {
    return gulp.src([
        path.src.js + '/*.js'
    ])
        .pipe(plugins.concat('toolkit.js'))
        .pipe(plugins.rename({prefix: kitPrefix}))
        .pipe(gulp.dest(path.out.js))
        .pipe(plugins.livereload());
});

// Minify JS
gulp.task('minify:js', function () {
    return gulp.src([
        path.out.js + '/common.js',
        path.out.js + '/vendor.js'
    ])
        .pipe(plugins.uglify())
        .pipe(plugins.rename({suffix: '.min'}))
        //.pipe(plugins.convertEncoding({to: 'cp1251'}))
        .pipe(gulp.dest(path.out.js));
});

// Minify pictures
gulp.task('minify:images', function () {
    return gulp.src(path.src.img + '/**/*.{jpg,gif,png}')
        .pipe(plugins.imagemin({
            progressive: true,
            use: [imageminPngquant({quality: '65-80', speed: 4})]
        }))
        .pipe(gulp.dest(path.out.img));
});

// Clean
gulp.task('clean', function () {
    return del([ buildDir ]);
});

// Copy to WWW
gulp.task('copy', function(){
    return gulp.src( buildDir + '/**/*' )
        .pipe(gulp.dest( pubDir ));
        //.pipe(plugins.notify("Copying to /www... <%= file.path %>"));
});

// Builder
gulp.task('build', function () {
    // runSequence позволяет запускать задачи по порядку
    runSequence(
        ['clean'], // 1
        ['compile:font'], // 2.0
        ['compile:css', 'compile:js'], // 2.1
        ['minify:css', 'minify:js'], // 3
        ['copy'] // 4
    );
});


// Watcher
gulp.task('watch', function () {

    // Notifies Livereload to reload browser if above tasks being runned
    plugins.livereload.listen();
	
    // CSS watcher
    gulp.watch([
		path.src.css + '/*.styl',
		path.src.css + '/*.css'
    ],  function () {
        runSequence(
            ['compile:css'],
            ['minify:css'],
            ['copy']
        );
    });

    // JS watcher
    gulp.watch(path.src.js + '/*.js', function () {
        runSequence(
            ['compile:js'],
            ['minify:js'],
            ['copy']
        );
    });

});
