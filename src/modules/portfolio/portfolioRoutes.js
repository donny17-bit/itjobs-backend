const express = require("express");

const Router = express.Router();

const portfolioController = require("./portfolioController");
// const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/uploadPortfolio");

Router.get("/:userId", portfolioController.getPortfolio);
Router.post("/:userId", middlewareUpload, portfolioController.createPortfolio);
Router.patch("/:id", middlewareUpload, portfolioController.updatePortfolio);
Router.delete("/:id", middlewareUpload, portfolioController.deletePortfolio);

module.exports = Router;
