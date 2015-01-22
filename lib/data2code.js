var Handlebars;

Handlebars = require("handlebars");

module.exports.process = function(data, gen) {
  var dataParsed, e, fn, key, obj, result, template, _i, _len;
  if (gen.handleRender && typeof gen.handleRender === 'function') {
    if (gen.helpers) {
      for (key in gen.helpers) {
        fn = gen.helpers[key];
        if (fn && typeof fn === 'function') {
          Handlebars.registerHelper(key, fn);
        } else {
          console.error("helpers " + key + "is not a function");
        }
      }
    }
    if (gen.partials) {
      for (key in gen.partials) {
        Handlebars.registerPartial(key, gen.partials[key]);
      }
    }
    if (typeof gen.parser === 'function') {
      try {
        dataParsed = gen.parser(data);
      } catch (_error) {
        e = _error;
        console.log("Parser error", e);
      }
    } else {
      dataParsed = data;
    }
    template = Handlebars.compile(gen.template);
    if (Array.isArray(dataParsed)) {
      result = [];
      for (_i = 0, _len = dataParsed.length; _i < _len; _i++) {
        obj = dataParsed[_i];
        if (obj.name && obj.model) {
          result.push({
            name: obj.name,
            content: template(obj.model)
          });
        } else {
          throw new Error("Data element doesn't have name or model");
        }
      }
      return gen.handleRender(result);
    } else {
      throw new Error("Digest data is not and Array");
    }
  } else {
    throw new Error("generator.handleRender not defined");
  }
};
