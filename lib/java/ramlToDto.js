(function() {
  var fs, generator;

  fs = require('fs');

  generator = {};

  generator.helpers = [];

  generator.helpers.push({
    name: 'debug',
    fn: function(optionalValue) {
      console.log("Current Context");
      console.log("====================");
      console.log(this);
      if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
      }
    }
  });

  generator.helpers.push({
    name: 'parseSchema',
    fn: function(context, options) {
      var schema;
      schema = JSON.parse(this.schema);
      console.log(schema);
      return options.fn(schema);
    }
  });

  generator.parser = function(data) {
    var key, model, p, property, ref;
    model = {};
    model.className = data.title;
    model.classMembers = [];
    model.classDescription = data.description;
    if (data.type === "array") {
      ref = data.items['$ref'].replace("#/", "");
      ref = ref.charAt(0).toUpperCase() + ref.slice(1);
    }
    model.classMembers.push({
      name: "items",
      type: "List<" + ref + ">"
    });
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
          property.type = "Boolean";
          break;
        case 'Number':
          property.type = "Double";
          break;
        case 'integer':
          property.type = "Integer";
      }
    }
    property.comment = p.description;
    model.classMembers.push(property);
    return model;
  };

  generator.template = require('./lib/java/dto.hbs');

  module["export"] = generator;

}).call(this);
