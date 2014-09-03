var through = require('through2');
var gutil = require('gulp-util');
var data2code = new require('./lib/data2code.js');
var raml = require('raml-parser');

var PluginError = gutil.PluginError;

// consts
const PLUGIN_NAME = 'raml2code';


function process(file, source, self, cb, options){
  console.log(file.path);
  raml.loadFile(file.path).then(function (data) {
    if(options.generator){
      options.generator.handleRender = function(results){
        results.forEach(function(element, index, array){
          if(element.name && element.str){
            var file = new File({
              base: file.base,
                cwd: file.cwd,
                path: gutil.replaceExtension(file.path, element.name),
                contents: new Buffer(code)
            });
            self.push(file)
          }
        });

      }
      var code = data2code.process(data, options.generator);
    }

    cb();

  }, function (error) {
    console.log('Error parsing: ' + error);
    var message = util.format('Parse error%s: %s', error);
    cb(new Error(message));
  });
}



module.exports = function(options){

  var stream = through.obj(function(file, enc, cb) {
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }
    if (file.isBuffer()) {
      return process(file, file.contents, this, cb, options);
    }  
  });
  return stream;
}
