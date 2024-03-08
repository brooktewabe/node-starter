const httpStatus = require('http-status');
const { RateLimiterMongo } = require('rate-limiter-flexible');
const mongoose = require('mongoose');
const userService = require('./user.service');
const tokenService = require('./token.service');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const config = require('../config/config');

const login = async (email, password, ipAddr) => {
  const rateLimiterOptions = {
    storeClient: mongoose.connection,
    dbName: config.dbName,
    blockDuration: 60 * 60 * 24,
  };
  const emailIpBruteLimiter = new RateLimiterMongo({
    ...rateLimiterOptions,
    points: config.rateLimiter.maxAttemptByIpUsername,
    duration: 60 * 10,
  });

  const slowerBruteLimiter = new RateLimiterMongo({
    ...rateLimiterOptions,
    points: config.rateLimiter.maxAttemptPerDay,
    duration: 60 * 60 * 24,
  });

  const emailBruteLimiter = new RateLimiterMongo({
    ...rateLimiterOptions,
    points: config.rateLimiter.maxAttemptPerEmail,
    duration: 60 * 60 * 24,
  });

  // const promises = [slowerBruteLimiter.consume(ipAddr)];
  // const user = await userService.getUserByEmail(email);
  // if (!user || !(await user.isPasswordMatch(password))) {
  //   user &&
  //     promises.push([
  //       emailIpBruteLimiter.consume(`${email}_${ipAddr}`),
  //       emailBruteLimiter.consume(email),
  //     ]);
  //   await Promise.all(promises);
  //   throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  // }
  // return user;
  try {
    await Promise.all([
      slowerBruteLimiter.consume(ipAddr),
      emailIpBruteLimiter.consume(`${email}_${ipAddr}`),
      emailBruteLimiter.consume(email),
    ]);
  } catch (error) {
    throw new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Too many requests');
  }

  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  return user;
};

const refreshAuthToken = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH,
    );
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user.id);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

module.exports = {
  login,
  refreshAuthToken,
};
