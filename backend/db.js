const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'root',      
  password: '',      
  database: 'user_Db' 
});

connection.connect(error => {
  if (error) {
    console.error('Error connecting to MySQL database:', error.message);
    return;
  }
  console.log('Successfully connected to the MySQL database!');
});

// Use connection.promise().execute for asynchronous, promise-based queries
module.exports = connection.promise();