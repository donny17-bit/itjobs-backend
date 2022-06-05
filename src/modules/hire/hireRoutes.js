const express = require("express");

const Router = express.Router();

const hireController = require("./hireController");
const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/uploadPdf");

Router.get(
  "/:userId",
  middlewareAuth.userAuthentication,
  hireController.getHire
);
Router.post(
  "/:userId",
  middlewareUpload,
  middlewareAuth.isAdminAuthentication,
  hireController.createHire
);
Router.delete("/:id", hireController.deleteHire);
module.exports = Router;
