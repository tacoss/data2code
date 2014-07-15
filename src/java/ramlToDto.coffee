fs = require('fs')

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

generator.parser = (data) ->
  model = {}
  model.className = data.title
  model.classMembers = []
  model.classDescription = data.description

  if data.type is "array"
    ref = data.items['$ref'].replace("#/", "")
    ref = ref.charAt(0).toUpperCase() + ref.slice(1)

  model.classMembers.push {name: "items", type: "List<#{ref}>"}
  for key of data.properties
    p = data.properties[key]
    property = {}
    property.name = key
    switch p.type
      when 'array'
        property.type = "List"
        property.name = "items"
      when 'string' then property.type = "String"
      when 'boolean' then property.type = "Boolean"
      when 'Number' then property.type = "Double"
      when 'integer' then property.type = "Integer"
  property.comment = p.description
  model.classMembers.push property

  model

generator.template = require('./lib/java/dto.hbs')

module.export = generator
