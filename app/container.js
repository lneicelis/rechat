var config = require('./config');
var r = require('rethinkdbdash');

var container = {
    r: r(config.rethinkdb)
};

module.exports = container;