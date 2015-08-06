/* global require */

var r = require('../container').r;
var Model = require('./Model');

/**
 * @param data
 * @returns {User}
 * @constructor
 */
var User = function (data) {
    if (!(this instanceof User)) {
        return new User(data);
    }

    this.describe({
        table: 'users',
        readable: ['id']
    });

    this.fill(data);
};

User.prototype = Object.create(Model.prototype);
User.prototype.constructor = User;

User.prototype.getGroups = function () {
    var query = r.table("groups_users")
        .filter({userId: this.id})
        .eqJoin('groupId', r.table("groups"));

    return this.fetchJoin(query, User);
};

module.exports = User;