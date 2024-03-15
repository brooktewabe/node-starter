// eslint-disable-next-line import/no-extraneous-dependencies
// used for file uploading throughout the project
const multer = require('multer');
const httpStatus = require('http-status');
const ApiError = require('./ApiError');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const filePath = `${__dirname}/../../uploads`;
    cb(null, filePath);
  },
  filename(req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

module.exports = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // limit  to 3MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(
        new ApiError(httpStatus.BAD_REQUEST, 'Only images are allowed'),
        false,
      );
    } else {
      cb(null, true);
    }
  },
});
