const mysql = require('mysql2');
const { host, user, password, database } = require('../utils/config')

const db = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database
})

db.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  db.emit('ready')
});

module.exports = db;