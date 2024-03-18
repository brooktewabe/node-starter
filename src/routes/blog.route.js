const express = require('express');
const { blogController } = require('../controller');
const validate = require('../middlewares/validate');
const { blogValidation } = require('../validations');
const auth = require('../middlewares/auth');
const upload = require('../utils/multer');
const getRecentBlogCache = require('../middlewares/caches/recent-blogs');

const router = express.Router();
router.get(
  '/blogs',
  auth,
  // validate(blogValidation.getBlogSchema),
  blogController.getBlogs,
);
router.get('/blogs/search', auth, blogController.searchBlogs);
router.get(
  '/recent-blogs',
  auth,
  getRecentBlogCache,
  blogController.getRecentBlogs,
);

router.post(
  '/blog',
  auth,
  validate(blogValidation.createBlogSchema),
  blogController.createBlog,
);

router.post(
  '/blog/cover-image',
  auth,
  upload.single('coverImage'),
  blogController.uploadFile,
);
router.get('/blog/image/:filename', auth, blogController.getFile);
module.exports = router;
