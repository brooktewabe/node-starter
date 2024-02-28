const httpStatus = require('http-status');
const catchAsync = require("../utils/catchAsync")
const {blogService} = require('../services')

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

const createBlog = catchAsync(async(req, res) => {
    // await Blog.create(req.body) adding services
    await blogService.createBlog(req.body);
    res
    .status(httpStatus.CREATED)    
    .send({ success: true, message: "Blog created" })
})

const getBlogs =catchAsync(async (req, res) => {
    const blogs = await blogService.getBlogs();
    res.status(httpStatus.OK).json(blogs)
})

module.exports= {
    createBlog,
    getBlogs
}