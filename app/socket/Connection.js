var Message = require('../models/Message');

var Connection = function (socket) {
    this.socket = socket;
};

/**
 * @param {User} user
 */
Connection.prototype.joinChat = function (user) {
    this.user = user;

    console.log(this.user.username + ' have joined the chat.');

    this.socket.on('messages:post', this.postMessage.bind(this));
};

Connection.prototype.disconnect = function () {
    console.log(this.user.username + ' have left the chat.');
};

/**
 * @param {Object} data
 */
Connection.prototype.postMessage = function (data) {
    var message = new Message({
        username: this.user.username,
        message: data.message,
        timestamp: (new Date).getTime()
    });

    message.save();
};

/**
 * @param {Object} message
 */
Connection.prototype.publishMessage = function (message) {
    this.socket.emit('messages:posted', message);
    console.log('messages:posted', message);
};

module.exports = Connection;