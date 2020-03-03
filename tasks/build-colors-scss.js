'use strict';

module.exports = function(grunt) {
    var path = require('path');
    var ejs = require('ejs');
    
    grunt.registerMultiTask('buildColors', 'Read palette json and generate SCSS files', function() {
        
        var self = this;
        var src = grunt.config.get('pkg').src.colors;

        grunt.log.write(grunt.config.get('pkg').src.colors);
        

        grunt.file.expand(src).forEach( function (filePath) {
            var json = grunt.file.readJSON(filePath);
            var flatPalette = flattenPalette(json);
            
            writeSCSSFiles(flatPalette);
        });
    });
        
    function writeSCSSFiles(palette) {
        var template = grunt.file.read('./tasks/build-colors-scss.html');
        var result = ejs.render(template, palette)
        grunt.file.write('./src/scss/'+ palette.name +'.scss', result);
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