const logger = require("../config/logger")
require('dotenv').config();
const envVarSchema = require("../validations/env.validation")

const { value: envVars, error } = envVarSchema.validate(process.env);
if (error) {
    logger.error(error);
}

module.exports = {
    port: envVars.PORT,
    dbConnection: envVars.DB_CONNECTION,
    env: envVars.NODE_ENV,
};