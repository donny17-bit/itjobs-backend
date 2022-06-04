const express = require("express");

const Router = express.Router();

const experienceController = require("./experienceController");
// const middlewareAuth = require("../../middleware/auth");

Router.get("/:userId", experienceController.getExperience);
Router.post("/:userId", experienceController.createExperience);
Router.patch("/:id", experienceController.updateExperience);
Router.delete("/:id", experienceController.deleteExperience);

module.exports = Router;
