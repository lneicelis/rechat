var thinky = require('thinky')();
var type = thinky.type;

var User = thinky.createModel('users', {
    username: type.string().required().min(2),
    external_id: type.string()
});

module.exports = User;