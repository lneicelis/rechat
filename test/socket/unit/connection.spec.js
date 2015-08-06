/* global describe, it, beforeEach */

var Connection = require('../../../app/socket/Connection');
var expect = require('expect.js');
var sinon = require('sinon');

describe('Socket connection', function () {
    var socket, user, connection;

    beforeEach(function () {
        socket = {
            on: sinon.spy(),
            removeListener: sinon.spy()
        };
        user = {
            username: 'testuser',
            getGroups: function () {
                return Promise.resolve([{id: 123}, {id: 321}]);
            }
        };
        connection = new Connection(socket);
    });

    it('should create new instance', function () {
        expect(connection).to.be.a(Connection);
    });

    it('should attach event listener on socket and group id been set', function () {
        connection.connectWith(user)
            .then(function () {
                expect(socket.on.called).to.be(true);
                expect(connection.groups).to.eql([123, 321]);
                done();
            });
    });

    it('should detach event listener from socket', function () {
        connection.connectWith(user)
            .then(function () {
                connection.disconnect();
                expect(socket.removeListener.called).to.be(true);
            });
    });
});