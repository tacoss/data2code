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
  console.log('compileTemplate', tmpl, typeof tmpl)
  if(typeof tmpl === 'function'){
    return tmpl
  }else if(typeof tmpl === 'string') {
    return Handlebars.compile(tmpl)
  }
}

var handleObjectTemplate = function(tmpl){
  for(var key in tmpl) break;
  if(typeof tmpl === 'object'){
    tmpl[key].tmpl = compileTemplate(tmpl[key].tmpl)
    return tmpl
  }else{
    throw new Error('generator.template should be an object')
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

var bindTemplate = function(key, tmplDef, data, options){

  var htmpl = tmplDef[key].tmpl
  var result = {}
  var nameTmpl = Handlebars.compile(key)
  result[nameTmpl(data, options)] = htmpl(data, options)
  return result
}
module.exports.process = function(data, gen) {

  if (gen.handleRender && typeof gen.handleRender === 'function') {

    var templates = []
    if(gen.template !== undefined){
      templates = templates.concat(handleObjectTemplate(gen.template))
    }
   // templates = templates.concat(handleTemplates(gen.templates))
    var options = {
      helpers: gen.helpers,
      partials: gen.partials
    }

    var results = []
    console.log('templates', templates)
    templates.forEach(function(template){
      for(var key in template) break;

      var dataParsed = processParsers(template[key], gen, data)
      console.log("dataParsed", dataParsed)
      if (Array.isArray(dataParsed)) {
        dataParsed.forEach(function(element){
          results.push(bindTemplate(key, template, element, options))
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
