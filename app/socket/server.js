var config = require('../config');
var socketio = require('socket.io');
var jwt = require('jsonwebtoken');
var User = new (require('../models/User'))();
var Pool = require('./Pool');
var Connection = require('./Connection');

module.exports = {
    attachTo: attachSocket
};

function attachSocket (server) {
    var io = socketio(server);
    var pool = new Pool();

    io.on('connection', function (socket) {
        var token = socket.handshake.query.token;
        var claim = jwt.decode(token, config.secret);
        var connection;

        console.log('>>>> user Connected!');
        if (null === jwt.decode(token, config.secret)) {
            console.log('not authorized!');

            return;
        }

        connection = new Connection(socket);

        User.find(claim.userId).then(function (user) {
            connection.joinChat(user.getProps());
            pool.addConnection(connection);
        }, function () {
            connection = null;
        });

        socket.on('disconnect', function () {
            pool.removeConnection(connection);
            connection = null;
        });
    });
}