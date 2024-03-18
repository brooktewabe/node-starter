const mongoose = require('mongoose');
const toJson = require('@meanie/mongoose-to-json');

const blogSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  },
);
blogSchema.plugin(toJson);
const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
