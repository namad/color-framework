'use strict';

module.exports = function(grunt) {
    var path = require('path');
    var ejs = require('ejs');
    var themes = {};
    var tokenFile = {};
    
    
    grunt.registerMultiTask('buildTokens', 'Read palette json and generate SCSS files', function() {
        var tokensFile = grunt.config.get('pkg').colors.tokens;
        var dest = grunt.config.get('pkg').colors.dest;

        grunt.file.expand(tokensFile).forEach((filePath) => {
            tokenFile = extendTokens(grunt.file.readJSON(filePath));
        });

        grunt.file.write("./dist/tokens.json", JSON.stringify(tokenFile));

    });
    
    function extendTokens(json) {
        // accent colors
        let primaryAcent = json.common.theme.accent.primary.value;
        let secondaryAcent = json.common.theme.accent.secondary.value;

        for(let a = 1, b = 6; a <= b; a++) {
            let i = `${a}00`
            json.common.accent.primary[i] = {
                "value": `$accent.${primaryAcent}.${i}`,
                "type": "color"                
            }
        }

        return json;

    }

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
        var template = grunt.file.read('./tasks/build-colors-scss.html');
        var result = ejs.render(template, palette);
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