const express = require("express");

const Router = express.Router();

const experienceController = require("./experienceController");
const middlewareAuth = require("../../middleware/auth");

Router.get(
  "/:userId",
  middlewareAuth.userAuthentication,
  experienceController.getExperience
);
Router.post(
  "/:userId",
  middlewareAuth.userAuthentication,
  experienceController.createExperience
);
Router.patch(
  "/:id",
  middlewareAuth.userAuthentication,
  experienceController.updateExperience
);
Router.delete(
  "/:id",
  middlewareAuth.userAuthentication,
  experienceController.deleteExperience
);

module.exports = Router;
