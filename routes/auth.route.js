const express = require("express");
const {authController} =require("../controller");
const validate = require("../middlewares/validate")
const {userValidation} = require('../validations')

const router = express.Router();

router.post('/auth/register',validate(userValidation.createUserSchema),authController.register);

module.exports = router;