const mysql = require("mysql2");
// import mysql from 'mysql2/promise';
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  port: process.env.DATABASE_PORT,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

pool.getConnection((err) => {
  if (err) {
    console.log(err.message);
    throw err;
  }
  console.log("Connected to Database");
});

module.exports = pool.promise();
