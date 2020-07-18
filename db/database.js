const mysql = require('mysql2');

require('dotenv').config()

const db = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
})

db.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  db.emit('ready')
});

module.exports = db;