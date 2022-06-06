const connection = require("../../config/mysql");

module.exports = {
  getSkillById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM skill WHERE id=?",
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
  getSkillByUserId: (userId) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM skill WHERE userId=?",
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
  createSkill: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO skill SET ?", data, (error, result) => {
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
  deleteSkill: (id) =>
    new Promise((resolve, reject) => {
      connection.query("DELETE FROM skill WHERE id=?", id, (error) => {
        if (!error) {
          resolve(id);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  updateProfile: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET ? WHERE id = ?",
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
};
