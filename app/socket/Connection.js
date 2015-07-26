var logger = require('../logger');
var Message = new (require('../models/Message'))();

/**
 * @param {Object} socket
 * @constructor
 */
var Connection = function (socket) {
    this.socket = socket;
    this.user = null;
    this.groups = null;
};

/**
 * @param {User} user
 * @returns {Promise}
 */
Connection.prototype.connectWith = function (user) {
    return user.getGroups()
        .then(function (groups) {
            this.user = user;
            this.groups = groups.map(function (group) {
                return group.id;
            });

            this.socket.on('messages:post', this.postMessage.bind(this));
            logger.debug('%s have joined the chat.', this.user.username);
            logger.debug('%s allowed to write to groups:', this.groups);
        }.bind(this));
};

Connection.prototype.disconnect = function () {
    this.socket.removeListener('messages:post', this.postMessage.bind(this));
    logger.debug(this.user.username + ' have left the chat.');
};

/**
 * @param {Object} data
 */
Connection.prototype.postMessage = function (data) {
    if (!data || !data.groupId || this.groups.indexOf(data.groupId) < 0) {
        logger.debug('Error: User cannot write to this group');

        return;
    }

    Message.insert({
        groupId: data.groupId,
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