const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'employer',
    password: 'bossman',
    database: 'employee'
})


db.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }

    db.emit('ready')
  });

module.exports = db;