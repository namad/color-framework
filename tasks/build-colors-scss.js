'use strict';

module.exports = function(grunt) {
    var path = require('path');
    var ejs = require('ejs');
    
    grunt.registerMultiTask('buildColors', 'Read palette json and generate SCSS files', function() {
        
        var self = this;
        var src = grunt.config.get('pkg').colors.src;
        var dest = grunt.config.get('pkg').colors.dest;

        grunt.file.expand(src).forEach( function (filePath) {
            var json = grunt.file.readJSON(filePath);
            var flatPalette = flattenPalette(json);
            
            writeSCSSFiles(flatPalette, dest);
        });
    });
        
    function writeSCSSFiles(palette, dest) {
        var template = grunt.file.read('./tasks/build-colors-scss.html');
        var result = ejs.render(template, palette)
        grunt.file.write(`${dest}/_${palette.name}.scss`, result);
    }

    function flattenPalette(paletteJSON) {
        var results = [];

        paletteJSON.colorTypes.forEach(function(colorType) {
            colorType.colorCategories.forEach(function(colorCategory) {
                colorCategory.colors.forEach(function(color){
                    var name = [colorType.name, colorCategory.name, color.name]
                    results.push({
                        name: name.join('-'),
                        value: color.color
                    })
                })
            })
        });

        return {
            name: paletteJSON.name,
            colors: results
        };
    }

};