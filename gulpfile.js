var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sh = require('shelljs');
var karma = require('karma').server;

gulp.task('jshint', function () {
    gulp
        .src(['./www/js/**/*.js', './tests/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
    ;
});

gulp.task('mocha', function (done) {
    sh.exec('mocha', done);
});

gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/tests/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('release', ['jshint', 'mocha', 'test']);

