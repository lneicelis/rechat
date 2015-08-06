/* global require, module*/

var logger = require('../logger');
var Message = new (require('../models/Message'))();
var adapter = require('../adapters/rethinkDbAdapter');

/**
 * @param {Object} socket
 * @constructor
 */
var Connection = function (socket) {
    this.socket = socket;
    this.user = null;
    this.groups = null;

    adapter.newMessages.subscribe(this.publishMessage.bind(this));

    adapter.addedUsers.subscribe(function (groupUser) {
        logger.debug('addedUsers', groupUser);
        this.joinedGroup(groupUser.userId, groupUser.groupId);
    }.bind(this));

    adapter.removedUsers.subscribe(function (groupUser) {
        logger.debug('removedUsers', groupUser);
        this.leftGroup(groupUser.userId, groupUser.groupId);
    }.bind(this));
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
    logger.debug('Trying to post a message to group %s', data.groupId);
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
    logger.debug('Success: User posted a message.');
};

/**
 * @param {Object} message
 */
Connection.prototype.publishMessage = function (message) {
    if (this.groups.indexOf(message.groupId) === -1) {
        return;
    }

    this.socket.emit('messages:posted', message);
};

/**
 * @param {number} userId
 * @param {number} groupId
 */
Connection.prototype.joinedGroup = function (userId, groupId) {
    if (this.user.id === userId && this.groups.indexOf(groupId) === -1) {
        logger.debug('user ' + userId + 'added to group ' + groupId);
        this.groups.push(groupId);
    }

    this.socket.emit('group:userJoined', {
        user: {id: userId},
        group: {id: groupId}
    });
};

/**
 * @param {number} userId
 * @param {number} groupId
 */
Connection.prototype.leftGroup = function (userId, groupId) {
    var index = this.groups.indexOf(groupId);

    if (this.user.id === userId && index > -1) {
        this.groups.splice(index, 1);
    }

    this.socket.emit('group:userLeft', {
        user: {id: userId},
        group: {id: groupId}
    });
};

module.exports = Connection;