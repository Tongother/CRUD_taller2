const mysql = require('mysql');

// database connection 
const db = mysql.createConnection ({
    host: 'localhost',
    port: '3308',
    user: 'root',
    password: '',
    database: 'product-category'
  });
  
  // connect to database
  db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
  });
  

  module.exports = db;