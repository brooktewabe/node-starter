const joi = require('joi');

const createBlogSchema = {
  body: joi.object().keys({
    title: joi.string().required(),
    descreption: joi.string().required(),
    // createdBy: joi.string().custom(objectId).required(),
    coverImage: joi.string().required(),
  }),
};

module.exports = {
  createBlogSchema,
};
