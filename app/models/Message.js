var thinky = require('thinky')();
var type = thinky.type;

var Message = thinky.createModel('messages', {
    username: type.string().required(),
    message: type.string().required()
});

module.exports = Message;