module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'src/generators', src: ['*.hbs',  '**/*.hbs'], dest: 'lib/generators', filter: 'isFile'}
        ]
      }
    },
    coffee: {
      compile : {
        files: {
         'lib/data2code.js' : 'src/data2code.coffee',
        }
      }

    },
    watch: {
      coffee: {
        files: ['src/*.coffee', 'src/**/*.coffee', 'src/**/*.hbs' ],
        tasks: ['copy', 'test']
      },
      test: {
        files: ['test/*.js'],
        tasks: ['copy','test']
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
    },
   clean: {
     build: ["lib"]
   }


  });

  grunt.registerTask('compile', [
    'coffeelint',
    'coffee'
  ]);


  grunt.registerTask('build', [
    'clean',
    'compile',
    'copy'
  ]);

  grunt.registerTask('test', [
   'build',
   'mochacli'
  ]);

  grunt.registerTask('default', [
    'build', 'watch'
  ]);

};
