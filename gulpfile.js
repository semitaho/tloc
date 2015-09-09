var gulp = require('gulp');
var jade = require('gulp-jade');
var babelify = require('babelify'),
    browserify = require('browserify');
//require('harmonize')();
//var gutil = require('gulp-util');
var react = require('gulp-react');
//var ftp = require('gulp-ftp');
var nib = require('nib');
var source = require('vinyl-source-stream');
var webserver = require('gulp-webserver');
var stylus = require('gulp-stylus'),
    plumber = require('gulp-plumber');
var watchfiles = 'src/*.jade';

var webrootdir = 'www';
var stylefiles = 'src/styles/**.styl';
var mainstylfile = 'src/styles/tloc.styl';
var bootstrapfiles = 'src/styles/bootstrap/**';

var jsxfiles = 'src/js/**/*.jsx';
var jsfiles = 'src/js/**/*.js';

var jest = require('gulp-jest');
var mainjsfile = './src/js/main.js';

gulp.task('jade', function () {
    var compiledFiles = [watchfiles, '!**/layout.jade'];
    return gulp.src(compiledFiles)
        .pipe(plumber())
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(webrootdir))
});


gulp.task('compilejs', function () {
    var b = browserify({debug: true, insertGlobals: true});
    b.transform(babelify); // use the reactify transform
    b.add(mainjsfile);
    return b.bundle()
        .pipe(plumber())

        .pipe(source("main.js"))

        .pipe(gulp.dest(webrootdir + '/js'));
});
gulp.task('copyjs', function () {
    return gulp.src(jsxfiles)
        .pipe(plumber())
        .pipe(react())
        .pipe(gulp.dest(webrootdir + '/js'));
});

gulp.task('copycss', function () {
    return gulp.src(bootstrapfiles)
        .pipe(gulp.dest(webrootdir + '/css/bootstrap/'));

});

gulp.task('watch', function () {
    gulp.watch(watchfiles, ['jade']);
    gulp.watch(stylefiles, ['styles']);
    gulp.watch([jsxfiles, jsfiles], ['compilejs']);


});

gulp.task('styles', function () {
    gulp.src(mainstylfile)
        .pipe(stylus({use: nib()}))
        .pipe(gulp.dest(webrootdir + '/css'));
});

gulp.task('webserver', function () {
    return gulp.src(webrootdir).pipe(webserver({
        livereload: true,
        open: 'http://0.0.0.0:9001/index.html',
        port: 9001,
        host: '0.0.0.0'
    }));
});

gulp.task('test', function () {
    return gulp.src('test')
        .pipe(jest({
            scriptPreprocessor: 'preprocessor.js',
            testDirectoryName: 'spec',
            unmockedModulePathPatterns: ["react", "services"],
            moduleFileExtensions: ['js', 'json', 'react']
        }));
});


gulp.task('build', ['templates']);
gulp.task('default', ['jade', 'compilejs', 'copycss', 'styles', 'watch', 'webserver']);