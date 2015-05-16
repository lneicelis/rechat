var Model = require('./Model');

var User = function () {
    this.table = 'users';
    this.fillable = ['username', 'token', 'external_id']

    if (!this instanceof User) {
        return new User();
    }
};

User.prototype = Object.create(Model.prototype);
User.prototype.constructor = User;

module.exports = User;