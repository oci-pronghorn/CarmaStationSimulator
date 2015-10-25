var connect = require('connect');
var del = require('del');
var gulp = require('gulp');
var http = require('http');
var pi = require('gulp-load-plugins')();
var serveStatic = require('serve-static');

var paths = {
  build: 'build',
  css: 'css/**/*.css',
  html: ['index.html', 'partials/**/*.html'],
  js: ['js/**/*.js'],
};

gulp.task('clean', function (cb) {
  del(paths.build, cb);
});

gulp.task('connect', function () {
  var app = connect();
  app.use(serveStatic(__dirname));
  http.createServer(app).listen(3000);
});

gulp.task('csslint', function () {
  return gulp.src(paths.css).
    pipe(pi.csslint({
      ids: false
    })).
    pipe(pi.csslint.reporter()).
    pipe(pi.livereload());
});

gulp.task('html', function () {
  gulp.src(paths.html).
    pipe(pi.livereload());
});

gulp.task('jshint', function () {
  return gulp.src(paths.js).
    pipe(pi.changed(paths.build)).
    pipe(pi.jshint()).
    pipe(pi.jshint.reporter('default'));
});

gulp.task('transpile', function () {
  return gulp.src(paths.js).
    pipe(pi.changed(paths.build)).
    pipe(pi.sourcemaps.init()).
    pipe(pi.babel()).
    pipe(pi.sourcemaps.write('.')).
    pipe(gulp.dest(paths.build)).
    pipe(pi.livereload());
});

gulp.task('watch', function () {
  pi.livereload.listen();
  gulp.watch(paths.html, gulp.series('html'));
  gulp.watch(paths.css, gulp.series('csslint'));
  gulp.watch(paths.js,
    gulp.series('jshint', 'transpile'));
});

gulp.task('default',
  gulp.series('transpile', gulp.parallel('connect', 'watch')));
