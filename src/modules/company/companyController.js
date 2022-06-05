const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const { compareSync } = require("bcrypt");
const helperWrapper = require("../../helpers/wrapper");
const userModel = require("./companyModel");
const cloudinary = require("../../config/cloudinary");
const { image } = require("../../config/cloudinary");
const companyModel = require("./companyModel");
// const { image } = require("../../config/cloudinary");

module.exports = {
  getCompanyByCompanyId: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await companyModel.getCompanyByCompanyId(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      return helperWrapper.response(response, 200, "succes get data", result);
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  updateProfileCompany: async (request, response) => {
    try {
      const { id } = request.params;
      const checkResult = await companyModel.getCompanyByCompanyId(id);
      if (checkResult.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const {
        companyName,
        companyField,
        address,
        email,
        socialMedia,
        noTelp,
        description,
      } = request.body;
      const setData = {
        companyName,
        companyField,
        email,
        address,
        noTelp,
        socialMedia,
        description,
        updatedAt: new Date(Date.now()),
      };
      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await companyModel.updateProfileCompany(id, setData);

      //   response.status(200);
      //   response.send("hello world");
      return helperWrapper.response(
        response,
        200,
        "succes update data",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  updateImageCompany: async (request, response) => {
    try {
      const { id } = request.params;
      const checkResult = await companyModel.getCompanyByCompanyId(id);
      if (checkResult.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const setData = {
        image: request.file
          ? `${request.file.filename}.${request.file.mimetype.split("/")[1]}`
          : "",
        updatedAt: new Date(Date.now()),
      };

      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      // delete image from cloudinary condition
      if (checkResult[0].image !== null) {
        const deleteImage = checkResult[0].image.split(".")[0];
        cloudinary.uploader.destroy(deleteImage, function (result) {
          return result;
        });
      }
      const result = await companyModel.updateImageCompany(id, setData);

      return helperWrapper.response(
        response,
        200,
        "succes update image",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  updatePasswordCompany: async (request, response) => {
    try {
      const { id } = request.params;
      const checkResult = await companyModel.getCompanyByCompanyId(id);
      console.log(checkResult);
      if (checkResult.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const { currentPassword, newPassword, confirmPassword } = request.body;

      const stringPass = checkResult[0].password;
      const validPass = await bcrypt.compare(currentPassword, stringPass);

      // eslint-disable-next-line no-restricted-syntax
      if (!validPass) {
        return helperWrapper.response(response, 400, "Wrong Password", null);
      }
      if (newPassword !== confirmPassword) {
        return helperWrapper.response(
          response,
          400,
          "password Not Match",
          null
        );
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(confirmPassword, salt);
      const setData = {
        confirmPassword: hash,
        updatedAt: new Date(Date.now()),
      };
      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }
      const result = await companyModel.updatePasswordCompany(
        id,
        hash,
        setData
      );

      //   response.status(200);
      //   response.send("hello world");
      return helperWrapper.response(
        response,
        200,
        "succes Update Password",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  deleteImage: async (request, response) => {
    try {
      //untuk menghapus bisa menggunakan cloudinary.upload.destroy
      const { id } = request.params;
      const resultId = await companyModel.getCompanyByCompanyId(id);
      const result = await companyModel.deleteImage(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      //delete image from cloudinary
      if (resultId[0].image !== null) {
        const deleteImage = resultId[0].image.split(".")[0];
        cloudinary.uploader.destroy(deleteImage, function (result) {
          return result;
        });
      }
      return helperWrapper.response(
        response,
        200,
        "succes delete image",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
