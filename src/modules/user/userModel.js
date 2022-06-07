const connection = require("../../config/mysql");

module.exports = {
  getCountUser: (searchSkill, sort) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT (*) AS total FROM user WHERE ${
          searchSkill == "" ? "" : `skill LIKE '%${searchSkill}%' AND `
        }   status ="active" ${
          sort === "skill"
            ? "ORDER BY totalSkill DESC"
            : `AND role LIKE '%${sort}%'`
        } `,
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getAllUser: (limit, offset, searchSkill, sort) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM user WHERE ${
          searchSkill == "" ? "" : `skill LIKE '%${searchSkill}%' AND `
        }   status ="active" ${
          sort === "skill"
            ? "ORDER BY totalSkill DESC"
            : `AND role LIKE '%${sort}%'`
        } LIMIT ? OFFSET ? `,
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
        `SELECT user.fullName,user.image,user.address,user.role,user.field,skill.userId,skill.skill FROM skill jOIN user ON user.id=skill.userId WHERE userId='${id}' AND skill LIKE '%${searchSkill}%'  AND user.role LIKE'%${sort}%'   `,
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
        `SELECT * FROM user WHERE id='${id}'`,

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
