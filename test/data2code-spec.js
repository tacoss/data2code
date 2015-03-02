'use strict'

var chai = require('chai')
chai.should()
var data2Code = require('..')
var _ = require('lodash')

describe('data2code basic test', function () {

  var handleRender = function (done, expectedResult, result) {
    try {
      result[0]['test.test'].should.equal(expectedResult)
      done()
    } catch (x) {
      done(x)
    }
  }

  var sampleData = [{'test.test': {title: 'Compra venta de gatitos'}}]

  it('should generate something', function (done) {
    var simpleGen = {}
    simpleGen.template = '{{title}}'
    simpleGen.handleRender = handleRender.bind(undefined, done, 'Compra venta de gatitos')

    data2Code.process(sampleData, simpleGen)

  })

  it('testing simple template parser', function (done) {
    var simpleGen = {}
    simpleGen.parser = function () {
      return [{'test.test': {title: 'Compra venta de gatitos simple'}}]
    }
    simpleGen.template = '{{title}}'
    simpleGen.handleRender = handleRender.bind(undefined, done, 'Compra venta de gatitos simple')
    data2Code.process(sampleData, simpleGen)
  })

  it('testing new definition of template', function (done) {
    var simpleGen = {}
    var parser = function () {
      return [{'test.test': {title: 'Compra venta de gatitos feos'}}]
    }
    simpleGen.template = {tmpl: '{{title}}', parser: parser}

    simpleGen.handleRender = handleRender.bind(undefined, done, 'Compra venta de gatitos feos')
    data2Code.process(sampleData, simpleGen)
  })

  it('should works with multiple templates and multiple parsers', function (done) {
    var multipleGen = {
      templates: [
        {tmpl: 'hola {{title}}', parser: function(){return [{'test.testx': {title: 'parse1'}}]}},
        {tmpl: 'readme {{title}}', parser: function(){return [{'test.testy': {title: 'parse2'}}]}}
      ],
      handleRender: function (results) {

        var testx = _.find(results, function (result) {
          return Object.keys(result)[0] === 'test.testx'
        })
        var testy = _.find(results, function (result) {
          return Object.keys(result)[0] === 'test.testy'
        })
        testx['test.testx'].should.equal('hola parse1')
        testy['test.testy'].should.equal('readme parse2')

        done()
      }
    }
    data2Code.process(sampleData, multipleGen)
  })

  it('testing parser when returning Arrasy', function (done) {
    var simpleGen = {}
    var parser = function (data) {
      return [{'test.test': {title: data[0]['test.test'].title + ' finos'}}]
    }

    simpleGen.templates = [{tmpl: '{{title}}', parser: parser}]

    simpleGen.handleRender = handleRender.bind(undefined, done, 'Compra venta de gatitos finos')
    data2Code.process(sampleData, simpleGen)
  })

  it('testing helpers', function (done) {
    var simpleGen = {}
    simpleGen.template = '{{msg title}}'
    simpleGen.helpers = {
      msg: function (msg) {
        return 'Renta, ' + msg
      }
    }
    simpleGen.handleRender = handleRender.bind(undefined, done, 'Renta, Compra venta de gatitos')
    data2Code.process(sampleData, simpleGen)
  })

  it('testing partials', function (done) {
    var simpleGen = {}
    simpleGen.template = '{{>header}}'
    simpleGen.partials = {
      header: 'Testing partial'
    }
    simpleGen.handleRender = handleRender.bind(undefined, done, 'Testing partial')
    data2Code.process(sampleData, simpleGen)
  })

})
