module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      files: {
        expand: true,
        flatten: true,
        src: 'src/*.coffee',
        dest: 'lib',
        ext: '.js'
      }
    },
    watch: {
      coffee: {
        files: ['src/*.coffee'],
        tasks: ['test']
      }
    },
    coffeelint: {
      options: {
        max_line_length: {
          level: 'ignore'
        }
      },
      app: ['src/*.coffee']
    },
    mochacli: {
      options: {
        require: ['chai', 'chai-as-promised'],
        reporter: 'dot',
        bail: true,
        growl: true,
        grep: grunt.option('grep') || ''
      },
      all: ['test/specs/*.js']
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
