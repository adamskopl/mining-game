var SystemJS = require('./jspm_packages/system.js');
var c = require('./config.js');

// loads './app.js' from the current directory
SystemJS.import('./dist/src/*.js').then(function (m) {
    console.warn('ok');
}).catch((err)=>{
    console.warn('ER');
    console.warn(err);
});
