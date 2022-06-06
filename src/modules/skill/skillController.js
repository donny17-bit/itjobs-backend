const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helpers/wrapper");
const skillModel = require("./skillModel");

module.exports = {
  getSkill: async (request, response) => {
    try {
      const { userId } = request.params;
      const result = await skillModel.getSkillByUserId(userId);

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
      const totalSkill = await skillModel.getCountSkill(userId);
      const update = {
        totalSkill: totalSkill,
        updatedAt: new Date(Date.now()),
      };
      const updateSkill = await skillModel.updateProfile(userId, update);

      return helperWrapper.response(
        response,
        200,
        `Success post data !, your skills now have ${totalSkill}`,
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
      const userId = data[0].userId;
      console.log(data[0].userId);

      if (data.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Skill by id ${id} not found`,
          null
        );
      }

      const result = await skillModel.deleteSkill(id);
      const totalSkill = await skillModel.getCountSkill(userId);
      const update = {
        totalSkill: totalSkill,
        updatedAt: new Date(Date.now()),
      };
      const updateSkill = await skillModel.updateProfile(userId, update);

      return helperWrapper.response(
        response,
        200,
        `Success delete skill, your skill now remaining ${totalSkill}`,
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
