/* global require */
/* global describe, it, beforeEach */

var utils = require('../utils/index');
var supertest = require('supertest');
var expect = require('expect.js');
var io = require('socket.io-client');
var User = require('../../app/models/User');
var Message = require('../../app/models/Message');
var Group = require('../../app/models/Group');

describe('Socket IO communication', function () {
    var socket, request, token;

    request = supertest('http://127.0.0.1:3000');

    beforeEach(function (done) {
        utils.dbTruncateTables()
            .then(function () {
                return require('./fixtures/messages')(utils.fixturesManager);
            })
            .then(function () {
                done();
            }, function (err) {
                console.log('Unable to load fixtures', err);
            });
    });

    describe('Post message to a group', function() {
        beforeEach(function (done) {
            getToken().then(function (params) {
                socket = io('http://127.0.0.1:3000?token=' + params.token, {
                    'force new connection': true
                });

                socket.on('connect', function() {
                    console.log('Socket connected...');
                    done();
                });
                socket.on('disconnect', function() {
                    console.log('Socket disconnected...');
                });
            });
        });

        afterEach(function(done) {
            // Cleanup
            if(socket.connected) {
                console.log('disconnecting...');
                socket.disconnect();
            } else {
                // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
                console.log('no connection to break...');
            }
            done();
        });

        it('should not be able to write new message - no group specified', function (done) {
            socket.emit('messages:post', {
                message: 'Some message to nowhere'
            });

            Message().query().run().then(function (rows) {
                expect(rows.length).to.be(0);
                done();
            });
        });

        it('should not able to write new message - not in a group', function (done) {
            socket.emit('messages:post', {
                groupId: 'group321',
                message: 'Some message to nowhere'
            });

            Message().query().run().then(function (rows) {
                expect(rows.length).to.be(0);
                done();
            });
        });

        it('should be able to write new message user is in a group before connection', function (done) {
                socket.emit('messages:post', {
                    groupId: 'group123',
                    message: 'Some message to nowhere'
                });

                // TODO: figure out a better way than setTimeout
                setTimeout(function () {
                    Message().query().run().then(function (rows) {
                        expect(rows.length).to.be(1);
                        done();
                    });
                }, 200)
        });

        it('should be able to write new message when user added after connected', function (done) {
            (new Group).find('group321')
                .then(function (group) {
                    return group.addUser({id: 'user123'});
                })
                .then(function () {
                    socket.emit('messages:post', {
                        groupId: 'group123',
                        message: 'Some message to nowhere'
                    });

                    // TODO: figure out a better way than setTimeout
                    setTimeout(function () {
                        Message().query().run().then(function (rows) {
                            expect(rows.length).to.be(1);
                            done();
                        });
                    }, 200)
                });
        });
    });


    function getToken () {
        var userId = 'user123';

        return new Promise(function (resolve, reject) {
            request
                .get('/users/' + userId + '/token')
                .set('x-token', 'MySecret')
                .expect(200)
                .end(function (err, res) {
                    if (err) reject(err);

                    resolve({
                        userId: userId,
                        token: res.body.data.token
                    });
                });
        });
    }
});