var SystemJS = require('../jspm_packages/system.js');
var c = require('../config.js');

SystemJS.import('dist/test/tests.js').catch((err)=>{
  console.error(err);
});
