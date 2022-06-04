const express = require("express");

const Router = express.Router();

const experienceRoutes = require("../modules/experience/experienceRoutes");
const hireRoutes = require("../modules/hire/hireRoutes");
const portfolioRoutes = require("../modules/portfolio/portfolioRoutes");
const skillRoutes = require("../modules/skill/skillRoutes");

Router.use("/experience", experienceRoutes);
Router.use("/hire", hireRoutes);
Router.use("/portfolio", portfolioRoutes);
Router.use("/skill", skillRoutes);

module.exports = Router;
