(function() {
  var data2code, fs, gen, generators, genm, program, raml, writeFile, _i, _len, _ref;

  program = require('commander');

  data2code = require("./data2code.js");

  fs = require('fs');

  raml = require('raml-parser');

  if (require.main === module) {
    program.usage('[options] [RAML input file]').option('-i, --input [input]', 'RAML input file').option('-g, --generators [generators]', 'Generator modules comma separated').option('-o, --outputDir [outputDir]', 'Output Dir').parse(process.argv);
    if (!(program.input && program.generators && program.outputDir)) {
      console.error("Error: You need to specify all parameters");
      program.help();
      process.exit(1);
    }
    generators = [];
    _ref = program.generators.split(",");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      gen = _ref[_i];
      genm = require(gen).generator();
      genm.handleRender = function(results) {
        var result, _j, _len1, _results;
        console.log("raml2code#result ->", results);
        _results = [];
        for (_j = 0, _len1 = results.length; _j < _len1; _j++) {
          result = results[_j];
          if (result.name && result.str) {
            console.log(result);
            _results.push(writeFile("" + program.outputDir + "/" + result.name, result.str));
          } else {
            _results.push(console.log("no name"));
          }
        }
        return _results;
      };
      generators.push(genm);
    }
    writeFile = function(path, content) {
      return fs.writeFile(path, content, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("The file " + path + " was generated!");
        }
      });
    };
    raml.loadFile(program.input).then((function(data) {
      var _j, _len1;
      for (_j = 0, _len1 = generators.length; _j < _len1; _j++) {
        gen = generators[_j];
        data2code.process(data, gen);
      }
    }), function(error) {
      console.log("Error parsing: " + error);
    });
  }

}).call(this);
