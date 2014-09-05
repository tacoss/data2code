var Handlebars;

Handlebars = require("handlebars");

module.exports.process = function(data, gen) {
  var dataParsed, e, helper, obj, partial, result, template, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
  if (gen.handleRender && typeof gen.handleRender === 'function') {
    if (gen.helpers && gen.helpers instanceof Array) {
      _ref = gen.helpers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        helper = _ref[_i];
        if (helper.name && helper.fn && typeof helper.fn === 'function') {
          Handlebars.registerHelper(helper.name, helper.fn);
        } else {
          console.error("helpers not are in incorrect format");
        }
      }
    }
    if (gen.partials) {
      _ref1 = gen.partials;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        partial = _ref1[_j];
        if (partial.name && partial.str) {
          Handlebars.registerPartial(partial.name, partial.str);
        }
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
      for (_k = 0, _len2 = dataParsed.length; _k < _len2; _k++) {
        obj = dataParsed[_k];
        if (obj.name && obj.model) {
          result.push({
            name: obj.name,
            content: template(obj.model)
          });
        } else {
          throw new Error("Data element doesn't have name or model please");
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
