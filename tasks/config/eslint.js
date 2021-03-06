/**
 * LINT LESS files and generated CSS.
 *
 */
module.exports = function(grunt) {
  grunt.config.set('eslint', {
    dev: {
      src: ['**/*.js', '**/*.jsx', '!node_modules/**/*'],
      options: {
        silent: true, // Do not stop grunt on error
        quiet: true, // Do not display warnings
      },
    },
  });

  grunt.loadNpmTasks('gruntify-eslint');
};
