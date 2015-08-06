/* global module, require */

module.exports = function (manager) {
    return Promise.all([
        manager.load('users', [
            {
                id: 'user123',
                username: 'user123'
            }
        ]),
        manager.load('groups', [
            {
                id: 'group123',
                title: 'group123'
            }
        ]),
        manager.load('groups', [
            {
                id: 'group321',
                title: 'group321'
            }
        ]),
        manager.load('groups_users', [
            {
                userId: 'user123',
                groupId: 'group123'
            }
        ])
    ])
};