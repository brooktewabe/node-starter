const express = require("express");
const {authController} =require("../controller");
const validate = require("../middlewares/validate")
const {userValidation, authValidation} = require('../validations')

const router = express.Router();

router.post('/auth/register',validate(userValidation.createUserSchema),authController.register);
router.post('/auth/login',validate(authValidation.loginSchema),authController.login);
router.post('/auth/refresh-token',validate(authValidation.refreshTokenSchema),authController.refreshToken);


module.exports = router;