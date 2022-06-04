const express = require("express");

const Router = express.Router();
const authRoutes = require("../modules/auth/authRoutes");
const userRoutes = require("../modules/user/userRoutes");
const companyRoutes = require("../modules/company/companyRoutes");

Router.use("/auth", authRoutes);
Router.use("/user", userRoutes);
Router.use("/company", companyRoutes);
module.exports = Router;
