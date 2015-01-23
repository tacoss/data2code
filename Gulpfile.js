var gulp = require('gulp');
var del = require('del');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var runSequence = require('run-sequence');

var coffee = require('gulp-coffee');

gulp.task('clean', function (cb) {
  del([
    'lib/**'
  ], cb);
});


gulp.task('coffee', function() {
  return gulp.src('./src/**/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./lib/'))
});

gulp.task('copy-templates', function(){
  return gulp.src('./src/**/*.hbs')
  .pipe(gulp.dest('./lib/'));
});

gulp.task('test', function(){
  gulp.src('./test/*spec.js')
  .pipe(mocha(
    {
      require: ['chai', 'chai-as-promised'],
      reporter: 'spec',
      growl: true
    }
  ));
});

gulp.task('build', function(callback) {
  runSequence('clean',
    ['copy-templates', 'coffee'],
    'test',
    callback);
});

gulp.task('default', ['build']);

