const blogRouter = require("./routes/blog.route")
const {errorHandler,errorConverter} = require("./middlewares/error")
const ApiError = require( "./utils/ApiError");
const httpStatus = require( 'http-status');
const morgan = require("./config/morgan");
const express = require('express')
const app=express()

// Bodyparser middleware
app.use(express.json())
app.use(morgan.successHandler)
app.use(morgan.errorHandler)
app.use(blogRouter)
app.use((req,res,next)=>{
    next(new ApiError(httpStatus.NOT_FOUND, "404 Not found"))
})
// converter should be before handler since it handles those that are not handled intentionally
app.use(errorConverter)
app.use(errorHandler)

module.exports = app;