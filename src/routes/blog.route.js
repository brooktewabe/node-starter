const express = require('express');
const { blogController } = require('../controller');
const validate = require('../middlewares/validate');
const { blogValidation } = require('../validations');
const auth = require('../middlewares/auth');
const upload = require('../utils/multer');

const router = express.Router();
router.get(
  '/blogs',
  auth,
  // validate(blogValidation.getBlogSchema),
  blogController.getBlogs,
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
// eslint-disable-next-line prettier/prettier
router.get('/blog/image/:filename', auth, blogController.getFile);
module.exports = router;
