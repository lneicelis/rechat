/* global require */

var config = require('../app/config');
var r = require('rethinkdbdash')(config.rethinkdb);

r.dbList().run().then(function (array) {
    if (array.indexOf(config.rethinkdb.db) > -1) {
        console.log('Table already exists');
        process.exit(1);
    }

    var promise = Promise.all([
        r.dbCreate(config.rethinkdb.db).run(),
        r.db(config.rethinkdb.db).tableCreate('users').run(),
        r.db(config.rethinkdb.db).tableCreate('groups').run(),
        r.db(config.rethinkdb.db).tableCreate('groups_users').run()
    ]);

    promise.then(function () {
        console.log('Tables successfully created');
        process.exit();
    }, function (err) {
        console.log('Failed while creating tables', err);
        process.exit(err);
    });
}, function (err) {
    console.log(err);
    process.exit();
});