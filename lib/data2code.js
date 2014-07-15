(function() {
  var Handlebars, fs;

  Handlebars = require("handlebars");

  fs = require('fs');

  module.exports.process = function(data, gen) {
    var dataParsed, helper, partial, template, _i, _j, _len, _len1, _ref, _ref1;
    if (gen.handleRender && typeof gen.handleRender === 'function') {
      template = Handlebars.compile(gen.template);
      if (gen.helpers && gen.helpers instanceof Array) {
        _ref = gen.helpers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          helper = _ref[_i];
          if (helper.name && helper.fn && typeof helper.fn === 'function') {
            Handlebars.registerHelper(helper.name, helper.fn);
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
        dataParsed = gen.parser(data);
      } else {
        dataParsed = data;
      }
      return gen.handleRender(template(dataParsed));
    }
  };

}).call(this);
