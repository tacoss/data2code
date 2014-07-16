module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'src/', src: ['*.hbs', '**/*hbs'], dest: 'lib/', filter: 'isFile'}
        ]
      }
    },
    coffee: {
      compile : {
        files: {
         'lib/data2code.js' : 'src/data2code.coffee',
         'lib/java/ramlToDto.js' : 'src/java/ramlToDto.coffee',
         'lib/raml2code.js' : 'src/raml2code.coffee',
         'lib/helpers/common.js' : 'src/helpers/common.coffee'
        }
      }

    },
    watch: {
      coffee: {
        files: ['src/*.coffee', 'src/**/*.coffee'],
        tasks: ['test']
      },
      test: {
        files: ['test/*.js'],
        tasks: ['test']
      }
    },
    coffeelint: {
      options: {
        max_line_length: {
          level: 'ignore'
        }
      },
      app: ['src/*.coffee', 'src/**/*.coffee']
    },
    mochacli: {
      options: {
        require: ['chai', 'chai-as-promised'],
        reporter: 'dot',
        bail: true,
        growl: true,
        grep: grunt.option('grep') || ''
      },
      all: ['test/*spec.js']
    }


  });

  grunt.registerTask('compile', [
    'coffeelint',
    'coffee'
  ]);


  grunt.registerTask('build', [
    'compile'
  ]);

  grunt.registerTask('test', [
    'compile',
    'mochacli'
  ]);

  grunt.registerTask('default', [
    'build', 'watch'
  ]);

};
