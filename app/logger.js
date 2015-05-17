var config = require('./config');
var winston = require('winston');

module.exports = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: config.log.level
        }),
        new (winston.transports.File)({
            level: config.log.level,
            filename: config.log.file
        })
    ]
});