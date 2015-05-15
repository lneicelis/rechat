module.exports = function *apiResponse (next) {
    this.response.type = 'application/json';

    this.respond = function (data) {
        this.response.body = {
            data: data
        }
    };

    yield next;
};