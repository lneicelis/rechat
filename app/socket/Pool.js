var config = require('../config');
var r = require('rethinkdbdash')(config.rethinkdb);
var logger = require('../logger');

/**
 * TODO: inject logger, remove hardcoded dependency of r
 * @constructor
 */
var Pool = function () {
    this.connections = [];

    r.table('messages').changes().run({cursor: true}, this.subscribeMessagesChanges.bind(this));
    r.table('groups_users').changes().run({cursor: true}, this.subscribeGroupsUsersChanges.bind(this));
};

/**
 *
 * @param {Connection} connection
 * @returns {Pool}
 */
Pool.prototype.addConnection = function (connection) {
    this.connections.push(connection);

    logger.debug('Current connection count: ' + this.connections.length);

    return this;
};

/**
 * @param {Connection} connection
 * @returns {Pool}
 */
Pool.prototype.removeConnection = function (connection) {
    var index = this.connections.indexOf(connection);

    if (index >= 0) {
        this.connections.splice(index, 1);
        connection.disconnect();
    }

    logger.debug('Current connection count: ' + this.connections.length);

    return this;
};

/**
 * TODO: move this logic somewhere else
 *
 * @param {Object} err
 * @param {Object} cursor
 */
Pool.prototype.subscribeMessagesChanges = function (err, cursor) {
    (err && logger.error('Error 101', err));

    if (err || !cursor) return;

    logger.debug('Connection pool have subscribed to messages changes');

    cursor.each(function (err, row) {
        (err && logger.error('Error 111', err));

        logger.debug('Message received by cursor');

        if (null === row.old_val && row.new_val) {
            this.connections.forEach(function (connection) {
                logger.debug('Publishing message to connections');
                connection.publishMessage(row.new_val);
            });
        }
    }.bind(this));
};

Pool.prototype.subscribeGroupsUsersChanges = function (err, cursor) {
    (err && logger.error('Error 102', err));

    if (err || !cursor) return;

    logger.debug('Connection pool have subscribed to groups users changes');

    cursor.each(function (err, row) {
        (err && logger.error('Error 111', err));

        logger.debug('Message received by cursor');

        console.log(row);
        if (null === row.old_val && row.new_val) {
            this.connections.forEach(function (connection) {
                logger.debug('Publishing message to connections');
                connection.joinedGroup(row.new_val.userId, row.new_val.groupId);
            });
        }
    }.bind(this))
};

module.exports = Pool;