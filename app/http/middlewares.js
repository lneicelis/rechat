module.exports = function (app) {
    app.use(require('./middlewares/secretToken'));
    app.use(require('./middlewares/apiResponse'));
};