const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { blogService } = require('../services');
const ApiError = require('../utils/ApiError');
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

const searchBlogs = catchAsync(async (req, res) => {
  const { searchQuery } = req.query;
  const blogs = await blogService.searchBlogs(searchQuery);
  res.json({ blogs });
});

// redis caching 5 recent blogs until new one is added
const getRecentBlogs = catchAsync(async (req, res) => {
  const blogs = await blogService.getRecentBlogs();
  res.status(httpStatus.OK).json(blogs);
});

// first upload file using upload route then use it in createBlog body
const uploadFile = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  const filename = await blogService.uploadFile(req.file);
  res.status(httpStatus.OK).json({ fileName: filename });
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
  getRecentBlogs,
  uploadFile,
  getFile,
  searchBlogs,
};
