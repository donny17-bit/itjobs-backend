const express = require("express");

const Router = express.Router();

const companyController = require("./companyController");
const middlewareAuth = require("../../middleware/auth");
const middlewareUploadImage = require("../../middleware/uploadImageUser");

Router.get(
  "/:id",
  middlewareAuth.isAdminAuthentication,
  companyController.getCompanyByCompanyId
);
Router.patch(
  "/updateCompanyProfile/:id",
  middlewareAuth.isAdminAuthentication,
  companyController.updateProfileCompany
);
Router.patch(
  "/updateCompanyImage/:id",
  middlewareAuth.isAdminAuthentication,
  middlewareUploadImage,
  companyController.updateImageCompany
);
Router.patch(
  "/updateCompanyPassword/:id",
  middlewareAuth.isAdminAuthentication,
  companyController.updatePasswordCompany
);
Router.delete(
  "/deleteImage/:id",
  middlewareUploadImage,
  middlewareAuth.isAdminAuthentication,
  companyController.deleteImage
);
module.exports = Router;
