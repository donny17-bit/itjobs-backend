const express = require("express");

const Router = express.Router();

const skillController = require("./skillController");
const middlewareAuth = require("../../middleware/auth");

Router.get("/:userId", skillController.getSkill);
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
