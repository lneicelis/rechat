module.exports = {
    secret: process.env.APP_SECRET || 'MySecret',
    log: {
        level: process.env.LOG_LEVEL || 'debug',
        file: './logs/logs.log'
    },
    rethinkdb: {
        port: 28015,
        db: process.env.DB_NAME || 'test'
    },
    api: {
        port: 3000
    }
};