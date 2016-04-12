var gulp = require('gulp');
var jade = require('gulp-jade');
var browserify = require('browserify');
//require('harmonize')();
//var gutil = require('gulp-util');
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
var babel = require('gulp-babel'),
  concat = require('gulp-concat'),
  sourcemaps = require('gulp-sourcemaps'),
  webpack = require('webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  webpackConfig = require("./webpack.config.js");


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
  gulp.src('./src/js/main.js')
    .pipe(webpack({
      module: {
        loaders: [{
          test: /\.jsx$/,
          loader: "babel-loader"
        },
          {
            test: /\.js$/,
            loader: "babel-loader"
          }]
      }
    }))
    .pipe(gulp.dest('www/'));


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
  var myConfig = Object.create(webpackConfig);

  var compiler = webpack({
    module: {
      loaders: [{
        test: /\.jsx$/,
        loader: "babel-loader"
      },
        {
          test: /\.js$/,
          loader: "babel-loader"
        }]
    },
    entry: "./src/js/tgames.js",
    devtool: "eval",
    output: {
      path: "./www/js",
      filename: "main.js"
    },
    plugins: [
      //new webpack.optimize.UglifyJsPlugin({minimize: false, compress:{warnings: false}})
    ]
  });

  new WebpackDevServer(compiler, {
    // server and middleware options
  }).listen(9001, "0.0.0.0", function (err) {
    if (err) {
      console.log('error', err);
    }
  });
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
gulp.task('default', ['jade', 'copycss', 'styles', 'watch', 'webserver']);