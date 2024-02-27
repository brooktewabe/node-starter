const express = require("express");
const {getBlogs,createBlog} =require("../controller/blog.controller");
const validate = require("../middlewares/validate")
const {createBlogSchema} = require ("../validations/blog.validation")

const router = express.Router();

router.get('/blogs',getBlogs);
router.post('/blog', validate(createBlogSchema), createBlog);

module.exports = router;