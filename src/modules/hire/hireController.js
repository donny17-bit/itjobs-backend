const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helpers/wrapper");
const helperMailer = require("../../helpers/mail");
const hireModel = require("./hireModel");

module.exports = {
  getHire: async (request, response) => {
    try {
      const { userId } = request.params;
      const result = await hireModel.getHireByUserId(userId);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
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
      const { companyId } = request.params;
      const { userId, subject } = request.body;
      const dataCreate = {
        id: uuidv4(),
        companyId: companyId,
        userId,
        subject,
      };
      const result = await hireModel.createHire(dataCreate);
      const user = await hireModel.getUserById(result.userId);

      if (user.length > 0) {
        const company = await hireModel.getCompanyById(companyId);
        const dataMailing = {
          to: user.email,
          subject: result.subject,
          template: "hiring.html",
        };
        await helperMailer.sendMail(dataMailing);
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
          200,
          "email failed to send",
          deleteHire
        );
      }
    } catch (error) {
      return helperWrapper.response(response, 404, "Bad request", null);
    }
  },
};
