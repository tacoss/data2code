'use strict';
var raml = require('raml-parser'), expect = require('chai').expect;
var data2Code = new require('../lib/data2code');
describe('simple code', function () {
  describe('simple code gen', function () {

    var handleRender = function (done, expectedResult, result) {
      try {
        expect(result).to.equal(expectedResult);
        done();
      } catch (x) {
        done(x);
      }
    };

    it('should generate something', function (done) {
      var simpleGen = {};
      simpleGen.template = 'class {{title}}';
      simpleGen.handleRender = handleRender.bind(undefined, done, "class Compra venta de gatitos");

      raml.loadFile('./test/cats.raml').then(function (data) {
        data2Code.process(data, simpleGen);
      }, function (error) {
        console.log('Error parsing: ' + error);
      });

    });

    it('testing parser', function (done) {
      var simpleGen = {};
      simpleGen.template = 'class {{title}}';
      simpleGen.parser = function (data) {
        return {title: data.title + " Hi"}
      };

      simpleGen.handleRender = handleRender.bind(undefined, done, "class Compra venta de gatitos Hi");

      raml.loadFile('./test/cats.raml').then(function (data) {
        data2Code.process(data, simpleGen);
      }, function (error) {
        console.log('Error parsing: ' + error);
      });

    });

    it('testing helpers', function (done){
      var simpleGen = {};
      simpleGen.template = 'class {{hi title}}';
      simpleGen.helpers = [{name:'hi', fn:function(msg){ return 'hello ' + msg } }];
      simpleGen.handleRender = handleRender.bind(undefined, done, "class hello Compra venta de gatitos");

      raml.loadFile('./test/cats.raml').then(function (data) {
        data2Code.process(data, simpleGen);
      }, function (error) {
        console.log('Error parsing: ' + error);
      });

    });

  });

});
