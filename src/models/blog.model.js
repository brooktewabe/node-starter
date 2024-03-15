const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  descreption: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
