fs = require('fs')
commonHelpers = require("../helpers/common.js").helpers()

module.exports.generator = ->
  capitalize = (str)->
    str.charAt(0).toUpperCase() + str.slice(1)

  generator = {}
  generator.helpers = commonHelpers
  generator.helpers.push { name: "parseSchema", fn: (context, options) ->
    schema = JSON.parse(this.schema)
    console.log schema
    return options.fn(schema)
  }


  generator.template = fs.readFileSync(__dirname + "/AbstractResource.hbs").toString()
  generator.parser = (data)->
    parsed = []
    for r in data.resources
      parseResource(r, parsed)
    for p in parsed
      p.model.extra = data.extra if data.extra
    parsed

  parseResource = (data, parsed, parentUri = "")->
    model = {}
    model.className = "#{data.displayName}#{capitalize(data.type)}Resource"
    model.classDescription = data.description
    model.uri = "#{parentUri}#{data.relativeUri}"
    model.classMethods = data.methods
    model.relativeUriPathSegments = data.relativeUriPathSegments
    model.methods = data.methods
    model.classDescription = data.description ? ""
    if data.resources
      for r in data.resources
        parseResource(r, parsed, model.uri)

    parsed.push {name :"#{model.className}.groovy", model}
  generator