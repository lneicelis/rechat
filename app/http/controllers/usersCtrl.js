var config = require('../../config');
var User = new (require('../../models/User'))();
var jwt = require('jsonwebtoken');

exports.listUsers = function *listUsers () {
    var users = yield User.query().run();

    this.respond(users);
};

exports.getUser = function *getUser () {
    var user = yield User.find(this.params.userId);

    this.respond(user.getProps());
};

exports.createUser = function *createUser () {
    var user = yield User.insert(this.request.body);

    this.respond({userId: user.generated_keys[0]});
};

exports.updateUser = function *updateUser () {
    var user = yield User.find(this.params.userId);

    yield user.update(this.request.body);

    this.respond({});
};

exports.deleteUser = function *deleteUser () {
    var user = yield User.delete(this.params.userId);

    this.respond(user);
};

exports.getAuthorizationToken = function *getAuthorizationToken () {
    var user = yield User.find(this.params.userId);
    var token = jwt.sign({userId: user.id}, config.secret);

    user.update({token: token, tokenUpdatedAt: (new Date).getTime()});

    this.respond({token: token});
};