Handlebars = require("handlebars")

module.exports.process = (data , gen) ->
#  console.log "data2Code#process.gen", gen
#  console.log "Data2Code#process.data", data
  if gen.handleRender and typeof gen.handleRender is 'function'

    if gen.helpers and gen.helpers instanceof Array
      for helper in gen.helpers
        if helper.name and helper.fn and typeof helper.fn is 'function'
          Handlebars.registerHelper(helper.name, helper.fn)
        else
          console.error "helpers not are in incorrect format"

    if gen.partials
      console.log gen.partial
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

    console.log "type of data is Array:", Array.isArray dataParsed
    try
      template = Handlebars.compile(gen.template)
      if Array.isArray dataParsed
        result = []
        for obj in dataParsed
          result.push {name: obj.name, str :template(obj.data)}
        gen.handleRender(result)
      else
        if dataParsed.name and data.parse.data
          gen.hanleRender([{name:dataParsed.name,str: template(dataParsed) }])
        else
          gen.handleRender([template(dataParsed)])
    catch e
      console.log e
  else
    console.error "generator.handleRender not defined"









