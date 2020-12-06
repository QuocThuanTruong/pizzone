const mysql = require('mysql');

function connectDatabase() {
    return mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'pizzone',
    });
}

const db = connectDatabase();

module.exports.db = db;