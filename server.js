var connect = require('connect');
var serveStatic = require('serve-static');

var contentDir = __dirname + '/content/';

connect().use(serveStatic(contentDir)).listen(8080);
