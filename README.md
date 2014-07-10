# data to code generator
  
  * This module generate code from a javascript Object
  * It uses Handlebars templates by default but it could be configured 
  * It is primary use to make code from [raml-js-parser](https://github.com/raml-org/raml-js-parser)
  
## Defining a Generator

Usually a generator it's responsible for certain path of the javascript object.
 
A generator is a simple object with the following properties:

 * Required properties:
    * template -> Handlebars template.
    * handleRender([str]) -> This function handles the render results, usually writes to disk. 
 * Optional properties:
    * parser(data) -> Function it receives RAML parsed data, returns parsed data.                                                     
    * helpers -> Handlebars helpers.  
    * partials -> Handlebars partials. 


##Usage 

  *  You must provide the generators.
  *  Multiple generators are supported.
    

```javascript
var data2Code = require('data2Code');
var raml = require('raml-parser');


data2Code.register(generatorFromSchema);    //where generatorFromSchema it's the definition of this generator 
data2Code.register(generatorFromResource);

raml.loadFile('myAPI.raml').then( data2code.process, function(error) {
  console.log('Error parsing: ' + error);
});


```
   
    
## Configuration 

To change the template engine: 

 ```
 raml2code.config({tmplEngine : function(tmpl, data)})
 ```
 
 
    

 

                                