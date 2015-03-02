'use strict'
var Handlebars = require('handlebars')

var processParsers = function(tmpl, gen, data){
  var sdata = JSON.parse(JSON.stringify(data))
  var parsed
  if(typeof tmpl === 'function'){
    if(typeof gen.parser === 'function'){
      parsed = gen.parser(sdata)
    }else{
      parsed = sdata
    }
  }else if(typeof tmpl === 'object'){
    if(typeof tmpl.parser === 'function'){
      parsed = tmpl.parser(sdata)
    }else{
      parsed = sdata
    }
  }
  return parsed
}
var compileTemplate = function(tmpl){
  if(typeof tmpl === 'function'){
    return tmpl
  }else if(typeof tmpl === 'string') {
    return Handlebars.compile(tmpl)
  }else if(typeof tmpl === 'object'){
    tmpl.tmpl = compileTemplate(tmpl.tmpl)
    return tmpl
  }
}

var handleTemplates = function(tmpls){
  var templates = []
  if(tmpls === undefined){
    return templates
  }

  if(Array.isArray(tmpls)){
    tmpls.forEach(function(def){
      templates.push(compileTemplate(def))
    })
  }else{
    throw new Error('gen.templates must be array')
  }

  return templates
}

var bindTemplate = function(tmplDef, data, options){
  var htmpl = tmplDef
  if(typeof tmplDef === 'object'){
    htmpl = tmplDef.tmpl
  }
  var result = {}
  var key = Object.keys(data)[0]

  result[key] = htmpl(data[key], options)
  return result
}
module.exports.process = function(data, gen) {

  if (gen.handleRender && typeof gen.handleRender === 'function') {

    var templates = []
    if(gen.template !== undefined){
      templates = templates.concat(compileTemplate(gen.template))
    }
    templates = templates.concat(handleTemplates(gen.templates))
    var options = {
      helpers: gen.helpers,
      partials: gen.partials
    }

    var results = []
    templates.forEach(function(template){

      var dataParsed = processParsers(template, gen, data)
      if (Array.isArray(dataParsed)) {
        dataParsed.forEach(function(dato){
          results.push(bindTemplate(template, dato, options))
        })
      } else {
        results.push(bindTemplate(template, dataParsed, options))
      }
    })


    gen.handleRender(results)
  } else {
    throw new Error('generator.handleRender not defined')
  }
}
