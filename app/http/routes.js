var router = require('koa-router')();
var koaBody = require('koa-body')();

module.exports = function appRoutes () {

    // Users routes
    var usersCtrl = require('./controllers/usersCtrl');

    router.get('/users', koaBody, usersCtrl.listUsers);
    router.get('/users/:userId', koaBody, usersCtrl.getUser);
    router.get('/users/:userId/token', koaBody, usersCtrl.getAuthorizationToken);
    router.post('/users', koaBody, usersCtrl.createUser);
    router.put('/users/:userId', koaBody, usersCtrl.updateUser);
    router.delete('/users/:userId', koaBody, usersCtrl.deleteUser);

    // Groups routes
    var groupsCtrl = require('./controllers/groupsCtrl');

    router.get('/groups', koaBody, groupsCtrl.listGroups);
    router.get('/groups/:groupId', koaBody, groupsCtrl.getGroup);
    router.post('/groups', koaBody, groupsCtrl.createGroup);
    router.put('/groups/:groupId', koaBody, groupsCtrl.updateGroup);
    router.delete('/groups/:groupId', koaBody, groupsCtrl.deleteGroup);


    return router;
};