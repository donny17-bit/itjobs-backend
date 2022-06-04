const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helpers/wrapper");
const experienceModel = require("./experienceModel");

module.exports = {
  getExperience: async (request, response) => {
    try {
      const { userId } = request.params;
      const result = await experienceModel.getExperienceByUserId(userId);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Id ${userId} has not added experience yet`,
          null
        );
      }

      return helperWrapper.response(response, 200, "succes get data !", result);
    } catch (error) {
      return helperWrapper.response(response, 404, "Bad request", null);
    }
  },
  createExperience: async (request, response) => {
    try {
      const { userId } = request.params;
      const data = request.body;
      const dataCreate = {
        userId: userId,
        ...data,
      };
      const result = await experienceModel.createExperience(dataCreate);

      return helperWrapper.response(response, 200, "Success post data !", {
        id: result.id,
        userId: userId,
        ...request.body,
      });
    } catch (error) {
      return helperWrapper.response(response, 404, "Bad request", null);
    }
  },
  updateExperience: async (request, response) => {
    try {
      const { id } = request.params;
      const dataBody = request.body;

      const setData = {
        ...dataBody,
        updateAt: new Date(Date.now()),
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await experienceModel.updateExperience(id, setData);

      return helperWrapper.response(
        response,
        200,
        "Success update data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  deleteExperience: async (request, response) => {
    try {
      const { id } = request.params;
      const data = await experienceModel.getExperienceById(id);

      if (data.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Experience by id ${id} not found`,
          null
        );
      }

      const result = await experienceModel.deleteExperience(id);

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
