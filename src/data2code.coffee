Handlebars = require("handlebars")

module.exports.process = (data , gen) ->
  if gen.handleRender and typeof gen.handleRender is 'function'

    if typeof gen.parser is 'function'
      dataParsed = gen.parser(data)
    else
      dataParsed  = data

    if typeof gen.template isnt  "function"
      template = Handlebars.compile(gen.template)
    else
      template = gen.template

    options =
      helpers: gen.helpers
      partials: gen.partials

    if Array.isArray dataParsed
      result = []
      for obj in dataParsed
        if obj.name and obj.model
          result.push {name: obj.name, content: template(obj.model, options)}
        else
          throw new Error("Data element doesn't have name or model")

      gen.handleRender(result)
    else
      throw new Error("Digest data is not and Array")
  else
    throw new Error("generator.handleRender not defined")









