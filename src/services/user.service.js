const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const EventEmitter = require('../utils/EventEmitter');

const createUser = async (userBody) => {
  // check if email exists
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already taken');
  }
  const user = await User.create(userBody);
  // send success Email when signing  up but we've to enable 2 step verification on
  //  in our google account security on the account listed on .env else error
  EventEmitter.emit('signup', user);
  return user;
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};
module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
};
