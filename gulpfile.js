'use strict';

// Plugin definition
var del = require('del');
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
// Other plugins with not a 'gulp-***' names
var imageminPngquant = require('imagemin-pngquant');
var runSequence = require('run-sequence');

// Kit name definition
var kitPrefix = 'sst-',
    iconFontName = kitPrefix+'icons';

// Paths definition
var srcDir = './kit-src',
    buildDir = './build',
    pubDir = './www',
    path = {
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

// Icon font glyphs will be saved here
var _glyphs = {};

//--------------------------------------------------------------
//    TASKS
//--------------------------------------------------------------

// Compile Icon Font
gulp.task('compile:font', function(){
    return gulp.src([
        path.src.icons + '/*.svg'
    ])
    .pipe(plugins.iconfont({
        fontName: iconFontName,
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
    // Glyphs for Stylus iconfont CSS part creation
    .on('glyphs', function(glyphs, options) {
        // Modifying glyph names and codes to CSS format
        glyphs.forEach(function(glyph) {
            glyph.name = glyph.name.replace(/^[0-9\-]+/g, ""); // Replace digits from names
            glyph.name = glyph.name.replace(/__/g, "-"); // Replace "__" with "-" in names
            glyph.name = glyph.name.replace(/--/g, "-"); // Replace "--" with "-" in names
            glyph.unicode = glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase(); // Transform Unicode to ASCII code
        });
        _glyphs = glyphs;
    })
    .pipe(gulp.dest(path.out.fonts));
});

// Compile CSS
gulp.task('compile:css', function () {
    // console.log(_glyphs);
    return gulp.src(srcDir + '/toolkit.styl')
        .pipe(plugins.stylus({
            // Sending IconFont glyphs to Stylus
            define: {
                $fontName: iconFontName,
                $fontPath: '../fonts/',
                $iconClass : 'icon',
                $glyphs: _glyphs
            },
            'include css': true,
            'prefix' : kitPrefix // Toolkit prefix for all CSS classes
        }))
        .pipe(plugins.autoprefixer({
            // Adds vendor CSS prefixes according to www.Caniuse.com
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
        }))
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
        path.out.js + '/*.js'
    ])
        .pipe(plugins.uglify({
            mangle: true
        }))
        .pipe(plugins.rename({suffix: '.min'}))
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
        ['compile:font'], // 2
        ['compile:css', 'compile:js'], // 3
        ['minify:css', 'minify:js'], // 4
        ['copy'] // 5
    );
});


// Watcher
gulp.task('default', ['compile:font'], function () {
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
