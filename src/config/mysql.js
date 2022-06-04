const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "ec2-44-202-197-206.compute-1.amazonaws.com",
  user: "fw6thariq",
  password: "Kdaio83!",
  database: "fw6thariq_itjobs",
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log("You're now connected to db mysql...");
});

module.exports = connection;
