const blogRouter = require("./routes/blog.route")
const authRouter = require("./routes/auth.route")
const {errorHandler,errorConverter} = require("./middlewares/error")
const ApiError = require( "./utils/ApiError");
const httpStatus = require( 'http-status');
const morgan = require("./config/morgan");
const passport = require('passport')
const {jwtStrategy} = require('./config/passport')
const express = require('express')
const {xss} = require('express-xss-sanitizer')
const helmet = require('helmet')
const {cspOptions} = require( './config/config')
const app=express()

// Bodyparser middleware
app.use(express.json())
app.use(morgan.successHandler)
app.use(morgan.errorHandler)
// jwt auth
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);
// security
app.use(xss())
app.use(helmet.contentSecurityPolicy({contentSecurityPolicy:cspOptions,
    // doesn't block anything just report
    reportOnly:true
},
))
// app.use(helmet.xFrameOptions()) // uncomment to deny X-Frame-options
// app.use(helmet.noSniff())   //uncomment to prevent mime sniffing
app.use(blogRouter)
app.use(authRouter)
// path not found
app.use((req,res,next)=>{
    next(new ApiError(httpStatus.NOT_FOUND, "404 Not found"))
})
// converter should be before handler since it handles those that are not handled intentionally
app.use(errorConverter)
app.use(errorHandler)

module.exports = app;