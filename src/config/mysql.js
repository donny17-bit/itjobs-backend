const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "itjobs",
  // host: "ec2-44-202-197-206.compute-1.amazonaws.com",
  // user: "fw6thariq",
  // password: "Kdaio83!",
  // database: "fw6thariq_itjobs",
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log("You're now connected to db mysql...");
});

module.exports = connection;
