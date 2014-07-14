'use strict';
describe('simple code', function () {
  describe('simple code gen', function () {
    var raml = require('raml-parser'), expect = require('chai').expect;
    var data2Code = new require('../lib/data2code');
    var handleRender = function(result){
      console.log("simpleGen.handleRender ->", result);
      try {
        expect(result).to.equal(expetedResult);
        done();
      } catch (x) {
        done(x);
      }
    };

    it('should generate something', function (done) {
      var simpleGen = {};
      simpleGen.template = 'class {{title}}';
      simpleGen.handleRender = handleRender;
      // simpleGen.handleRender = function (result) {
      //   console.log("simpleGen.handleRender ->", result);
      //   try {
      //     expect(result).to.equal('class Compra venta de gatitos');
      //     done();
      //   } catch (x) {
      //     done(x);
      //   }
      // };

      raml.loadFile('./test/cats.raml').then(function(data){
        data2Code.process(data, simpleGen);
      },  function (error) {
        console.log('Error parsing: ' + error);
      });

    });

    it('testing parser', function (done) {
      var data2Code = new require('../lib/data2code');
      var simpleGen = {};
      simpleGen.template = 'class {{title}}';
      simpleGen.parser = function(data){
        return {title: data.title + " Hi"}
      };

      var expetedResult = "class Compra venta de gatitos Hi"
      simpleGen.handleRender = handleRender;

    raml.loadFile('./test/cats.raml').then(function (data) {
      data2Code.process(data, simpleGen);
    }, function (error) {
      console.log('Error parsing: ' + error);
    });

    });


  });

});
