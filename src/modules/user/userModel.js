const connection = require("../../config/mysql");

module.exports = {
  getCountUser: () =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT (*) AS total FROM user",
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getAllUser: (limit, offset) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM user  LIMIT ? OFFSET ?`,
        [limit, offset],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getSkillById: (id, searchSkill, sort) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT user.fullName,user.image,user.address,user.role,skill.userId,skill.skill FROM skill jOIN user ON user.id=skill.userId WHERE userId='${id}' AND user.role LIKE'%${sort}%' AND skill LIKE '%${searchSkill}%'  `,
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
      connection.query(
        "SELECT user.fullName,user.image,user.address,user.role,skill.userId,skill.skill FROM skill jOIN user ON user.id=skill.userId WHERE user.id=?",
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
  updateProfile: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query("UPDATE user SET? WHERE id=?", [data, id], (error) => {
        if (!error) {
          const newResult = {
            id,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  updateImage: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(`UPDATE user SET ? WHERE id="${id}"`, data, (error) => {
        if (!error) {
          const newResult = {
            id,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  updatePassword: (id, hash, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET password='${hash}' WHERE id='${id}'`,
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
  deleteImage: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET image=null WHERE id="${id}"`,
        data,
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
