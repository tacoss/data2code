Handlebars = require("handlebars")
fs = require('fs')

module.exports.process = (data , gen) ->
  # console.log "Data2Code#process", gen
  # console.log "Data2Code#process.data", data
  if gen.handleRender and typeof gen.handleRender is 'function'
    template = Handlebars.compile(gen.template)
    if gen.helpers and gen.helpers instanceof Array
      for helper in gen.helpers
        if helper.name and helper.fn and typeof helper.fn is 'function'
          Handlebars.registerHelper(helper.name, helper.fn)
    if gen.partials
      for partial in gen.partials
        if partial.name and partial.str
          Handlebars.registerPartial(partial.name, partial.str)

    if typeof gen.parser is 'function'
      dataParsed = gen.parser(data)
    else
      dataParsed  = data

    gen.handleRender(template(dataParsed))


