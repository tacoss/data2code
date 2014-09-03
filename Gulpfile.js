var gulp = require('gulp');
var data2code = require('./index.js');
var gen = require('./lib/groovy/raml2DTO.js')

console.log(data2code);
console.log(gen.handleRender);

gulp.task("test", function(){
  gulp.src('./test/cats.raml')
    .pipe(data2code({generator:gen}))
    .pipe(gulp.dest('build'));
}); 
