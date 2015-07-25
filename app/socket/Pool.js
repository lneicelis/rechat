var r = require('rethinkdbdash')();
var logger = require('../logger');

/**
 * TODO: inject logger, remove hardcoded dependency of r
 * @constructor
 */
var Pool = function () {
    this.connections = [];

    r.table('messages').changes().run({cursor: true}, this.subscribeChanges.bind(this));
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
 * @param {Object} err
 * @param {Object} cursor
 */
Pool.prototype.subscribeChanges = function (err, cursor) {
    (err && logger.error('Error 101', err));

    if (err || !cursor) return;

    cursor.each(function (err, row) {
        (err && logger.error('Error 111', err));

        if (null === row.old_val && row.new_val) {
            this.connections.forEach(function (connection) {
                connection.publishMessage(row.new_val);
            });
        }
    }.bind(this));
};

module.exports = Pool;