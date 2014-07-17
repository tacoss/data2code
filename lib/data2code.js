(function() {
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
        console.log(gen.partial);
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
      try {
        template = Handlebars.compile(gen.template);
        if (Array.isArray(dataParsed)) {
          result = [];
          for (_k = 0, _len2 = dataParsed.length; _k < _len2; _k++) {
            obj = dataParsed[_k];
            result.push({
              name: obj.name,
              str: template(obj.model)
            });
          }
          return gen.handleRender(result);
        } else {
          if (dataParsed.name && dataParsed.model) {
            return gen.hanleRender([
              {
                name: dataParsed.name,
                str: template(dataParsed.model)
              }
            ]);
          } else {
            return gen.handleRender([template(dataParsed)]);
          }
        }
      } catch (_error) {
        e = _error;
        return console.log(e);
      }
    } else {
      return console.error("generator.handleRender not defined");
    }
  };

}).call(this);
