/* global require */

var logger = require('../logger');

/**
 * @constructor
 */
var Pool = function () {
    this.connections = [];
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

module.exports = Pool;