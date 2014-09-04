# data to code generator
  
  * This module generate code from a javascript Object
  * It uses Handlebars templates
  * It's primary use is to make code from [raml-js-parser](https://github.com/raml-org/raml-js-parser)
  
## Defining a Generator

Usually a generator it's responsible for certain path of the javascript object.
 
A generator is a simple object with the following properties:

 * Required properties:
    * template -> Handlebars template.
 * Optional properties:
    * handleRender([str]) -> This function handles the render results, usually writes to disk. 
    * parser(data) -> Function it receives RAML parsed data, returns parsed data.                                                     
    * helpers -> Handlebars helpers.  
    * partials -> Handlebars partials. 


##Usage 

  *  You must provide the generators.
  *  Multiple generators are supported.
    

```javascript
var data2Code = require('data2Code');
var raml = require('raml-parser');

var simpleGen = {};
simpleGen.template = '{{title}}';
var handleRender = function (result) {
  console.log(result);
}


raml.loadFile('myAPI.raml').then( function(data){
  data2Code.process(data, simpleGen);   
  data2Code.process(data, anotherGen);
}, function(error) {
  console.log('Error parsing: ' + error);
});


```
## generators included
    * raml to DTO groovy
    
## As gulp-plugin
```
var gulp = require('gulp');
var data2code = require('data2code/gulp-data2code.js');
var gen = require('data2code/lib/generators/groovy/raml2DTO.js')

gulp.task("test", function(){
  gulp.src('./test/cats.raml')
    .pipe(data2code({generator:gen}))
    .pipe(gulp.dest('build'));
});

```

## raml2code

As a command line script:

 ```bash
  node lib/raml2code.js -i test/cats.raml -g "./generators/groovy/raml2DTO.js" -o target -e '{"package":"gex.dt"}'
```



                                
