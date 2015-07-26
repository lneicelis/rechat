var config = require('../config');
var logger = require('../logger');
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

        logger.debug('User Connected!');
        if (null === claim || !claim.userId) {
            logger.warn('not authorized!');

            return;
        }

        logger.debug('User ID: %s', claim.userId);
        User.find(claim.userId).then(function (user) {
            connection = new Connection(socket);

            connection
                .connectWith(user)
                .then(function () {
                    pool.addConnection(connection);

                    socket.on('disconnect', function () {
                        pool.removeConnection(connection);
                        connection = null;
                    });
                });
        }, function (err) {
            logger.warn('User not found! %s', err);
        });
    });
}