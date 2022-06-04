const connection = require("../../config/mysql");

module.exports = {
  getHireByUserId: (userId) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM hire WHERE userId=?",
        userId,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  createHire: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO hire SET ?", data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  getUserById: (id) =>
    new Promise((resolve, reject) => {
      connection.query("SELECT * FROM user WHERE id=?", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  getCompanyById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM company WHERE id=?",
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  deleteHire: (id) =>
    new Promise((resolve, reject) => {
      connection.query("DELETE FROM hire WHERE id=?", id, (error) => {
        if (!error) {
          resolve(id);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
};
