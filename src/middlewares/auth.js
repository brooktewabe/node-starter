const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const verifyCallBack = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;
  resolve();
};

const auth = async (req, res, next) =>
  new Promise((resolve, reject) => {
    passport.authenticate(
      'jwt',
      { session: false },
      verifyCallBack(req, resolve, reject),
    )(req, res, next);
  })
    // if successful allow API access
    .then(() => next())
    // else error
    .catch((error) => next(error));

module.exports = auth;
