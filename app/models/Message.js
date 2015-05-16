var Model = require('./Model');

var Message = function () {
    this.table = 'messages';
    this.fillable = ['username', 'message', 'timestamp'];
};

Message.prototype = Model.prototype;
Message.prototype.constructor = Message;

module.exports = Message;