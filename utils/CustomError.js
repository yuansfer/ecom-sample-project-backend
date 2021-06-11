class CustomError extends Error {
  constructor(params) {
    console.log('params', params)
    super(params)
    this.code = params.code;
    this.message = params.message;
  }
}

module.exports = {
  CustomError
}