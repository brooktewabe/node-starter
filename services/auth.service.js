const userService = require('./user.service')
const httpstatus = require('http-status')
const ApiError = require('../utils/ApiError')
const tokenService = require('./token.service')
const { tokenTypes } = require('../config/tokens')

const login = async (email, password) => {
    const user = await userService.getUserByEmail(email)
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(httpstatus.UNAUTHORIZED, 'Invalid email or password')
    }
    return user;
}

const refreshAuthToken = async (refreshToken) => {
    try {
        // verify if refresh token is valid
        const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
        // if refresh token is found fetch user
        const user = await userService.getUserById(refreshTokenDoc.user)
        if (!user) {
            throw new Error();
        }
        // if user is found remove old refresh token from db and create new one
        await refreshTokenDoc.deleteOne();
        return tokenService.generateAuthTokens(user.id)
    } catch (error) {
        // console.error(error); // Log the actual error
        throw new ApiError(httpstatus.UNAUTHORIZED, 'Please authenticate') 
    }
}


module.exports = {
    login,
    refreshAuthToken
}