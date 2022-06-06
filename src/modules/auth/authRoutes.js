const express = require("express");

const Router = express.Router();

const authController = require("./authController");

Router.post("/user/register", authController.register);
Router.post("/user/login", authController.login);
Router.post("/user/refresh", authController.refresh);
Router.get("/user/verify/:id", authController.verify);
Router.post("/user/forgotPassword", authController.forgotPassword);
Router.patch("/user/resetPassword", authController.resetPassword);
Router.post("/logout", authController.logout);
Router.post("/company/register", authController.registerCompany);
Router.post("/company/login", authController.loginCompany);
Router.post("/company/refresh", authController.refreshCompany);
Router.get("/company/verify/:id", authController.verifyCompany);
Router.post("/company/forgotPassword", authController.forgotPasswordCompany);
Router.patch("/company/resetPassword", authController.resetPasswordCompany);
// Router.post("/login", authController.login);
// Router.post("/refresh", authController.refresh);
// Router.post("/logout", authController.logout);
// Router.get("/activate/:id", authController.activateEmail);

module.exports = Router;
