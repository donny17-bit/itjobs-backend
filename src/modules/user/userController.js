const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const { compareSync } = require("bcrypt");
const helperWrapper = require("../../helpers/wrapper");
const userModel = require("./userModel");
const cloudinary = require("../../config/cloudinary");
const { image } = require("../../config/cloudinary");

module.exports = {
  getAllUser: async (request, response) => {
    try {
      let { page, limit, searchSkill, sort } = request.query;
      // limit and page search process
      page = Number(page);
      if (!page) {
        page = 1;
      }
      limit = Number(limit);
      if (!limit) {
        limit = 100;
      }
      const offset = page * limit - limit;
      const totalData = await userModel.getCountUser();
      const totalPage = Math.ceil(totalData / limit);

      // search name release validation
      if (!searchSkill) {
        searchSkill = "";
      }

      // sorting process and validation
      if (!sort) {
        sort = "";
      }
      if (sort === "adress") {
        data = "ORDER BY user.adress ASC";
      }
      const result = await userModel.getAllUser(limit, offset, sort);

      const newResult = await Promise.all(
        result.map(async (item) => {
          let dataSkill = await userModel.getSkillById(
            item.id,
            searchSkill,
            sort
          );
          dataSkill = dataSkill.map((value) => value.skill);
          const newData = { ...item, skill: dataSkill };
          return newData;
        })
      );

      const filterResult = newResult.filter((item) => item.skill.length > 0);
      const sortResult = filterResult.sort(function (b, a) {
        const keyA = a.skill.length;
        const keyB = b.skill.length;
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });

      const dataSearchFound = sortResult.length;
      const pageinfo = {
        dataSearchFound,
        page,
        totalPage,
        limit,
        totalData,
      };
      return helperWrapper.response(
        response,
        200,
        "succes get data",
        sortResult,
        pageinfo
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getUserByUserId: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await userModel.getUserByUserId(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      // const skill = result.map((item) => item.skill);
      // const resultUser = {
      //   ...result[0],
      //   skill,
      // };
      return helperWrapper.response(response, 200, "succes get data", result);
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  updateProfile: async (request, response) => {
    try {
      const { id } = request.params;
      const checkResult = await userModel.getUserByUserId(id);
      if (checkResult.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const { fullName, role, address, socialMedia, description, field } =
        request.body;
      const setData = {
        fullName,
        role,
        field,
        address,
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

      const result = await userModel.updateProfile(id, setData);

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
  updateImage: async (request, response) => {
    try {
      const { id } = request.params;
      const checkResult = await userModel.getUserByUserId(id);
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
      const result = await userModel.updateImage(id, setData);

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
  updatePassword: async (request, response) => {
    try {
      const { id } = request.params;
      const checkResult = await userModel.getUserByUserId(id);
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
      const result = await userModel.updatePassword(id, hash, setData);

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
      const resultId = await userModel.getUserByUserId(id);
      const result = await userModel.deleteImage(id);
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
