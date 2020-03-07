'use strict';

module.exports = function(grunt) {
    var path = require('path');
    var ejs = require('ejs');
    var themes = {};
    
    grunt.registerMultiTask('buildColors', 'Read palette json and generate SCSS files', function() {
        
        var self = this;
        var src = grunt.config.get('pkg').colors.src;
        var dest = grunt.config.get('pkg').colors.dest;

        grunt.file.expand(src).forEach((filePath, index) => {
            let theme = grunt.file.readJSON(filePath);
            let flat = flattenPalette(theme);
            themes[theme.name] = flat;
        });

        Object.entries(themes).forEach(([name, theme]) => {
            grunt.log.write(`processing ${name} palette, extends: ${theme.extends} \n`);
            if (theme.extends !== null) {
                theme = extendColors(theme, themes[theme.extends]);
            }
            writeSCSSFiles(theme, dest);
        });
    });
    
    function extendColors(target, source) {
        grunt.log.write(`extending ${target.name} palette\n`);
        if(source.extends !== null) {
            source = extendColors(source, themes[source.extends]);
        }
        Object.assign(target.colors, source.colors);
        target.extends = null;
        return target;
    }

    function writeSCSSFiles(palette, dest) {
        // grunt.log.write(`writing ${palette.name} palette, ${palette.colors.length} colors \n`);
        var template = grunt.file.read('./tasks/build-colors-scss.html');
        var result = ejs.render(template, palette);
        // grunt.log.write(result);
        grunt.file.write(`${dest}/_${palette.name}.scss`, result);
        return palette;
    }

    function flattenPalette(paletteJSON) {
        var results = [];

        if(paletteJSON.hasOwnProperty('colorTypes')) {         
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
        }

        return {
            extends: paletteJSON.extends,
            name: paletteJSON.name,
            colors: results
        };
    }

};