var Model = require('./Model');

var Message = function () {
    this.describe({
        table: 'messages',
        readable: ['id']
    });
};

Message.prototype = Model.prototype;
Message.prototype.constructor = Message;

module.exports = Message;