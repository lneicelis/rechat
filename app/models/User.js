var Model = require('./Model');
var config = require('../config');
var r = require('rethinkdbdash')(config.rethinkdb);

var User = function (data) {
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