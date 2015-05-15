var thinky = require('thinky')();
var type = thinky.type;

var User = thinky.createModel('User', {
    'username': type.string(),
    'external_id': type.string()
});

module.exports = User;