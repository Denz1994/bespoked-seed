const mysql = require('mysql2/promise');

const dpConnectionPool = mysql.createPool({
    user:'admin',
    password:'pringles',
    host: 'bespoked.cl0f4ipns0iz.us-east-1.rds.amazonaws.com',
    port: 3306,
    database: 'bespokedDB'
});

module.exports = dpConnectionPool;