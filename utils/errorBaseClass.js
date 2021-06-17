const { _error1 } = require('../constants');

class httpApiError extends Error {
  constructor(status, message, data = []) {
    super()
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, httpApiError)
    }
    this.statusCode = status || 404
    this.message = message
    this.errorResponse = _error1(status, message, data)
  }
}

module.exports = {
  httpApiError,
};