const express = require("express");

const Router = express.Router();

const portfolioController = require("./portfolioController");
const middlewareUpload = require("../../middleware/uploadPortfolio");
const middlewareAuth = require("../../middleware/auth");

Router.get("/:userId", portfolioController.getPortfolio);
Router.post(
  "/:userId",
  middlewareAuth.userAuthentication,
  middlewareUpload,
  portfolioController.createPortfolio
);
Router.patch(
  "/:id",
  middlewareAuth.userAuthentication,
  middlewareUpload,
  portfolioController.updatePortfolio
);
Router.delete(
  "/:id",
  middlewareAuth.userAuthentication,
  middlewareUpload,
  portfolioController.deletePortfolio
);

module.exports = Router;
