var config = require('../../app/config');
var co = require('co');
var r = require('../../app/container').r;

module.exports = function () {
    return co(function* () {
        var tables = yield r.db(config.rethinkdb.db).tableList();
        var promises = [];

        tables.forEach(function (table) {
            console.log('Truncating ' + table);
            promises.push(r.db(config.rethinkdb.db).table(table).delete().run());
        });

        yield Promise.all(promises);
    });
};