var gulp = require('gulp');
var data2code = require('./gulp-data2code.js');
var gen = require('./lib/generators/groovy/raml2DTO.js')

gulp.task("test", function(){
  gulp.src('./test/cats.raml')
    .pipe(data2code({generator:gen}))
    .pipe(gulp.dest('build'));
}); 
