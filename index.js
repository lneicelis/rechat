var config = require('./app/config');
var koa = require('koa');
var app = koa();
var r = require('rethinkdbdash')();

app.use(function * () {
    var users =  r.db('chat').table('users').changes().run(function (error, cursor) {
        console.log(cursor.length);
    });
    this.response.type = 'application/json';
    this.response.body = users;
});

app.listen(config.api.port);
