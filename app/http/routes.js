var router = require('koa-router')();
var koaBody = require('koa-body')();

module.exports = function appRoutes () {

    // Users routes
    var usersCtrl = require('./controllers/usersCtrl');

    router.get('/users', koaBody, usersCtrl.listUsers);
    router.get('/users/:userId', koaBody, usersCtrl.getUser);
    router.get('/users/:userId/groups', koaBody, usersCtrl.getUserGroups);
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

    // Group users routes
    var groupsUsersCtrl = require('./controllers/groupUsersCtrl');
    router.get('/groups/:groupId/users', koaBody, groupsUsersCtrl.getGroupUsers);
    router.post('/groups/:groupId/users/:userId', koaBody, groupsUsersCtrl.addGroupUser);
    router.delete('/groups/:groupId/users/:userId', koaBody, groupsUsersCtrl.removeGroupUser);

    return router;
};