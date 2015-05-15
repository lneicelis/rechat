var config = require('./app/config');
var app = require('koa')();
var middilewares = require('./app/middlewares');
var router = require('./app/routes')();

middilewares(app);

app.use(function *(next) {
    this.response.type = 'text/html';

    yield next;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.api.port);
