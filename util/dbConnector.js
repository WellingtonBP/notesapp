const mysql = require('mysql2')

const conn = mysql.createConnection('mysql://root@localhost:3308/notesApp')

module.exports = conn.promise() 