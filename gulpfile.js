'use strict';

var srcDir = './src',
    pubDir = './public',
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
        fonts: srcDir + '/fonts'
    },
    vendor: { // Vendor dependant sources
        js: srcDir + '/js/vendor',
        css: srcDir + '/css/vendor'
    },

    out: { // Output path
        js: pubDir + '/js',
        css: pubDir + '/css',
        img: pubDir + '/images',
        fonts: pubDir + '/fonts'
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

// Concat vendor JS
gulp.task('compile-vendor:js', function () {
    return gulp.src([
            path.src.js + '/vendor/**/*.js'
        ])
        .pipe(plugins.concat('vendor.js'))
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
    return del([ pubDir ]);
});

// Builder
gulp.task('build', function (cb) {
    // runSequence позволяет запускать задачи по порядку
    runSequence('clean', // 1 выполнится первым
        ['compile:css', 'compile:js', 'compile-vendor:js'], // 2 (таски выполнятся впараллель)
        ['minify:css', 'minify:js', 'minify:images'] // 3
    );
});


// Watcher
gulp.task('default', function () {

    // Notifies Livereload to reload browser if above tasks being runned
    plugins.livereload.listen();

    // CSS watcher
    gulp.watch([
        srcDir + '/**/*.styl',
        srcDir + '/**/*.css'
    ], ['compile:css']);

    // JS watcher
    gulp.watch(srcDir + '/**/*.js', ['compile:js']);

});
