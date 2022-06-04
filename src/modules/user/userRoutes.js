const express = require("express");

const Router = express.Router();

const userController = require("./userController");
const middlewareAuth = require("../../middleware/auth");
const middlewareUploadImage = require("../../middleware/uploadImageUser");

Router.get(
  "/",

  userController.getAllUser
);
Router.get(
  "/:id",

  userController.getUserByUserId
);
Router.patch(
  "/updateProfile/:id",
  middlewareAuth.userAuthentication,
  userController.updateProfile
);
Router.patch(
  "/updateImage/:id",
  middlewareUploadImage,
  middlewareAuth.userAuthentication,
  userController.updateImage
);
Router.patch(
  "/updatePassword/:id",
  middlewareAuth.userAuthentication,
  userController.updatePassword
);
Router.delete(
  "/deleteImage/:id",
  middlewareUploadImage,
  middlewareAuth.userAuthentication,
  userController.deleteImage
);
module.exports = Router;
