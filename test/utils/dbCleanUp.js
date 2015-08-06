/* global require */

var config = require('../../app/config');
var co = require('co');
var r = require('rethinkdbdash')(config.rethinkdb);

module.exports = function () {
    return co(function* () {
        var databases = yield r.dbList().run();
        var tables = ['messages', 'users', 'groups', 'groups_users'];

        if (databases.indexOf(config.rethinkdb.db) > -1) {
            console.log('Dropping database.');
            yield r.dbDrop(config.rethinkdb.db).run();
        }
        console.log('Creating database.');
        yield r.dbCreate(config.rethinkdb.db).run();


        console.log('Creating tables.');
        tables.map(function (table) {
            return r.db(config.rethinkdb.db).tableCreate(table).run();
        });

        yield Promise.all(tables);
        console.log('tables created.');
    });
};