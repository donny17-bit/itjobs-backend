const express = require("express");

const Router = express.Router();

const skillController = require("./SkillController");
// const middlewareAuth = require("../../middleware/auth");

Router.get("/:userId", skillController.getSkill);
Router.post("/:userId", skillController.createSkill);
Router.delete("/:id", skillController.deleteSkill);

module.exports = Router;
