fs = require('fs')
commonHelpers = require("../helpers/common.js").helpers()

module.exports.generator = ->
  generator = {}
  generator.helpers = commonHelpers

  generator.template = fs.readFileSync(__dirname + "/dto.hbs").toString()

  generator