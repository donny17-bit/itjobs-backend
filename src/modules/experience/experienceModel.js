const connection = require("../../config/mysql");

module.exports = {
  getExperienceById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM experience WHERE id=?",
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
  getExperienceByUserId: (userId) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM experience WHERE userId=?",
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
  createExperience: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO experience SET ?",
        data,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  updateExperience: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE experience SET ? WHERE id = ?",
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
  deleteExperience: (id) =>
    new Promise((resolve, reject) => {
      connection.query("DELETE FROM experience WHERE id=?", id, (error) => {
        if (!error) {
          resolve(id);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
};
