const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helpers/wrapper");
const authModel = require("./authModel");
const redis = require("../../config/redis");
// const { sendMail } = require("../../helpers/mail");

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
      //   const setSendEmail = {
      //     to: email,
      //     subject: "Email Verification !",
      //     name: fullName,
      //     template: "emailSend.html",
      //     buttonUrl: `localhost:3001/auth/activate/${setData.id}`,
      //   };
      // const sendEmail = setSendEmail.buttonUrl;
      // if (!setSendEmail.email) {
      //   return helperWrapper.response(
      //     response,
      //     400,
      //     "activate your account",
      //     null
      //   );
      // }
      //   await sendMail(setSendEmail);
      // activation code
      const result = await authModel.register(setData);
      const dataId = result.email;
      return helperWrapper.response(
        response,
        200,
        `succes register user , activate account to Log In your activate code is localhost:3001/auth/activate/${dataId}`,
        result
      );
    } catch (error) {
      console.log(error);
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
      if (checkUser[0].status === "not active") {
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
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  // eslint-disable-next-line consistent-return
  refresh: async (request, response) => {
    try {
      console.log(request.body);
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
        console.log(result);
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
      //   const setSendEmail = {
      //     to: email,
      //     subject: "Email Verification !",
      //     name: fullName,
      //     template: "emailSend.html",
      //     buttonUrl: `localhost:3001/auth/activate/${setData.id}`,
      //   };
      // const sendEmail = setSendEmail.buttonUrl;
      // if (!setSendEmail.email) {
      //   return helperWrapper.response(
      //     response,
      //     400,
      //     "activate your account",
      //     null
      //   );
      // }
      //   await sendMail(setSendEmail);
      // activation code
      const result = await authModel.registerCompany(setData);
      //   const dataId = result.email;
      return helperWrapper.response(
        response,
        200,
        `succes register company`,
        result
      );
    } catch (error) {
      console.log(error);
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
      if (checkUser[0].status === "not active") {
        return helperWrapper.response(
          response,
          404,
          "activate your account first",
          null
        );
      }
      // // validasi ROLE

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
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  // eslint-disable-next-line consistent-return
  refreshCompany: async (request, response) => {
    try {
      console.log(request.body);
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
        console.log(result);
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
};
