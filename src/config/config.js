const logger = require('./logger');
require('dotenv').config();
const { envValidation } = require('../validations');

const { value: envVars, error } = envValidation.validate(process.env);
if (error) {
  logger.error(error);
}

module.exports = {
  port: envVars.PORT,
  dbConnection: envVars.DB_CONNECTION,
  dbName: envVars.DB_NAME,
  env: envVars.NODE_ENV,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },
  rateLimiter: {
    maxAttemptPerDay: envVars.MAX_ATTEMPT_PER_DAY,
    maxAttemptByIpUsername: envVars.MAX_ATTEMPT_BY_IP_USERNAME,
    maxAttemptPerEmail: envVars.MAX_ATTEMPT_PER_EMAIL,
  },
  cspOptions: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // allow exec of inline styles
      scriptSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
    },
  },
};
