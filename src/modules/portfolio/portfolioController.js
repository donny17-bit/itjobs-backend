const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helpers/wrapper");
const portfolioModel = require("./portfolioModel");
const cloudinary = require("../../config/cloudinary");

module.exports = {
  getPortfolio: async (request, response) => {
    try {
      const { userId } = request.params;
      const result = await portfolioModel.getPortfolioByUserId(userId);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          200,
          `Id ${userId} has not added portfolio yet`,
          null
        );
      }

      return helperWrapper.response(response, 200, "succes get data !", result);
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 404, "Bad request", null);
    }
  },
  createPortfolio: async (request, response) => {
    try {
      const userId = request.params;
      const { appName, linkRepo, workPlace, publicationLink } = request.body;

      let image;

      if (request.file) {
        if (request.file.size > 10000000) {
          await cloudinary.uploader.destroy(
            `${request.files.filename}`,
            (delresult) => {
              console.log(delresult);
            }
          );

          return helperWrapper.response(
            response,
            400,
            "image size cannot be more than 10mb",
            null
          );
        }
        image = request.file.filename;
      } else {
        image = "";
      }

      const setData = {
        userId: userId.userId,
        appName,
        linkRepo,
        workPlace,
        publicationLink,
        image,
        createdAt: new Date(Date.now()),
      };
      const result = await portfolioModel.createPortfolio(setData);
      return helperWrapper.response(
        response,
        200,
        "Success create data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  updatePortfolio: async (request, response) => {
    try {
      const { id } = request.params;
      const { appName, linkRepo, workPlace, publicationLink } = request.body;
      let image;

      if (request.file) {
        if (request.file.size > 10000000) {
          await cloudinary.uploader.destroy(
            `${request.file.filename}`,
            (delresult) => {
              console.log(delresult);
            }
          );

          return helperWrapper.response(
            response,
            400,
            "image size cannot be more than 10mb",
            null
          );
        }
        const imageDelete = await portfolioModel.getPortfolioById(id);
        if (imageDelete[0].image.length > 0) {
          await cloudinary.uploader.destroy(
            `${imageDelete[0].image}`,
            (delresult) => {
              console.log(delresult);
            }
          );
        }
        image = request.file.filename;
      }
      const setData = {
        appName,
        linkRepo,
        image,
        workPlace,
        publicationLink,
        updateAt: new Date(Date.now()),
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await portfolioModel.updatePortfolio(id, setData);
      const getdataresult = await portfolioModel.getPortfolioById(id);

      return helperWrapper.response(
        response,
        200,
        "Success update data !",
        getdataresult
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  deletePortfolio: async (request, response) => {
    try {
      const { id } = request.params;
      const data = await portfolioModel.getPortfolioById(id);

      if (data.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Portfolio by id ${id} not found`,
          null
        );
      }
      if (data[0].image.length > 0) {
        await cloudinary.uploader.destroy(`${data[0].image}`, (delresult) => {
          console.log(delresult);
        });
      }

      const result = await portfolioModel.deletePortfolio(id);

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
