var _ = require('lodash');
var Model = require('./Model');

var Group = function () {
    this.table = 'groups';
};

Group.prototype = Object.create(Model.prototype);
Group.prototype.constructor = Group;

module.exports = Group;