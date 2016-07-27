var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sh = require('shelljs');
var karma = require('karma');

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

gulp.task('start', function (done) {
    sh.exec('node app.js', done);
});

gulp.task('test', ['karma']);

gulp.task('karma', function (done) {
    new karma.Server({
        configFile: __dirname + '/tests/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('ensurePhantomJsPath', function (done) {
    process.env.PHANTOMJS_BIN = './node_modules/phantomjs-prebuilt/phantomjs';

    console.log(process.env.PHANTOMJS_BIN);

    done();
});

gulp.task('release', ['jshint', 'mocha' /*, 'test'*/]);

gulp.task('default', ['jshint', 'mocha', 'test', 'start']);