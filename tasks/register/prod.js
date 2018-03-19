module.exports = function (grunt) {
  grunt.registerTask('prod', [
    'copy:swaggercss',
    'replace:api',
    'compileAssets',
    'concat',
    'uglify',
    'cssmin',
    'imagemin',
    'sails-linker:prodJs',
    'sails-linker:prodStyles',
    'sails-linker:devTpl',
    'sails-linker:prodJsJade',
    'sails-linker:prodStylesJade',
    'sails-linker:devTplJade',
    'transifex:grottocenter'
  ]);
};
