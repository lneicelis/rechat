/* global describe, it */
var superagent = require('supertest');
var apiServer = require('../../../app/http/server');

function request() {
    return superagent(apiServer.app.listen());
}

describe('Routes', function () {
    //process.env.DB_TEST = 'test';

    describe('GET /users', function () {
        it('should return 403', function (done) {
            request()
                .get('/users')
                .expect(403)
                .end(done)
            ;
        });

        it('should return 200', function (done) {
            request()
                .get('/users')
                .set('x-token', 'MySecret')
                .expect(200)
                .end(done)
            ;
        })
    })
});