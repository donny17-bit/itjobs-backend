const express = require("express");

const Router = express.Router();

const skillController = require("./SkillController");
const middlewareAuth = require("../../middleware/auth");

Router.get(
  "/:userId",
  middlewareAuth.userAuthentication,
  skillController.getSkill
);
Router.post(
  "/:userId",
  middlewareAuth.userAuthentication,
  skillController.createSkill
);
Router.delete(
  "/:id",
  middlewareAuth.userAuthentication,
  skillController.deleteSkill
);

module.exports = Router;
