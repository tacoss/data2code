var Handlebars;

Handlebars = require("handlebars");

module.exports.process = function(data, gen) {
  var dataParsed, key, obj, options, result, results, template, _i, _len;
  if (gen.handleRender && typeof gen.handleRender === 'function') {
    if (typeof gen.parser === 'function') {
      dataParsed = gen.parser(data);
    } else {
      dataParsed = data;
    }
    if (typeof gen.template !== "function") {
      template = Handlebars.compile(gen.template);
    } else {
      template = gen.template;
    }
    options = {
      helpers: gen.helpers,
      partials: gen.partials
    };
    if (Array.isArray(dataParsed)) {
      results = [];
      for (_i = 0, _len = dataParsed.length; _i < _len; _i++) {
        obj = dataParsed[_i];
        key = Object.keys(obj)[0];
        if (key && obj[key]) {
          result = {};
          result[key] = template(obj[key], options);
          results.push(result);
        } else {
          throw new Error("Data element doesn't have name or model");
        }
      }
      return gen.handleRender(results);
    } else {
      throw new Error("Digest data is not and Array");
    }
  } else {
    throw new Error("generator.handleRender not defined");
  }
};
