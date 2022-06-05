const connection = require("../../config/mysql");

module.exports = {
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
  updateProfileCompany: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE company SET? WHERE id=?",
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
  updateImageCompany: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE company SET ? WHERE id="${id}"`,
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
  updatePasswordCompany: (id, hash, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE company SET password='${hash}' WHERE id='${id}'`,
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
        `UPDATE company SET image=null WHERE id="${id}"`,
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
