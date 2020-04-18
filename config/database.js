module.exports = {
    port: process.env.DB_PORT || 27017,
    host: process.env.DB_HOST || '127.0.0.1',
    log: process.env.DB_LOG_LEVEL || 'error',
    index: process.env.DB_INDEX || 'admin',
    username: process.env.DB_INDEX || 'root',
    password: process.env.DB_INDEX || 'password',
    post_per_page: process.env.POST_PER_PAGE || 10,
};

