fs = require('fs')
module.exports.generator = ->
  generator = {}
  generator.helpers = []
  generator.helpers.push {name:'debug', fn: (optionalValue)->
    console.log "Current Context"
    console.log "===================="
    console.log this
    if optionalValue
      console.log "Value"
      console.log "===================="
      console.log optionalValue
    return
  }

  generator.helpers.push {name:'parseSchema', fn: (context, options) ->
    schema = JSON.parse(this.schema)
    console.log schema
    return options.fn(schema)
  }

  capitalize = (str)->
    str.charAt(0).toUpperCase() + str.slice(1)

  generator.parser = (datos) ->

    if not datos
      console.error "no data defined"
      return

    parsed = []
    for row in datos.schemas
      for schemaName of row
        data = JSON.parse(row[schemaName])
        model = {}
        model.className = data.title
        model.classMembers = []
        model.classDescription = data.description ? ""

        if data.type is "array"
          ref = data.items['$ref'].replace("#/", "")
          ref = capitalize(ref)
          model.classMembers.push {name: "items", type: "List<#{ref}>"}
        for key of data.properties
          p = data.properties[key]
          property = {}
          property.name = key
          property.comment =  p.description
          switch p.type
            when 'array'
              property.type = "List"
              property.name = "items"
            when 'string' then property.type = "String"
            when 'boolean' then property.type = "Boolean"
            when 'Number' then property.type = "Double"
            when 'integer' then property.type = "Integer"

          model.classMembers.push property
        model.extra = datos.extra if datos.extra
        parsed.push {name: capitalize("#{schemaName}.groovy") , data:model}


    parsed

  generator.template = fs.readFileSync(__dirname + "/dto.hbs").toString()

  generator

