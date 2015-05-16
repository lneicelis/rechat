module.exports = {
    secret: process.env.APP_SECRET || 'MySecret',
    connection: 'rethinkdb',
    rethinkdb: {
        port: 28015,
        db: process.env.DB_NAME || 'test'
    },
    api: {
        port: 3000
    }
};