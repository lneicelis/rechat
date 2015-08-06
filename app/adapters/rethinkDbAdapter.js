/* globals require, module*/

var r = require('../container').r;
var Rx = require('rx');

var messagesRows = Rx.Observable.create(function (observer) {
    try {
        r.table('messages').changes()
            .run({cursor: true}, function (err, cursor) {
                if (err) {
                    observer.onError(err);

                    return;
                }

                cursor.next(function (err, row) {
                    if (err) {
                        observer.onError(err);

                        return;
                    }

                    observer.onNext(row);
                });
            })
    } catch (error) {
        observer.onError(error)
    }
});

var groupsUsersRows = Rx.Observable.create(function (observer) {
    try {
        r.table('groups_users').changes()
            .run({cursor: true}, function (err, cursor) {
                if (err) {
                    observer.onError(err);

                    return;
                }

                cursor.next(function (err, row) {
                    if (err) {
                        observer.onError(err);

                        return;
                    }

                    observer.onNext(row);
                });
            })
    } catch (error) {
        observer.onError(error)
    }
});

var adapter = {
    newMessages: messagesRows
        .filter(function (row) {
            return null === row.old_val && row.new_val;
        })
        .map(function (row) {
            return row.new_val;
        }),
    addedUsers: groupsUsersRows
        .filter(function (row) {
            return null === row.old_val && row.new_val;
        })
        .map(function (row) {
            return row.new_val;
        }),
    removedUsers: groupsUsersRows
        .filter(function (row) {
            return null === row.new_val && row.old_val;
        })
        .map(function (row) {
            return row.old_val;
        })
};

module.exports = adapter;