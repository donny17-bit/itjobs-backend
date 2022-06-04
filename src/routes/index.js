const express = require("express");

const Router = express.Router();
const authRoutes = require("../modules/auth/authRoutes");
const userRoutes = require("../modules/user/userRoutes");
const companyRoutes = require("../modules/company/companyRoutes");
const experienceRoutes = require("../modules/experience/experienceRoutes");
const hireRoutes = require("../modules/hire/hireRoutes");
const portfolioRoutes = require("../modules/portfolio/portfolioRoutes");
const skillRoutes = require("../modules/skill/skillRoutes");

Router.use("/auth", authRoutes);
Router.use("/user", userRoutes);
Router.use("/company", companyRoutes);


Router.use("/experience", experienceRoutes);
Router.use("/hire", hireRoutes);
Router.use("/portfolio", portfolioRoutes);
Router.use("/skill", skillRoutes);

module.exports = Router;
