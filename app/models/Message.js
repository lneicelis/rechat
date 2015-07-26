var Model = require('./Model');

var Message = function () {
    if (!(this instanceof Message)) {
        return new Message();
    }

    this.describe({
        table: 'messages',
        readable: ['id']
    });
};

Message.prototype = Model.prototype;
Message.prototype.constructor = Message;

module.exports = Message;