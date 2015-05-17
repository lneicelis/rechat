var logger = require('../logger');
var Message = new (require('../models/Message'))();

var Connection = function (socket) {
    this.socket = socket;
};

/**
 * @param {User} user
 */
Connection.prototype.joinChat = function (user) {
    this.user = user;

    logger.debug('%s have joined the chat.', this.user.username);

    this.socket.on('messages:post', this.postMessage.bind(this));
};

Connection.prototype.disconnect = function () {
    logger.debug(this.user.username + ' have left the chat.');
};

/**
 * @param {Object} data
 */
Connection.prototype.postMessage = function (data) {
    Message.insert({
        username: this.user.username,
        message: data.message,
        timestamp: (new Date).getTime()
    });
};

/**
 * @param {Object} message
 */
Connection.prototype.publishMessage = function (message) {
    this.socket.emit('messages:posted', message);
    logger.debug('messages:posted', message);
};

module.exports = Connection;