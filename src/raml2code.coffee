program = require('commander')
data2code = require("./data2code.js")

if  require.main is module
  program
  .usage('[options] [RAML input file]')
  .option('-i, --input [input]', 'RAML input file')
  .option('-g, --generators [generators]', 'Generator modules comma separated')
  .option('-o, --outputDir [outputDir]', 'Output Dir')
  .parse(process.argv)

  console.log program.input
  if not (program.input  and program.generators and program.outputDir)
    console.error "Error: You need to specify all parameters"
    program.help()
    process.exit(1)

  generators = []
  for gen in program.generators.split(",")
    genm = require(gen)
    console.log genm
    generators.push genm


  raml.loadFile("./test/cats.raml").then ((data) ->

    for gen in generators
      data2Code.process data, gen
    return
  ), (error) ->
    console.log "Error parsing: " + error
    return

