const jwt = require("jsonwebtoken");
const helperWrapper = require("../helpers/wrapper");
const redis = require("../config/redis");

module.exports = {
  // eslint-disable-next-line consistent-return
  userAuthentication: async (request, response, next) => {
    let token = request.headers.authorization;
    if (!token) {
      return helperWrapper.response(response, 403, "please login first", null);
    }
    token = token.split(" ")[1];

    const checkRedis = await redis.get(`accessToken:${token}`);
    if (checkRedis) {
      return helperWrapper.response(
        response,
        403,
        "Your token is destroyed please login again",
        null
      );
    }
    // eslint-disable-next-line consistent-return
    jwt.verify(token, "RAHASIA", (error, result) => {
      if (error) {
        return helperWrapper.response(
          response,
          403,
          "plis login to user",
          null
        );
      }
      request.decodeToken = result;
      // decodeToken= data user log in
      next();
    });
  },
  // eslint-disable-next-line consistent-return
  isAdminAuthentication: (request, response, next) => {
    let token = request.headers.authorization;
    if (!token) {
      return helperWrapper.response(response, 403, "please login first", null);
    }
    token = token.split(" ")[1];

    // eslint-disable-next-line consistent-return
    jwt.verify(token, "SECRET", (error, result) => {
      if (error) {
        return helperWrapper.response(
          response,
          403,
          "you're not login as company",
          null
        );
      }
      request.decodeToken = result;
      // decodeToken= data user log in
      next();
    });
    // console.log(request.decodeToken);
    // tambahkan  proses untuk mengecek apakah yang login itu admin?
    // jika tidak berikan respon error
    // jika ya lanjutkan ke controller
  },
};
