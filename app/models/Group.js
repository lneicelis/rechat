var Model = require('./Model');

var Group = function (data) {
    this.describe({
        table: 'groups'
    });

    this.fill(data);
};

Group.prototype = Object.create(Model.prototype);
Group.prototype.constructor = Group;

module.exports = Group;