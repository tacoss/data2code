(function() {
  var Handlebars, fs, parse, parseResources, parseSchemaToJava, parseSchemas, raml;

  raml = require("raml-parser");

  Handlebars = require("handlebars");

  fs = require('fs');

  Handlebars.registerHelper("debug", function(optionalValue) {});

  Handlebars.registerHelper("debug", function(optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);
    if (optionalValue) {
      console.log("Value");
      console.log("====================");
      console.log(optionalValue);
    }
  });

  Handlebars.registerHelper("parseSchema", function(context, options) {
    var schema;
    schema = JSON.parse(this.schema);
    console.log(schema);
    return options.fn(schema);
  });

  raml.loadFile("cats.raml").then((function(data) {
    parseSchemas(data.schemas);
  }), function(error) {
    return console.log("error parsing: " + error);
  });

  parse = function(data) {};

  parseSchemas = function(s) {
    var data, key, resourceHbs, schema, _i, _len, _results;
    schema = {};
    for (_i = 0, _len = s.length; _i < _len; _i++) {
      data = s[_i];
      for (key in data) {
        schema[key] = JSON.parse(data[key]);
      }
    }
    resourceHbs = require('./../test/templates/schema.hbs');
    _results = [];
    for (key in schema) {
      _results.push(console.log(resourceHbs(parseSchemaToJava(schema[key]))));
    }
    return _results;
  };

  parseSchemaToJava = function(data) {
    var key, model, p, property, ref;
    model = {};
    model.className = data.title;
    model.classMembers = [];
    model.classDescription = data.description;
    if (data.type === "array") {
      ref = data.items['$ref'].replace("#/", "");
      ref = ref.charAt(0).toUpperCase() + ref.slice(1);
      model.classMembers.push({
        name: "items",
        type: "List<" + ref + ">"
      });
    }
    for (key in data.properties) {
      p = data.properties[key];
      property = {};
      property.name = key;
      switch (p.type) {
        case 'array':
          property.type = "List";
          property.name = "items";
          break;
        case 'string':
          property.type = "String";
          break;
        case 'boolean':
          property.type = "Bolean";
          break;
        case 'Number':
          property.type = "Double";
          break;
        case 'integer':
          property.type = "Integer";
      }
      property.comment = p.description;
      model.classMembers.push(property);
    }
    return model;
  };

  parseResources = function(r) {
    var resourceHbs;
    resourceHbs = require('./../test/templates/resource.hbs');
    return console.log(resourceHbs(r));
  };

}).call(this);
