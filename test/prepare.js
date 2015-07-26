/* global require */

var utils = require('./utils');

utils.dbCleanUp().then(function () {
    console.log('Database is prepared.');
    process.exit(0);
}, function (err) {
    console.log('Failed to prepare database.');
    process.exit(1);
});