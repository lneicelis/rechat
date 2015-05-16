var app = require('koa')();
var middilewares = require('.//middlewares');
var router = require('./routes')();

module.exports = {
    boot: boot
};

function boot (http) {
    middilewares(app);

    app.use(router.routes());
    app.use(router.allowedMethods());

    return http.Server(app.callback());
}