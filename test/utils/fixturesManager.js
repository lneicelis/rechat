/* global module, require */

var config = require('../../app/config');
var co = require('co');
var r = require('rethinkdbdash')(config.rethinkdb);

module.exports = {
    load: function (table, data) {
        return co(function *() {
            yield r.db(config.rethinkdb.db)
                .table(table)
                .delete();

            yield r.db(config.rethinkdb.db)
                .table(table)
                .insert(data)
                .run()
        });
    }
};

