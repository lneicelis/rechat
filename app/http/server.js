var app = require('koa')();
var middilewares = require('.//middlewares');
var router = require('./routes')();

middilewares(app);

app.use(router.routes());
app.use(router.allowedMethods());
require('rethinkdbdash')({db: require('../config').rethinkdb.db});

module.exports = {
    app: app,
    boot: boot
};

function boot (http) {

    return http.Server(app.callback());
}