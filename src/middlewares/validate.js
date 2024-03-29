const joi = require('joi');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const validate = (schema) => (req, res, next) => {
  // const keys = ['params', 'query' , 'body']
  const keys = Object.keys(schema);
  const object = keys.reduce((obj, key) => {
    // accumulator returns only keys that has values
    if (Object.prototype.hasOwnProperty.call(req, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = req[key];
    }
    return obj;
  }, {});
  logger.info(object);

  // to convert the schema def to convinient joy schema obj
  const { error } = joi.compile(schema).validate(object);
  if (error) {
    const errors = error.details.map((detail) => detail.message).join(',');

    next(new ApiError(400, errors));
  }
  return next();
};

module.exports = validate;
