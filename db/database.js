const mysql = require('mysql2');

// TO RUN APP, ENTER USER AND PASSWORD BELOW AND CREATE THE EMPLOYEE DATABASE
  // To create the database, login to mysql and enter:
    // mysql> CREATE DATABASE employee;
  // To create a user with permissions to the employee database, login to mysql and enter:
    // mysql> CREATE USER 'user'@'localhost' IDENTIFIED BY 'some_pass';
    // mysql> GRANT ALL PRIVILEGES ON employee.* TO 'user'@'localhost';
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