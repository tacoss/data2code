'use strict';

var data2Code = require('../lib/data2code');
var raml = require('raml-parser');

describe('data2Code', function() {

  describe('simple code gen', function() {

    var simpleGen = {};

    simpleGen.template = 'class {{displayName}}';
    simpleGen.handleRender = function(listString) {
      listString.should.match('class Cat');
      done();
    };

    data2Code.register(simpleGen);

    raml.loadFile('cats.raml').then(data2code.process, function(error) {
      console.log('Error parsing: ' + error);
    });

  });

});
