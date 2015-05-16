var router = require('koa-router')();
var koaBody = require('koa-body')();
var usersCtrl = require('./controllers/usersCtrl');

module.exports = function appRoutes () {
    router.get('/users', koaBody, usersCtrl.listUsers);
    router.get('/users/:userId', koaBody, usersCtrl.getUser);
    router.get('/users/:userId/token', koaBody, usersCtrl.getAuthorizationToken);
    router.post('/users', koaBody, usersCtrl.createUser);
    router.put('/users/:userId', koaBody, usersCtrl.updateUser);
    router.delete('/users/:userId', koaBody, usersCtrl.deleteUser);

    return router;
};