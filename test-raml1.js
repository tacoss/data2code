var raml = require('raml-parser');

raml.loadFile('cats.raml').then(function(data){
  console.log(data);
}, function(error){
  console.log("error parsing: " + error);
});
