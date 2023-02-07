const logger = require('../handlers/logger')
function logError(err, req, res, next) {
  next(err);
}
function returnError(err, req, res, next) {
  logger.error(err)
  res.status(err.statusCode || 500).json({ message: err.message });
}
module.exports = {
  logError,
  returnError,
};
