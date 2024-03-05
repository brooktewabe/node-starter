const userService = require('./user.service')
const httpstatus = require('http-status')
const ApiError = require('../utils/ApiError')

const login =async(email,password) =>{
    const user = userService.getUserByEmail(email)
    if(!user || !(await user.isPasswordMatch(password))){
        throw new ApiError(httpstatus.UNAUTHORIZED,'Invalid email or password')
    }
    return user;
}

module.exports={
    login
}