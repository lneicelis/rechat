var config = require('./app/config');
var http = require('http');
var apiServer = require('./app/http/server');
var socket = require('./app/socket/server');

var server = apiServer.boot(http);
socket.attachTo(server);

server.listen(config.api.port);
