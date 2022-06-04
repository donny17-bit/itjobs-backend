const connection = require("../../config/mysql");

module.exports = {
  getPortfolioById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM portfolio WHERE id=?",
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
  getPortfolioByUserId: (userId) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM portfolio WHERE userId=?",
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
  createPortfolio: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO portfolio SET ?", data, (error, result) => {
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
  updatePortfolio: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE portfolio SET ? WHERE id = ?",
        [data, id],
        (error) => {
          if (!error) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  deletePortfolio: (id) =>
    new Promise((resolve, reject) => {
      connection.query("DELETE FROM portfolio WHERE id=?", id, (error) => {
        if (!error) {
          resolve(id);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
};
