const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helpers/wrapper");
const skillModel = require("./skillModel");

module.exports = {
  getSkill: async (request, response) => {
    try {
      const { userId } = request.params;
      const result = await skillModel.getSkillByUserId(userId);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Id ${userId} has not added skill yet`,
          null
        );
      }

      return helperWrapper.response(response, 200, "succes get data !", result);
    } catch (error) {
      return helperWrapper.response(response, 404, "Bad request", null);
    }
  },
  createSkill: async (request, response) => {
    try {
      const { userId } = request.params;
      const data = request.body;
      const dataCreate = {
        userId: userId,
        ...data,
      };
      const result = await skillModel.createSkill(dataCreate);

      return helperWrapper.response(
        response,
        200,
        "Success post data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 404, "Bad request", null);
    }
  },
  deleteSkill: async (request, response) => {
    try {
      const { id } = request.params;
      const data = await skillModel.getSkillById(id);

      if (data.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Skill by id ${id} not found`,
          null
        );
      }

      const result = await skillModel.deleteSkill(id);

      return helperWrapper.response(
        response,
        200,
        "Success delete skill",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
