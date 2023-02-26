// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  const customErrorObject = {
    //set defaults
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later'
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // } //handled by customErrorObject
  if (err.code && err.code === 11000) {
    customErrorObject.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
    customErrorObject.statusCode = StatusCodes.BAD_REQUEST
  }
  if(err.name === "ValidationError") {
    customErrorObject.msg = `Please provide ${[...Object.keys(err.errors)].join(", ")}!`
    customErrorObject.statusCode = StatusCodes.BAD_REQUEST
  }
  if(err.name === "CastError") {
    customErrorObject.msg = `There isn't a job with the id ${err.value}`
    customErrorObject.statusCode = StatusCodes.NOT_FOUND
  }
  return res.status(customErrorObject.statusCode).json({ msg: customErrorObject.msg} )
}

module.exports = errorHandlerMiddleware
