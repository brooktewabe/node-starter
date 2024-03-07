const express = require("express");
const {authController} =require("../controller");
const validate = require("../middlewares/validate")
const {userValidation, authValidation} = require('../validations')
const {authLimiter} = require('../middlewares/authLimiter')

const router = express.Router();

router.post('/auth/register',authLimiter,validate(userValidation.createUserSchema),authController.register);
router.post('/auth/login',validate(authValidation.loginSchema),authController.login);
router.post('/auth/refresh-token',validate(authValidation.refreshTokenSchema),authController.refreshToken);


module.exports = router;