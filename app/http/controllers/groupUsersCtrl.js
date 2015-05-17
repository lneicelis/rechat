var Group = new (require('../../models/Group'))();
var User = new (require('../../models/User'))();

exports.getGroupUsers = function *getGroupUsers () {
    var users = yield Group.getUsers(this.params.groupId);

    this.respond(users);
};

exports.addGroupUser = function *addGroupUser () {
    var group = yield Group.find(this.params.groupId);
    var user = yield User.find(this.params.userId);

    var result = yield group.addUser(user);

    this.respond(result);
};

exports.removeGroupUser = function *removeGroupUser () {
    var group = yield Group.find(this.params.groupId);
    var user = yield User.find(this.params.userId);

    var result = yield group.removeUser(user);

    this.respond(result);
};