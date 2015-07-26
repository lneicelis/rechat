/* global require */

var config = require('../../app/config');
var co = require('co');
var r = require('rethinkdbdash')(config.rethinkdb);

module.exports = function () {
    return co(function* () {
        var databases = yield r.dbList().run();
        if (databases.indexOf(config.rethinkdb.db) > -1) {
            console.log('Dropping database.');
            yield r.dbDrop(config.rethinkdb.db).run();
        }
        console.log('Creating database.');
        yield r.dbCreate(config.rethinkdb.db).run();

        console.log('Creating tables.');
        yield r.db(config.rethinkdb.db).tableCreate('messages').run();
        yield r.db(config.rethinkdb.db).tableCreate('users').run();
        yield r.db(config.rethinkdb.db).tableCreate('groups').run();
        yield r.db(config.rethinkdb.db).tableCreate('groups_users').run();
    });
};