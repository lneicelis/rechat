/* global describe, it */
var config = require('../../../app/config');
var apiServer = require('../../../app/http/server');
var superagent = require('supertest');
var expect = require('expect.js');
var r = require('rethinkdbdash')(config.rethinkdb);

function request() {
    return superagent(apiServer.app.listen());
}

describe('Users API Routes', function () {
    var userId;
    var groupId = '123';

    r.table('users').delete().run();
    r.table('users').insert({username: 'fixture'}).run();
    //r.table('groups').insert({id: groupId, title: 'Group Title'}).run();

    describe('GET /users', function () {
        it('should return 403', function (done) {
            request().get('/users')
                .expect(403)
                .end(done)
            ;
        });

        it('should return 200 and should return 1 user', function (done) {
            request().get('/users')
                .set('x-token', 'MySecret')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.data.length).to.be(1);
                    done();
                })
            ;
        });
    });

    describe('POST /users', function () {
        it('should return 403', function (done) {
            request().post('/users')
                .send({username: 'test1'})
                .expect(403)
                .end(done)
            ;
        });

        it('should return 200 and userId to be a string', function (done) {
            request().post('/users')
                .set('x-token', 'MySecret')
                .send({username: 'test1'})
                .expect(200)
                .end(function (err, res) {
                    userId = res.body.data.userId;
                    expect(userId).to.be.a('string');
                    done();
                })
            ;
        });
    });

    describe('GET /users/:userId', function () {
        it('should return 403', function (done) {
            request().get('/users/' + userId)
                .expect(403)
                .end(done)
            ;
        });

        it('should return 200 and username to be test1', function (done) {
            request().get('/users/' + userId)
                .set('x-token', 'MySecret')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.data.username).to.be('test1');
                    done();
                })
            ;
        });
    });

    describe('GET /users/:userId/groups', function () {
        it('should return 403', function (done) {
            request().get('/users/' + userId + '/groups')
                .expect(403)
                .end(done)
            ;
        });
    });

    describe('PUT /users/:userId', function () {
        it('should return 403', function (done) {
            request().put('/users/' + userId)
                .expect(403)
                .end(done)
            ;
        });

        it('should return 200', function (done) {
            request().put('/users/' + userId)
                .set('x-token', 'MySecret')
                .send({username: 'test2'})
                .expect(200)
                .end(function (err, res) {
                    done();
                })
            ;
        });
    });

    describe('GET /users/:userId/token', function () {
        it('should return 403', function (done) {
            request().get('/users/' + userId + '/token')
                .expect(403)
                .end(done)
            ;
        });

        it('should return 200 and token to be a string', function (done) {
            request().get('/users/' + userId + '/token')
                .set('x-token', 'MySecret')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.data.token).to.be.a('string');
                    done();
                })
            ;
        });
    });

    describe('DELETE /users/:userId', function () {
        it('should return 403', function (done) {
            request().delete('/users/' + userId)
                .expect(403)
                .end(done)
            ;
        });

        it('should return 200', function (done) {
            request().delete('/users/' + userId)
                .set('x-token', 'MySecret')
                .expect(200)
                .end(function (err, res) {
                    done();
                })
            ;
        });
    });
});