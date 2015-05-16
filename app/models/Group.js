var thinky = require('thinky')();
var type = thinky.type;
var User = require('./User');

var Group = thinky.createModel('groups', {
    title: type.string()
});

Group.hasAndBelongsToMany(User, 'groups_users', 'group_id', 'user_id');

module.exports = Group;