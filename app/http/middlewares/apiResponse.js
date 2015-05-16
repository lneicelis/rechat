module.exports = function *apiResponse (next) {
    this.response.type = 'application/json';
    this.response.status = 404;
    this.response.body = {
        message: 'API endpoint not found!'
    };

    this.respond = function (data) {
        this.response.status = 200;
        this.response.body = {
            data: data
        }
    };

    yield next;
};