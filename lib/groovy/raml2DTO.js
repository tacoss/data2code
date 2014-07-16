(function() {
  var commonHelpers, fs;

  fs = require('fs');

  commonHelpers = require("../helpers/common.js").helpers();

  module.exports.generator = function() {
    var capitalize, generator;
    generator = {};
    generator.helpers = commonHelpers;
    capitalize = function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
    generator.parser = function(datos) {
      var data, key, model, p, parsed, property, ref, row, schemaName, _i, _len, _ref, _ref1;
      if (!datos) {
        console.error("no data defined");
        return;
      }
      parsed = [];
      _ref = datos.schemas;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        for (schemaName in row) {
          data = JSON.parse(row[schemaName]);
          model = {};
          model.className = data.title;
          model.classMembers = [];
          model.classDescription = (_ref1 = data.description) != null ? _ref1 : "";
          if (data.type === "array") {
            ref = data.items['$ref'].replace("#/", "");
            ref = capitalize(ref);
            model.classMembers.push({
              name: "items",
              type: "List<" + ref + ">"
            });
          }
          for (key in data.properties) {
            p = data.properties[key];
            property = {};
            property.name = key;
            property.comment = p.description;
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
            model.classMembers.push(property);
          }
          if (datos.extra) {
            model.extra = datos.extra;
          }
          parsed.push({
            name: capitalize("" + schemaName + ".groovy"),
            data: model
          });
        }
      }
      return parsed;
    };
    generator.template = fs.readFileSync(__dirname + "/dto.hbs").toString();
    return generator;
  };

}).call(this);