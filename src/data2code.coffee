Handlebars = require("handlebars")

module.exports.process = (data , gen) ->
  if gen.handleRender and typeof gen.handleRender is 'function'

    if gen.helpers
      for key of gen.helpers
        fn = gen.helpers[key]
        if fn and typeof fn is 'function'
          Handlebars.registerHelper(key, fn)
        else
          console.error "helpers " + key + "is not a function"

    if gen.partials
      for key of gen.partials
          Handlebars.registerPartial(key, gen.partials[key])

    if typeof gen.parser is 'function'
      try
        dataParsed = gen.parser(data)
      catch e
        console.log "Parser error" , e
    else
      dataParsed  = data
    
    template = Handlebars.compile(gen.template)
    if Array.isArray dataParsed
      result = []
      for obj in dataParsed
        if obj.name and obj.model
          result.push {name: obj.name, content: template(obj.model)}
        else
          throw new Error("Data element doesn't have name or model")

      gen.handleRender(result)
    else
      throw new Error("Digest data is not and Array")
  else
    throw new Error("generator.handleRender not defined")









