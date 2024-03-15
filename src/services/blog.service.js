const fs = require('fs');
const sharp = require('sharp');
const httpStatus = require('http-status');
const { Blog } = require('../models');
const ApiError = require('../utils/ApiError');

const createBlog = async (body) => {
  await Blog.create({ ...body });
};

const getBlogs = async () => {
  const blogs = await Blog.find({});
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
const uploadFile = async (file) => {
  const filename = `image-${Date.now()}.webp`;
  const outputPath = `${__dirname}/../../uploads/${filename}`;
  // resize file size and image size to 600 px, loseless: true - to maintain quality
  sharp(file.buffer).resize(600).webp({ quality: 80 }).toFile(outputPath);
  return filename;
};

module.exports = {
  createBlog,
  getBlogs,
  getReadableFileStream,
  uploadFile,
};
