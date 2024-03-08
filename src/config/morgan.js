const morgan = require('morgan'); // to log http requests info
const fs = require('fs');
const path = require('path');
const config = require('./config');

morgan.token('message', (req, res) => res.locals.errorMessage || '');

const getIPFormat = () =>
  config.env === 'production' ? ':remote-addr - ' : '';
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, '..', 'logs/access.log'),
  { flags: 'a' },
);
const successResponseformat = `${getIPFormat()} :method :url :status :response-time ms :user-agent :date`;
const successHandler = morgan(successResponseformat, {
  stream: accessLogStream,
  skip: (req, res) => res.statusCode >= 400,
});

const errorResponseformat = `${getIPFormat()} :method :url :status :response-time ms :user-agent :date - error-message: :message`;
const errorHandler = morgan(errorResponseformat, {
  stream: accessLogStream,
  skip: (req, res) => res.statusCode < 400,
});

module.exports = { successHandler, errorHandler };
