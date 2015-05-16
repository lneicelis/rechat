var config = require('../../config');
var User = require('../../models/User');
var jwt = require('jsonwebtoken');

exports.listUsers = function *listUsers () {
    var users = yield User.getJoin().run();

    this.respond(users);
};

exports.getUser = function *getUser () {
    var user = yield User.get(this.params.userId).run();

    this.respond(user);
};

exports.createUser = function *createUser () {
    var user = new User(this.request.body);

    user = yield user.saveAll();

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

    this.respond({success: user.isSaved()});
};

exports.getAuthorizationToken = function *getAuthorizationToken () {
    var user = yield User.get(this.params.userId).run();
    var token = jwt.sign({userId: user.id}, config.secret);
    user.merge({token: token, tokenUpdatedAt: (new Date).getTime()}).save();

    this.respond({token: token});
};