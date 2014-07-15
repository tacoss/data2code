'use strict';
var raml = require('raml-parser'), expect = require('chai').expect;
var data2Code = new require('../lib/data2code');

describe('data2code basic test', function () {

  var handleRender = function (done, expectedResult, result) {
    try {
      expect(result[0]).to.be.equal(expectedResult);
      done();
    } catch (x) {
      done(x);
    }
  };

  it('should generate something', function (done) {
    var simpleGen = {};
    simpleGen.template = '{{title}}';
    simpleGen.handleRender = handleRender.bind(undefined, done, "Compra venta de gatitos");

    raml.loadFile('./test/cats.raml').then(function (data) {
      data2Code.process(data, simpleGen);
    }, function (error) {
      console.log('Error parsing: ' + error);
    });

  });

  it('testing parser', function (done) {
    var simpleGen = {};
    simpleGen.template = '{{title}}';
    simpleGen.parser = function (data) {
      return {title: data.title + " finos"}
    };

    simpleGen.handleRender = handleRender.bind(undefined, done, "Compra venta de gatitos finos");

    raml.loadFile('./test/cats.raml').then(function (data) {
      data2Code.process(data, simpleGen);
    }, function (error) {
      console.log('Error parsing: ' + error);
    });

  });

  it('testing helpers', function (done) {
    var simpleGen = {};
    simpleGen.template = '{{msg title}}';
    simpleGen.helpers = [
      {name: 'msg', fn: function (msg) {
        return 'Renta, ' + msg
      } }
    ];
    simpleGen.handleRender = handleRender.bind(undefined, done, "Renta, Compra venta de gatitos");

    raml.loadFile('./test/cats.raml').then(function (data) {
      data2Code.process(data, simpleGen);
    }, function (error) {
      console.log('Error parsing: ' + error);
    });

  });

  it('testing partials', function (done) {
    var simpleGen = {};
    simpleGen.template = '{{>header}}';
    simpleGen.partials = [
      {name: 'header', str: 'Testing partial'}
    ];
    simpleGen.handleRender = handleRender.bind(undefined, done, "Testing partial");

    raml.loadFile('./test/cats.raml').then(function (data) {
      data2Code.process(data, simpleGen);
    }, function (error) {
      console.log('Error parsing: ' + error);
    });

  });


});
