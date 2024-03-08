/* eslint-disable no-return-await */
const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const createUser = async (userBody) => {
  // check if email exist
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(userBody);
  return user;
};

const getUserByEmail = async (email) => await User.findOne({ email });
const getUserById = async (id) => await User.findById(id);
module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
};
