const fs = require('fs');
const httpStatus = require('http-status');
const redisClient = require('../config/redis');
const { Blog } = require('../models');
const ApiError = require('../utils/ApiError');

const createBlog = async (body) => {
  await Blog.create({ ...body });
  // remove cached blogs if new one is added (event based  cache invalidation)
  await redisClient.del('recent-blogs');
};

const getBlogs = async () => {
  const blogs = await Blog.find({});
  return blogs;
};

const getRecentBlogs = async () => {
  const blogs = await Blog.find()
    .sort({
      createdAt: -1, // descending time order
    })
    .limit(5); // cache latest 5 blogs
  redisClient.set('recent-blogs', JSON.stringify(blogs));
  return blogs;
};

const getReadableFileStream = async (filename) => {
  const filePath = `${__dirname}/../../uploads/${filename}`;
  if (!fs.existsSync(filePath)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  const stream = fs.createReadStream(filePath);
  return stream;
};

module.exports = {
  createBlog,
  getBlogs,
  getRecentBlogs,
  getReadableFileStream,
};
