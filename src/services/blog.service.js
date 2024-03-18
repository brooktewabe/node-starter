const fs = require('fs');
const sharp = require('sharp');
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
  // .lean(); // optimizes performance by not loading the full mongoose model into memory
  // but doesn't work with save(), getters and setters.. inside models
  return blogs;
};

// search anything indexed text(full text search not exact match)
const searchBlogs = async (searchQuery) => {
  const blogs = await Blog.find({ $text: { $search: searchQuery } });
  return blogs;
};
const getRecentBlogs = async () => {
  const blogs = await Blog.find()
    .sort({
      createdAt: -1, // descending time order
    })
    .limit(5); // cache latest 5 blogs
  // .lean(); // optimizes performance
  redisClient.set('recent-blogs', JSON.stringify(blogs));
  return blogs;
};
const uploadFile = async (file) => {
  const filename = `image-${Date.now()}.webp`;
  const outputPath = `${__dirname}/../../uploads/${filename}`;
  // resize file size and image size to 600 px, loseless: true - to maintain quality
  sharp(file.buffer).resize(600).webp({ quality: 80 }).toFile(outputPath);
  return filename;
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
  uploadFile,
  getRecentBlogs,
  getReadableFileStream,
  searchBlogs,
};
