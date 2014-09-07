Handlebars = require("handlebars")

module.exports.process = (data , gen) ->
  if gen.handleRender and typeof gen.handleRender is 'function'

    if gen.helpers and gen.helpers instanceof Array
      for helper in gen.helpers
        if helper.name and helper.fn and typeof helper.fn is 'function'
          Handlebars.registerHelper(helper.name, helper.fn)
        else
          console.error "helpers not are in incorrect format"

    if gen.partials
      for partial in gen.partials
        if partial.name and partial.str
          Handlebars.registerPartial(partial.name, partial.str)

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









