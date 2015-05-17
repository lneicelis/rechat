var Model = require('./Model');
var User = require('./User');
var config = require('../config');
var r = require('rethinkdbdash')(config.rethinkdb);

var Group = function (data) {
    this.describe({
        table: 'groups'
    });

    this.fill(data);
};

Group.prototype = Object.create(Model.prototype);
Group.prototype.constructor = Group;

Group.prototype.getUsers = function () {
    var query = r.table("groups_users")
        .filter({groupId: this.id})
        .eqJoin("groupId", r.table("groups")).zip()
        .eqJoin('userId', r.table("users"));

    return this.fetchJoin(query, User);
};

Group.prototype.addUser = function (user) {
    return r.table('groups_users').insert({
        groupId: this.id,
        userId: user.id
    }).run();
};

Group.prototype.removeUser = function (user) {
    return r.table('groups_users').filter({
        groupId: this.id,
        userId: user.id
    }).delete().run();
};

module.exports = Group;