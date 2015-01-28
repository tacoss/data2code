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
      results = []
      for obj in dataParsed
        key = Object.keys(obj)[0]
        if key and obj[key]
          result = {}
          result[key] = template(obj[key], options)
          results.push result
        else
          throw new Error("Data element doesn't have name or model")

      gen.handleRender(results)
    else
      throw new Error("Digest data is not and Array")
  else
    throw new Error("generator.handleRender not defined")









