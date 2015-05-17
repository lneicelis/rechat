var Model = require('./Model');

var User = function (data) {
    this.describe({
        table: 'users',
        readable: ['id']
    });

    this.fill(data);
};

User.prototype = Object.create(Model.prototype);
User.prototype.constructor = User;

module.exports = User;