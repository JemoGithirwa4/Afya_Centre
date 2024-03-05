const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'root',
  user: 'localhost:3306',
  password: '@Kukurella17',
  database: 'afya_centre',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;
