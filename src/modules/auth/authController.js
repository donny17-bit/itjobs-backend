const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helpers/wrapper");
const authModel = require("./authModel");
const redis = require("../../config/redis");
const helperMailer = require("../../helpers/mail");

module.exports = {
  register: async (request, response) => {
    try {
      // pasword hash
      const { password } = request.body;

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const { fullName, email, noTelp, confirmPassword } = request.body;
      const setData = {
        id: uuidv4(),
        fullName,
        email,
        noTelp,
        password: hash,
      };
      if (!fullName) {
        return helperWrapper.response(
          response,
          400,
          "fill your full name box",
          null
        );
      }
      // must fill email
      if (!email) {
        return helperWrapper.response(response, 400, "fill email box", null);
      }

      if (!noTelp) {
        return helperWrapper.response(
          response,
          400,
          "fill your phone box",
          null
        );
      }
      // email must contain @gmail.com
      const emailValid = email.split("@", 1);
      const emailValid2 = email.split("@", 2);
      if (email !== `${emailValid[0]}@${emailValid2[1]}`) {
        return helperWrapper.response(
          response,
          400,
          "email is not valid",
          null
        );
      }
      const dataEmail = await authModel.getEmail(email);
      if (dataEmail.length > 0) {
        return helperWrapper.response(
          response,
          400,
          "email already registered",
          null
        );
      }
      if (!password) {
        return helperWrapper.response(response, 400, "fill password box", null);
      }
      if (password !== confirmPassword) {
        return helperWrapper.response(
          response,
          400,
          "confirm password didn't match",
          null
        );
      }
      const result = await authModel.register(setData);

      const setSendEmail = {
        to: email,
        subject: "Email Verification !",
        name: fullName,
        template: "verificationEmail.html",
        authCode: result.id,
        buttonUrl: `google.com`,
        linkENV: process.env.LINK_BACKEND,
      };
      await helperMailer.sendMail(setSendEmail);
      // activation code

      return helperWrapper.response(
        response,
        200,
        `succes register user , check your email and activate account to Log In `,
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  login: async (request, response) => {
    try {
      const { email } = request.body;
      const checkUser = await authModel.getUserByEmail(email);
      // email not found check
      if (checkUser.length < 1) {
        return helperWrapper.response(
          response,
          404,
          "email not registed",
          null
        );
      }
      if (checkUser[0].status == "notActive") {
        return helperWrapper.response(
          response,
          404,
          "activate your account first",
          null
        );
      }
      // // validasi ROLE

      const { password } = request.body;
      const checkPassword = await authModel.getUserByPassword(email);
      const stringPass = checkPassword[0].password;

      const validPass = await bcrypt.compare(password, stringPass);

      // if wrong password
      if (!validPass) {
        return helperWrapper.response(response, 400, "wrong password", null);
      }
      // prosess jwt
      const payload = checkUser[0];
      delete payload.password;
      const secretAccesToken = "RAHASIA";
      const secretRefreshToken = "RAHASIABARU";
      const token = jwt.sign({ ...payload }, secretAccesToken, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign({ ...payload }, secretRefreshToken, {
        expiresIn: "24h",
      });
      return helperWrapper.response(response, 200, "succes login", {
        id: payload.id,
        token,
        refreshToken,
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  // eslint-disable-next-line consistent-return
  refresh: async (request, response) => {
    try {
      const { refreshToken } = request.body;
      const checkToken = await redis.get(`refreshToken:${refreshToken}`);
      if (checkToken) {
        return helperWrapper.response(
          response,
          403,
          "Your refresh token cannot be use",
          null
        );
      }

      jwt.verify(refreshToken, "RAHASIABARU", async (error, result) => {
        // eslint-disable-next-line no-param-reassign
        delete result.iat;
        // eslint-disable-next-line no-param-reassign
        delete result.exp;
        const token = jwt.sign(result, "RAHASIA", { expiresIn: "1h" });
        const newRefreshToken = jwt.sign(result, "RAHASIABARU", {
          expiresIn: "24h",
        });
        await redis.setEx(
          `refreshToken:${refreshToken}`,
          3600 * 48,
          refreshToken
        );
        return helperWrapper.response(response, 200, "Success refresh token", {
          id: result.id,
          token,
          refreshToken: newRefreshToken,
        });
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  verify: async (request, response) => {
    try {
      const { id } = request.params;
      const checkResult = await authModel.getUserByUserId(id);
      if (checkResult.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const result = await authModel.verify(id);

      return helperWrapper.response(
        response,
        200,
        "succes verify account",
        result
      );
    } catch (error) {
      return helperWrapper.response(
        response,
        400,
        "failed verify account",
        null
      );
    }
  },
  forgotPassword: async (request, response) => {
    try {
      // pasword hash
      const { email, linkDirect } = request.body;
      const dataEmail = await authModel.getEmail(email);
      if (dataEmail.length < 1) {
        return helperWrapper.response(
          response,
          404,
          "email not registed",
          null
        );
      }
      const otp = Math.floor(Math.random() * 899999 + 100000);

      const setSendEmail = {
        to: email,
        subject: "Forgot Password Verification!",
        template: "forgotPassword.html",
        otpKey: otp,
        linkENV: process.env.LINK_FRONTEND,
        buttonUrl: otp,
      };
      await helperMailer.sendMail(setSendEmail);
      // activation code
      const result = await authModel.setOTP(email, otp);
      return helperWrapper.response(
        response,
        200,
        `email valid check your email box for reset password `,
        email
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  resetPassword: async (request, response) => {
    try {
      const { keyChangePassword, newPassword, confirmPassword } = request.body;
      const checkResult = await authModel.getOTP(keyChangePassword);
      if (checkResult.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `your key is not valid`,
          null
        );
      }
      const id = checkResult[0].id;
      // eslint-disable-next-line no-restricted-syntax
      if (newPassword !== confirmPassword) {
        return helperWrapper.response(
          response,
          400,
          "password Not Match",
          null
        );
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(confirmPassword, salt);
      const setData = {
        confirmPassword: hash,
        updatedAt: new Date(Date.now()),
      };
      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }
      const result = await authModel.updatePassword(id, hash, setData);

      return helperWrapper.response(
        response,
        200,
        "succes reset Password",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  logout: async (request, response) => {
    try {
      let token = request.headers.authorization;
      const { refreshToken } = request.body;
      token = token.split(" ")[1];
      redis.setEx(`accessToken:${token}`, 3600 * 24, token);
      redis.setEx(`refreshToken:${refreshToken}`, 3600 * 24, token);
      return helperWrapper.response(response, 200, "Success logout", null);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  registerCompany: async (request, response) => {
    try {
      // pasword hash
      const { password } = request.body;

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const {
        fullName,
        email,
        companyName,
        companyField,
        noTelp,
        confirmPassword,
      } = request.body;
      const setData = {
        id: uuidv4(),
        fullName,
        email,
        companyField,
        companyName,
        noTelp,
        password: hash,
      };

      if (!fullName) {
        return helperWrapper.response(
          response,
          400,
          "fill your full name box",
          null
        );
      }
      // must fill email
      if (!email) {
        return helperWrapper.response(response, 400, "fill email box", null);
      }
      if (!companyName) {
        return helperWrapper.response(
          response,
          400,
          "fill your company name",
          null
        );
      }
      if (!companyField) {
        return helperWrapper.response(
          response,
          400,
          "fill your company field",
          null
        );
      }
      if (!noTelp) {
        return helperWrapper.response(
          response,
          400,
          "fill your phone box",
          null
        );
      }
      // email must contain @gmail.com
      const emailValid = email.split("@", 1);
      const emailValid2 = email.split("@", 2);
      if (email !== `${emailValid[0]}@${emailValid2[1]}`) {
        return helperWrapper.response(
          response,
          400,
          "email is not valid",
          null
        );
      }
      const dataEmail = await authModel.getEmail(email);
      if (dataEmail.length > 0) {
        return helperWrapper.response(
          response,
          400,
          "email already registered",
          null
        );
      }
      if (!password) {
        return helperWrapper.response(response, 400, "fill password box", null);
      }
      if (password !== confirmPassword) {
        return helperWrapper.response(
          response,
          400,
          "confirm password didn't match",
          null
        );
      }

      const result = await authModel.registerCompany(setData);
      const setSendEmail = {
        to: email,
        subject: "Email Verification !",
        name: companyName,
        template: "verificationEmailCompany.html",
        authCode: result.id,
        buttonUrl: `google.com`,
        linkENV: process.env.LINK_BACKEND,
      };
      await helperMailer.sendMail(setSendEmail);
      //   const dataId = result.email;
      return helperWrapper.response(
        response,
        200,
        `succes register company`,
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  loginCompany: async (request, response) => {
    try {
      const { email } = request.body;
      const checkUser = await authModel.getUserByEmailCompany(email);
      // email not found check
      if (checkUser.length < 1) {
        return helperWrapper.response(
          response,
          404,
          "email not registed",
          null
        );
      }
      if (checkUser[0].status === "notActive") {
        return helperWrapper.response(
          response,
          404,
          "activate your account first",
          null
        );
      }
      // validasi ROLE
      const { password } = request.body;
      const checkPassword = await authModel.getUserByPasswordCompany(email);
      const stringPass = checkPassword[0].password;

      const validPass = await bcrypt.compare(password, stringPass);

      // if wrong password
      if (!validPass) {
        return helperWrapper.response(response, 400, "wrong password", null);
      }
      // prosess jwt
      const payload = checkUser[0];
      delete payload.password;
      const secretAccesToken = "SECRET";
      const secretRefreshToken = "SECRETBARU";
      const token = jwt.sign({ ...payload }, secretAccesToken, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign({ ...payload }, secretRefreshToken, {
        expiresIn: "24h",
      });
      return helperWrapper.response(response, 200, "succes login as company", {
        id: payload.id,
        token,
        refreshToken,
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  // eslint-disable-next-line consistent-return
  refreshCompany: async (request, response) => {
    try {
      const { refreshToken } = request.body;
      const checkToken = await redis.get(`refreshToken:${refreshToken}`);
      if (checkToken) {
        return helperWrapper.response(
          response,
          403,
          "Your refresh token cannot be use",
          null
        );
      }

      jwt.verify(refreshToken, "SECRETBARU", async (error, result) => {
        // eslint-disable-next-line no-param-reassign
        delete result.iat;
        // eslint-disable-next-line no-param-reassign
        delete result.exp;
        const token = jwt.sign(result, "SECRET", { expiresIn: "1h" });
        const newRefreshToken = jwt.sign(result, "SECRETBARU", {
          expiresIn: "24h",
        });
        await redis.setEx(
          `refreshToken:${refreshToken}`,
          3600 * 48,
          refreshToken
        );
        return helperWrapper.response(response, 200, "Success refresh token", {
          id: result.id,
          token,
          refreshToken: newRefreshToken,
        });
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  verifyCompany: async (request, response) => {
    try {
      const { id } = request.params;
      const checkResult = await authModel.getCompanyByCompanyId(id);
      if (checkResult.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const result = await authModel.verifyCompany(id);

      return helperWrapper.response(
        response,
        200,
        "succes verify account",
        result
      );
    } catch (error) {
      return helperWrapper.response(
        response,
        400,
        "failed verify account",
        null
      );
    }
  },
  forgotPasswordCompany: async (request, response) => {
    try {
      // pasword hash
      const { email, linkDirect } = request.body;
      const dataEmail = await authModel.getEmailCompany(email);
      if (dataEmail.length < 1) {
        return helperWrapper.response(
          response,
          404,
          "email not registed",
          null
        );
      }
      const otp = Math.floor(Math.random() * 899999 + 100000);

      const setSendEmail = {
        to: email,
        subject: "Forgot Password Verification!",
        template: "forgotPasswordCompany.html",
        otpKey: otp,
        buttonUrl: otp,
        linkENV: process.env.LINK_FRONTEND,
      };
      await helperMailer.sendMail(setSendEmail);
      // activation code
      const result = await authModel.setOTPCompany(email, otp);
      return helperWrapper.response(
        response,
        200,
        `email valid check your email box for reset password `,
        email
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  resetPasswordCompany: async (request, response) => {
    try {
      const { keyChangePassword, newPassword, confirmPassword } = request.body;
      const checkResult = await authModel.getOTPCompany(keyChangePassword);
      if (checkResult.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `your key is not valid`,
          null
        );
      }
      const id = checkResult[0].id;
      // eslint-disable-next-line no-restricted-syntax
      if (newPassword !== confirmPassword) {
        return helperWrapper.response(
          response,
          400,
          "password Not Match",
          null
        );
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(confirmPassword, salt);
      const setData = {
        confirmPassword: hash,
        updatedAt: new Date(Date.now()),
      };
      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }
      const result = await authModel.updatePasswordCompany(id, hash, setData);

      return helperWrapper.response(
        response,
        200,
        "succes reset Password",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
