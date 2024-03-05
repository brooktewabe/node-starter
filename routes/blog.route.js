const express = require("express");
const {blogController} =require("../controller");
const validate = require("../middlewares/validate")
const {blogValidation} = require ("../validations")
const auth = require('../middlewares/auth')
const router = express.Router()
router.get('/blogs',auth,blogController.getBlogs);
router.post(
    '/blog',
    auth,
    validate(blogValidation.createBlogSchema),
    blogController.createBlog
);

module.exports = router;