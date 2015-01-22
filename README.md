# data to code generator

[![Build Status](https://img.shields.io/travis/gextech/data2code/master.svg?style=flat)](https://travis-ci.org/gextech/data2code)
  
  * This module generate code from a javascript Object
  * It uses Handlebars templates
  * It's primary use is to make code from [raml-js-parser](https://github.com/raml-org/raml-js-parser)
  
## Defining a Generator

Usually a generator it's responsible for certain path of the javascript object.
 
A generator is a simple object with the following properties:

 * Required properties:
    * template -> Handlebars template.
    * parser(data) -> Function it receives RAML parsed data, returns parsed data
      The parser must return and array of object each object must have name and content properties

Sample:
```javascript
[ { name: "test.test", 
    model: {
      title:data.title + " finos"
      }
  }
]
```
 * Optional properties:
    * handleRender([str]) -> This function handles the render results, usually writes to disk. 
    * helpers -> Handlebars helpers.  
    * partials -> Handlebars partials. 


##Usage 

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

