const glob = require('glob');
var systemJS = require('./jspm_packages/system.js');
require('./config.js');

// declaring global to easily provide Phaser mocks using Phaser source code
global.Phaser = {};
global.PIXI = {};

glob("src/**/*.ut.js", null, function (er, files) {
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.
  systemJS.import('./dist/src/phaser-mocks/phaser-mocks.js');
  files.forEach((f) => {
    systemJS.import(`./dist/${f}`).catch((err) => {
      console.error(err);
    });

  });
});
