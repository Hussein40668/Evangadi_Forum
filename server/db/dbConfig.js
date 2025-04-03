const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

if (!process.env.HOST || !process.env.USER || !process.env.PASSWORD || !process.env.DATABASE) {
  console.error("One or more environment variables are missing!");
}

// creating mysql connection
const dbConnection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  port: 3306,
  database: process.env.DATABASE,
  connectionLimit: 15,
});

module.exports = dbConnection.promise();
