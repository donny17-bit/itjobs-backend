const connection = require("../../config/mysql");

module.exports = {
  register: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO user SET?", data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data,
          };
          delete newResult.password;
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  registerCompany: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO company SET?", data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data,
          };
          delete newResult.password;
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  getEmail: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT email FROM user WHERE email="${email}"`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getEmailCompany: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT email FROM company WHERE email="${email}"`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getActivation: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET status= 'active' WHERE id="${id}"`,
        (error) => {
          if (!error) {
            const newResult = "email active";
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getUserByEmail: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE email=?",
        email,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getUserByEmailCompany: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM company WHERE email=?",
        email,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getUserByPassword: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT password FROM user WHERE email=?",
        email,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getUserByPasswordCompany: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT password FROM company WHERE email=?",
        email,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getUserByUserId: (id) =>
    new Promise((resolve, reject) => {
      connection.query("SELECT * FROM user WHERE id=?", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  getCompanyByCompanyId: (id) =>
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
};
