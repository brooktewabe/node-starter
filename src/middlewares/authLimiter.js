const { RateLimiterMongo } = require('rate-limiter-flexible');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');

const rateLimiterOptions = {
  storeClient: mongoose.connection,
  dbName: config.dbName,
  blockDuration: 60 * 60 * 24,
};
// to catch attacker from sending more than 10 requests per 10 min
const emailIpBruteLimiter = new RateLimiterMongo({
  ...rateLimiterOptions,
  points: config.rateLimiter.maxAttemptByIpUsername,
  duration: 60 * 10,
});

// to catch an attacker from sending 9 requests every 10 minute
// for a long time until successful, by limiting 100 requests per day
const slowerBruteLimiter = new RateLimiterMongo({
  ...rateLimiterOptions,
  points: config.rateLimiter.maxAttemptPerDay,
  duration: 60 * 60 * 24,
});

// to catch attacker from using multiple IP since the previous one
// uses email IP combination, by limiting max allowed req per day
const emailBruteLimiter = new RateLimiterMongo({
  ...rateLimiterOptions,
  points: config.rateLimiter.maxAttemptPerEmail,
  duration: 60 * 60 * 24,
});

const authLimiter = async (req, res, next) => {
  const ipAddr = req.connection.remoteAddress;
  const emailIpKey = `${req.body.email}_${ipAddr}`;
  const [slowerBruteRes, emailIpRes, emailBruteRes] = await Promise.all([
    slowerBruteLimiter.get(ipAddr),
    emailIpBruteLimiter.get(emailIpKey),
    emailBruteLimiter.get(req.body.email),
  ]);
  let retrySeconds = 0;
  if (
    slowerBruteRes &&
    slowerBruteRes.consumedPoints >= config.rateLimiter.maxAttemptPerDay
  ) {
    retrySeconds = Math.floor(slowerBruteRes.msBeforeNext / 1000) || 1;
  } else if (
    emailIpRes &&
    emailIpRes.consumedPoints >= config.rateLimiter.maxAttemptByIpUsername
  ) {
    retrySeconds = Math.floor(emailIpRes.msBeforeNext / 1000) || 1;
  } else if (
    emailBruteRes &&
    emailBruteRes.consumedPoints >= config.rateLimiter.maxAttemptPerEmail
  ) {
    retrySeconds = Math.floor(emailBruteRes.msBeforeNext / 1000) || 1;
  }

  if (retrySeconds > 0) {
    res.set('Retry-After', String(retrySeconds));
    return next(
      new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Too many requests'),
    );
  }

  next();
};

module.exports = {
  emailIpBruteLimiter,
  slowerBruteLimiter,
  authLimiter,
  emailBruteLimiter,
};
