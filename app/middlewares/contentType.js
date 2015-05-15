module.exports = function *contentType(next) {
    this.response.type = 'application/json';

    yield next;
};