raml = require("raml-parser")
Handlebars = require("handlebars")
fs = require('fs')

Handlebars.registerHelper "debug", (optionalValue) ->
Handlebars.registerHelper "debug", (optionalValue) ->
  console.log "Current Context"
  console.log "===================="
  console.log this
  if optionalValue
    console.log "Value"
    console.log "===================="
    console.log optionalValue
  return

Handlebars.registerHelper "parseSchema", (context, options) ->
  schema =  JSON.parse(this.schema)
  console.log schema
  return options.fn(schema)

raml.loadFile("cats.raml").then ((data) ->
  #console.log data
  #parseResources resource for resource in data.resources
  parseSchemas data.schemas
  return
), (error) ->
  console.log "error parsing: " + error


parse = (data) ->


parseSchemas = (s) ->
  schema = {}
  for data in s
    for key of data
      schema[key] = JSON.parse(data[key])
  
  #console.log schema
  resourceHbs = require('./../test/templates/schema.hbs')
  for key of schema
    
    console.log resourceHbs(parseSchemaToJava(schema[key]))


parseSchemaToJava = (data) ->
  model = {}
  model.className = data.title
  model.classMembers = []
  model.classDescription = data.description

  if data.type is "array"
    ref = data.items['$ref'].replace("#/", "")
    ref =  ref.charAt(0).toUpperCase() + ref.slice(1)
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
      when 'boolean' then property.type = "Bolean"
      when 'Number' then property.type = "Double"
      when 'integer' then property.type = "Integer"
    property.comment = p.description
    model.classMembers.push property

  model

parseResources = (r) ->

  resourceHbs = require('./../test/templates/resource.hbs')
  console.log resourceHbs(r)
