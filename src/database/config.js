const mysql = require('mysql2/promise');

const connection = async () => {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: process.env.PASS,
        database: 'library_management'
    })
}

module.exports = connection