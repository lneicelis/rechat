/* global require */

var config = require('../app/config');
var r= require('rethinkdbdash')(config.rethinkdb);

r.dbList().run().then(function (array) {
    if (array.indexOf(config.rethinkdb.db) === -1) {
        r.dbCreate(config.rethinkdb.db).run();
        r.db(config.rethinkdb.db).tableCreate('users').run();
        r.db(config.rethinkdb.db).tableCreate('groups').run();
        r.db(config.rethinkdb.db).tableCreate('groups_users').run();
    }
});

process.exit();