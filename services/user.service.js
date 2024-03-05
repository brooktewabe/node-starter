const {User} = require("../models")
const ApiError = require('../utils/ApiError')
const httpStatus= require('http-status')

const createUser =async(userBody) => {
    // check if email exist
    if (await User.isEmailTaken(userBody.email)){
        throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken"); 

    }
   const user= await User.create(userBody);
   return user;
}

const getUserByEmail= async(email)=>{
    return await User.findOne({email})
}

module.exports= {
    createUser,
    getUserByEmail
}