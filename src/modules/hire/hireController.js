const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helpers/wrapper");
const helperMailer = require("../../helpers/mail");
const hireModel = require("./hireModel");
const fs = require("fs");

module.exports = {
  getHire: async (request, response) => {
    try {
      const { userId } = request.params;
      const result = await hireModel.getHireByUserId(userId);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          200,
          `Id ${userId} never been hired`,
          null
        );
      }

      return helperWrapper.response(response, 200, "succes get data !", result);
    } catch (error) {
      return helperWrapper.response(response, 404, "Bad request", null);
    }
  },
  createHire: async (request, response) => {
    try {
      const { userId, subject, description } = request.body;
      const company = await hireModel.getCompanyById(request.params.companyId);
      const dataCreate = {
        id: uuidv4(),
        companyId: request.params.companyId,
        companyName: company[0].companyName,
        userId,
        subject,
      };
      const result = await hireModel.createHire(dataCreate);
      const user = await hireModel.getUserById(result.userId);

      if (user.length > 0) {
        if (request.file) {
          const dataMailing = {
            to: user[0].email,
            template: "hiring.html",
            name: user[0].fullName,
            companyName: company[0].companyName,
            noTelp: company[0].noTelp,
            subject: subject,
            description: description,
            filename: request.file.filename,
            path: request.file.path,
          };
          await helperMailer.sendMail(dataMailing);
          await fs.unlink(`${request.file.path}`, (err) => {
            if (err) throw err;
          });
        } else {
          const dataMailing = {
            to: user[0].email,
            template: "hiring.html",
            name: user[0].fullName,
            companyName: company[0].companyName,
            noTelp: company[0].noTelp,
            subject: subject,
            description: description,
          };
          await helperMailer.sendMail(dataMailing);
        }
        return helperWrapper.response(
          response,
          200,
          "Success post data, your email was sent to the user",
          result
        );
      } else {
        const deleteHire = await hireModel.deleteHire(result.id);
        return helperWrapper.response(
          response,
          404,
          "user not found",
          deleteHire
        );
      }
    } catch (error) {
      return helperWrapper.response(response, 404, "Bad request", null);
    }
  },
  deleteHire: async (request, response) => {
    try {
      const { id } = request.params;
      const data = await hireModel.getHireById(id);

      if (data.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Hire by id ${id} not found`,
          null
        );
      }

      const result = await hireModel.deleteHire(id);

      return helperWrapper.response(
        response,
        200,
        "Success delete data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
