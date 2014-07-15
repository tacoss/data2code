(function() {
  var data2code, gen, generators, genm, program, _i, _len, _ref;

  program = require('commander');

  data2code = require("./data2code.js");

  if (require.main === module) {
    program.usage('[options] [RAML input file]').option('-i, --input [input]', 'RAML input file').option('-g, --generators [generators]', 'Generator modules comma separated').option('-o, --outputDir [outputDir]', 'Output Dir').parse(process.argv);
    console.log(program.input);
    if (!(program.input && program.generators && program.outputDir)) {
      console.error("Error: You need to specify all parameters");
      program.help();
      process.exit(1);
    }
    generators = [];
    _ref = program.generators.split(",");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      gen = _ref[_i];
      genm = require(gen);
      console.log(genm);
      generators.push(genm);
    }
    raml.loadFile("./test/cats.raml").then((function(data) {
      var _j, _len1;
      for (_j = 0, _len1 = generators.length; _j < _len1; _j++) {
        gen = generators[_j];
        data2Code.process(data, gen);
      }
    }), function(error) {
      console.log("Error parsing: " + error);
    });
  }

}).call(this);
