const logger = require('../handlers/logger')
function logError(error, req, res, next) {
  next(error);
}
function returnError(error, req, res, next) {
  logger.error(error)
  res.status(error.statusCode || 500).json({ error: error.message });
}
module.exports = {
  logError,
  returnError,
};
