const logger = require('./logEvents');
const multer = require('multer');

const errorHandler = (error, req, res, next) => {
  const response = { ...serverResponse };
  if (error === 'fileTypeError') {
    logger({}).log({ level: 'error', message: `ErrorHandler Multer : `, error });
    response.message = 'Only jpeg,png and jpg images are allowed';
    response.status = 400;
    return res.status(400).json(response);
  }
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      logger({}).log({
        level: 'error',
        message: `ErrorHandler Multer tenantId LIMIT_FILE_SIZE : `,
        error,
      });
      response.message = 'File should be less than 5 mb';
      response.status = 400;
      return res.status(400).json(response);
    } else {
      logger({}).log({ level: 'error', message: `MulterError : `, error });
      response.message = `Oops something went wrong.`;
      response.status = 500;
      return res.status(500).json(response);
    }
  }
  if (error !== 'fileTypeError' && error instanceof multer.MulterError === false) {
    logger({}).log({ level: 'error', message: `ErrorHandler Multer : `, error });
    response.message = 'Oops something went wrong.';
    response.status = 500;
    return res.status(500).json(response);
  }
  next();
};

module.exports = errorHandler;
