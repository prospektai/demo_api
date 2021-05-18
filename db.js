const mysql = require('mysql')

const db = mysql.createPool({
    host: 'xx',
    user: 'xx',
    password: 'xx',
    database: 'xx'
});

module.exports = db;