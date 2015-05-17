/* global describe, it */
var config = require('../../../app/config');
var apiServer = require('../../../app/http/server');
var superagent = require('supertest');
var expect = require('expect.js');
var r = require('rethinkdbdash')(config.rethinkdb);

function request() {
    return superagent(apiServer.app.listen());
}

describe('Groups API Routes', function () {
    var groupId;

    r.table('groups').delete().run();
    r.table('groups').insert({title: 'group title', name: 'fixture'}).run();

    describe('GET /groups', function () {
        it('should return 403', function (done) {
            request().get('/groups')
                .expect(403)
                .end(done)
            ;
        });

        it('should return 200 and should return 1 group', function (done) {
            request().get('/groups')
                .set('x-token', 'MySecret')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.data.length).to.be(1);
                    done();
                })
            ;
        });
    });

    describe('POST /groups', function () {
        it('should return 403', function (done) {
            request().post('/groups')
                .expect(403)
                .end(done)
            ;
        });

        it('should return 200 and userId to be a string', function (done) {
            request().post('/groups')
                .set('x-token', 'MySecret')
                .send({name: 'testGroup1'})
                .expect(200)
                .end(function (err, res) {
                    groupId = res.body.data.groupId;
                    expect(groupId).to.be.a('string');
                    done();
                })
            ;
        });
    });

    describe('GET /groups/:groupId', function () {
        it('should return 403', function (done) {
            request().get('/groups/' + groupId)
                .expect(403)
                .end(done)
            ;
        });

        it('should return 200 and group name to be testGroup1', function (done) {
            request().get('/groups/' + groupId)
                .set('x-token', 'MySecret')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.data.name).to.be('testGroup1');
                    done();
                })
            ;
        });
    });

    describe('PUT /groups/:groupId', function () {
        it('should return 403', function (done) {
            request().put('/groups/' + groupId)
                .expect(403)
                .end(done)
            ;
        });

        it('should return 200', function (done) {
            request().put('/groups/' + groupId)
                .set('x-token', 'MySecret')
                .send({name: 'testGroup2'})
                .expect(200)
                .end(function (err, res) {
                    done();
                })
            ;
        });
    });

    describe('DELETE /groups/:groupId', function () {
        it('should return 403', function (done) {
            request().delete('/groups/' + groupId)
                .expect(403)
                .end(done)
            ;
        });

        it('should return 200', function (done) {
            request().delete('/groups/' + groupId)
                .set('x-token', 'MySecret')
                .expect(200)
                .end(function (err, res) {
                    done();
                })
            ;
        });
    });
});