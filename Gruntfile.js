/*global module:false*/
module.exports = function (grunt) {

  grunt.loadTasks('./tasks');

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
    //   '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
    //   '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
    //   '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
    //   ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // // Task configuration.
    sass: {
      dist: { // Target
        options: { // Target options
          style: 'expanded'
        },
        files: { // Dictionary of files
          'dist/css/main.css': 'src/scss/main.scss'
        }
      }
    },
    watch: {
      sass: {
        files: '**/*.scss',
        tasks: ['sass']
      }
    },
    buildColors: {
      task: {
        src: './color-palettes/*.json',
        filter: 'isFile'
      }
    },
    buildTokens: {
      task: {
        src: './color-palettes/*.json',
        filter: 'isFile'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');

  // Default task.
  grunt.registerTask('old', ['buildColors', 'sass']);
  grunt.registerTask('default', ['buildTokens']);

};