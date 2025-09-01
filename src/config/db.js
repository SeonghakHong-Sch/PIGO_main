// client 생성
const db = require('mysql2');

// db connection 생성
const connection = db.createPool({
  host: 'db',
  user: 'root',
  database: 'PIGO_DB',
  password: process.env.MYSQL_ROOT_PASSWORD,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = connection;