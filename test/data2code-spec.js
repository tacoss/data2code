'use strict';

var Mocha = require('mocha');
var chai = require('chai');
chai.should();

'use strict';
var raml = require('raml-parser'), expect = require('chai').expect;
var data2Code = require('..');

describe('data2code basic test', function () {

  var handleRender = function (done, expectedResult, result) {
    try {
      result[0]["test.test"].should.equal(expectedResult);
      done();
    } catch (x) {
      done(x);
    }
  };

  var sampleData = [{"test.test" : {title: "Compra venta de gatitos"}}];

  it('should generate something', function (done) {
    var simpleGen = {};
    simpleGen.template = '{{title}}';
    simpleGen.handleRender = handleRender.bind(undefined, done, "Compra venta de gatitos");

    data2Code.process(sampleData, simpleGen);

  });
  it('testing parser', function (done) {
    var simpleGen = {};
    simpleGen.template = '{{title}}';
    simpleGen.parser = function (data) {
      return sampleData
    };

    simpleGen.handleRender = handleRender.bind(undefined, done, "Compra venta de gatitos");
    data2Code.process({}, simpleGen);

  });

  it('testing parser when returning Arrasy', function (done) {
    var simpleGen = {};
    simpleGen.template = '{{title}}';
    simpleGen.parser = function (data) {
      return [{"test.test" : {title: data[0]["test.test"].title + " finos"}}]
    };

    simpleGen.handleRender = handleRender.bind(undefined, done, "Compra venta de gatitos finos");
    data2Code.process(sampleData, simpleGen);

  });

  it('testing helpers', function (done) {
    var simpleGen = {};
    simpleGen.template = '{{msg title}}';
    simpleGen.helpers = {
      msg: function (msg) {
        return 'Renta, ' + msg
      }
    };
    simpleGen.handleRender = handleRender.bind(undefined, done, "Renta, Compra venta de gatitos");
    data2Code.process(sampleData, simpleGen);

  });

  it('testing partials', function (done) {
    var simpleGen = {};
    simpleGen.template = '{{>header}}';
    simpleGen.partials = {
      header: 'Testing partial'
    };
    simpleGen.handleRender = handleRender.bind(undefined, done, "Testing partial");
    data2Code.process(sampleData, simpleGen);

  });


});
