const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { blogService } = require('../services');
const ApiError = require('../utils/ApiError');
const { ImageProcessor } = require('../background-tasks');
const workers = require('../background-tasks/workers');

// removing error handing since controllers doesn't need to worry about error
// const {createBlogSchema} = require("../validations/blog.validation")
// const createBlog = async (req, res) => {
//     try {
//         const value = await createBlogSchema.body.validateAsync(req.body);
//         await Blog.create(value);
//         res.send({ success: true, message: "Blog created" })
//     } catch (error) {
//         res.status(400).send({ error: true, message: error.message });
//     }
// }

const createBlog = catchAsync(async (req, res) => {
  await blogService.createBlog(req.body);
  res
    .status(httpStatus.CREATED)
    .send({ success: true, message: 'Blog created' });
});

const getBlogs = catchAsync(async (req, res) => {
  const blogs = await blogService.getBlogs();
  res.status(httpStatus.OK).json(blogs);
});

const uploadFile = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  // run upload task in the background and  return file name immediately
  const fileName = `image-${Date.now()}.webp`;
  await ImageProcessor.Queue.add('ImageProcessorJob', {
    fileName,
    file: req.file,
  });
  await workers.start();
  res.status(httpStatus.OK).json({ fileName });
});
const getFile = catchAsync(async (req, res) => {
  const { filename } = req.params;
  const stream = await blogService.getReadableFileStream(filename);
  const contentType = `image/${filename.split('.')[1].toLowerCase()}`;
  res.setHeader('Content-Type', contentType);
  stream.pipe(res);
});

module.exports = {
  createBlog,
  getBlogs,
  uploadFile,
  getFile,
};
