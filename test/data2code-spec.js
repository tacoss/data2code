/*eslint no-unused-expressions:0*/
/*eslint-env mocha*/
'use strict'

var chai = require('chai')
chai.should()
var data2Code = require('..')
var _ = require('lodash')

describe('data2code basic test', function () {

  var handleResults = function (done, expectedResult, results) {
    try {
      results[0]['test.test'].should.equal(expectedResult)
      done()
    } catch (x) {
      done(x)
    }
  }

  var sampleData = [
    {
      title: 'Compra venta de gatitos',
      name: 'test'
    }]

  it('should generate something', function (done) {
    var simpleGen = {}
    simpleGen.template = {'test.test': '{{title}}'}
    var results = data2Code.process(sampleData, simpleGen)
    handleResults(done, 'Compra venta de gatitos', results)

  })

  it('testing parser when returning Arrays', function (done) {
    var simpleGen = {}
    var parser = function (data) {
      return [{title: data[0].title + ' finos'}]
    }

    simpleGen.templates = [{'test.test': {tmpl: '{{title}}', parser: parser}}]
    var results = data2Code.process(sampleData, simpleGen)
    handleResults(done, 'Compra venta de gatitos finos', results)
  })

  it('simple gen', function (done) {
    var gen = {
      template: {'test.test': '{{title}}'}
    }
    var results = data2Code.process(sampleData, gen)
    handleResults(done, 'Compra venta de gatitos', results)
  })

  it('testing parser when returning object', function (done) {
    var simpleGen = {}
    var parser = function () {
      return {title: 'cat fino'}
    }

    simpleGen.templates = [{'test.test': {tmpl: '{{title}}', parser: parser}}]
    var results = data2Code.process(sampleData, simpleGen)
    handleResults(done, 'cat fino', results)
  })


  it('testing simple template parser', function (done) {
    var simpleGen = {}
    simpleGen.parser = function () {
      return [{title: 'Compra venta de gatitos simple'}]
    }
    simpleGen.template = {'test.test': '{{title}}'}
    var results = data2Code.process(sampleData, simpleGen)
    handleResults(done, 'Compra venta de gatitos simple', results)
  })

  it('testing new definition of template', function (done) {
    var simpleGen = {}
    var parser = function () {
      return [{title: 'Compra venta de gatitos feos'}]
    }
    simpleGen.template = {'test.test': {tmpl: '{{title}}', parser: parser}}

    var results = data2Code.process(sampleData, simpleGen)
    handleResults(done, 'Compra venta de gatitos feos', results)
  })

  it('should interpolate name', function (done) {
    var simpleGen = {}
    var parser = function () {
      var context = {
        name: 'Sample',
        title: 'Compra venta de gatitos feos'
      }

      return [context]
    }
    simpleGen.template = {'{{name}}Test': {tmpl: '{{title}}', parser: parser}}

    var results = data2Code.process(sampleData, simpleGen)
    var test = _.find(results, function (result) {
      var key = Object.keys(result)[0]
      return key === 'SampleTest'
    })
    test.should.not.be.null
    done()


  })

  it('should works with multiple templates and multiple parsers', function (done) {
    var multipleGen = {
      templates: [
        {
          '{{name}}Resource.java': {
            tmpl: 'hola {{title}}',
            parser: function () {
              return [{title: 'parse1', name: 'test'}]
            }
          }
        },
        {
          '{{name}}.md': {
            tmpl: 'readme {{title}}',
            parser: function () {
              return [{title: 'parse2', name: 'readme'}]
            }
          }
        }
      ]
    }
    var results = data2Code.process(sampleData, multipleGen)
    var testx = _.find(results, function (result) {
      var key = Object.keys(result)[0]
      return key === 'testResource.java'
    })
    var testy = _.find(results, function (result) {
      var key = Object.keys(result)[0]
      return key === 'readme.md'
    })
    testx['testResource.java'].should.equal('hola parse1')
    testy['readme.md'].should.equal('readme parse2')

    done()

  })

  it('should use the same parser with different templates', function (done) {
    var multipleGen = {
      parser: function () {
        return [{msg: 'hola parse'}]
      },
      templates: [
        {'readme.md': '{{msg}}'}, {'Resource.java': '{{msg}}'}
      ]
    }
    var results = data2Code.process(sampleData, multipleGen)
    var testx = _.find(results, function (result) {
      var key = Object.keys(result)[0]
      return key === 'Resource.java'
    })
    var testy = _.find(results, function (result) {
      var key = Object.keys(result)[0]
      return key === 'readme.md'
    })
    testx['Resource.java'].should.equal('hola parse')
    testy['readme.md'].should.equal('hola parse')

    done()
  })


  it('testing helpers', function (done) {
    var simpleGen = {}
    simpleGen.template = {'test.test': '{{msg title}}'}
    simpleGen.helpers = {
      msg: function (msg) {
        return 'Renta, ' + msg
      }
    }
    var results = data2Code.process(sampleData, simpleGen)
    handleResults(done, 'Renta, Compra venta de gatitos', results)
  })

  it('testing partials', function (done) {
    var simpleGen = {}
    simpleGen.template = {'test.test': '{{>header}}'}
    simpleGen.partials = {
      header: 'Testing partial'
    }
    var results = data2Code.process(sampleData, simpleGen)
    handleResults(done, 'Testing partial', results)
  })

})
