# data to code generator

[![Build Status](https://img.shields.io/travis/gextech/data2code/master.svg?style=flat)](https://travis-ci.org/gextech/data2code)
  
  * This module generate code from a javascript Object
  * It uses Handlebars templates
  * It's primary use is to make code from [raml-js-parser](https://github.com/raml-org/raml-js-parser)
  
## Defining a Generator
[Generator spec](Generator.md)



##Usage 

```javascript
var data2Code = require('data2Code');

var gen = {
  template: {'readme.md' : '{{title}}'
}

var results = data2Code.process(sampleData, gen)
```

