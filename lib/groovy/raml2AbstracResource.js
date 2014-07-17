(function() {
  var commonHelpers, fs;

  fs = require('fs');

  commonHelpers = require("../helpers/common.js").helpers();

  module.exports.generator = function() {
    var capitalize, generator, parseResource;
    capitalize = function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
    generator = {};
    generator.helpers = commonHelpers;
    generator.helpers.push({
      name: "parseSchema",
      fn: function(context, options) {
        var schema;
        schema = JSON.parse(this.schema);
        console.log(schema);
        return options.fn(schema);
      }
    });
    generator.template = fs.readFileSync(__dirname + "/AbstractResource.hbs").toString();
    generator.parser = function(data) {
      var p, parsed, r, _i, _j, _len, _len1, _ref;
      parsed = [];
      _ref = data.resources;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        r = _ref[_i];
        parseResource(r, parsed);
      }
      for (_j = 0, _len1 = parsed.length; _j < _len1; _j++) {
        p = parsed[_j];
        if (data.extra) {
          p.model.extra = data.extra;
        }
      }
      return parsed;
    };
    parseResource = function(data, parsed, parentUri) {
      var model, r, _i, _len, _ref, _ref1;
      if (parentUri == null) {
        parentUri = "";
      }
      model = {};
      model.className = "" + data.displayName + (capitalize(data.type)) + "Resource";
      model.classDescription = data.description;
      model.uri = "" + parentUri + data.relativeUri;
      model.classMethods = data.methods;
      model.relativeUriPathSegments = data.relativeUriPathSegments;
      model.methods = data.methods;
      model.classDescription = (_ref = data.description) != null ? _ref : "";
      if (data.resources) {
        _ref1 = data.resources;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          r = _ref1[_i];
          parseResource(r, parsed, model.uri);
        }
      }
      return parsed.push({
        name: "" + model.className + ".groovy",
        model: model
      });
    };
    return generator;
  };

}).call(this);
