const mongoose = require('mongoose');
const toJson = require('@meanie/mongoose-to-json');

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      // wouldn't work with lean
      get(value) {
        return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
      },
    },
    descreption: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },

    // createdBy: {
    //   type: mongoose.SchemaTypes.ObjectId,
    //  here we are referencing instead of embeding, if we embed there
    //        will be repetition of data( 1 user many blogs)
    //   ref: 'User',
    //   required: true,
    // },

    // embeding  schema for comments (enclosed with array since there can be many)
    comments: [commentSchema],
  },
  { toJSON: { getters: true } },
  {
    timestamps: true,
  },
);
// add index based on title and description
blogSchema.index({ title: 'text', descreption: 'text' });
blogSchema.plugin(toJson);
const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
