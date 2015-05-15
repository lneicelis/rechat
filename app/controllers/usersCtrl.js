var User = require('../models/User');

exports.listUsers = function *listUsers () {
    var users = yield User.run();

    this.respond(users);
};

exports.getUser = function *getUser () {
    var user = yield User.get(this.params.userId).run();

    this.respond(user);
};

exports.createUser = function *createUser () {
    var user = new User(this.request.body);

    user = yield user.save();

    this.respond(user);
};

exports.updateUser = function *updateUser () {
    var user = yield User.get(this.params.userId).run();

    user = yield user.merge(this.request.body).save();

    this.respond(user);
};

exports.deleteUser = function *deleteUser () {
    var user = yield User.get(this.params.userId).run();

    user = yield user.delete();

    this.respond({success: !user.isSaved()});
};