const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')

const auth = async(req, res, next) => {
 //check header
 const authHeader = req.headers.authorization
 if (!authHeader || !authHeader.startsWith('Bearer ')) throw new UnauthenticatedError('Authentication invalid')
 const token = authHeader.split(' ')[1]
 try {
  const payload = jwt.verify(token, process.env.JWT_SECRET)

  //attach user to job route // so all routes are protected from other users
  req.user = {userID: payload.userID, name: payload.name}

  //alternative syntax
  const user = await User.findById(payload.userID).select('-password')
  //just fetch everything by Id and remove the password
  req.user = user

  next()
 } catch (error) {
  throw new UnauthenticatedError('Authentication Error')
 }



}

module.exports = auth