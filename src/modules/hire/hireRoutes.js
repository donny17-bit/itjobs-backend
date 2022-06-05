const express = require("express");

const Router = express.Router();

const hireController = require("./hireController");
const middlewareAuth = require("../../middleware/auth");

Router.get(
  "/:userId",
  middlewareAuth.userAuthentication,
  hireController.getHire
);
Router.post(
  "/:userId",
  middlewareAuth.isAdminAuthentication,
  hireController.createHire
);

module.exports = Router;
