const { httpApiError } = require('../utils/errorBaseClass')

const errorResponder = (err, req, res, next) => {
  res.header("Content-Type", 'application/json')
  if (err instanceof httpApiError) {
    res.status(err.statusCode).send(err.errorResponse)
  } else {
    res.sendStatus(500)
  }
}

module.exports = { errorResponder }
