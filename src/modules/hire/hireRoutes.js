const express = require("express");

const Router = express.Router();

const hireController = require("./hireController");
// const middlewareAuth = require("../../middleware/auth");

Router.get("/:userId", hireController.getHire);
Router.post("/:userId", hireController.createHire);

module.exports = Router;
