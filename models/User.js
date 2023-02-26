const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
})

// although this is middleware you dont really need next() 
UserSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

//you can add methods to your schema //instanceMethods
UserSchema.methods.getName = function() {
  return this.name
}
UserSchema.methods.createJWT = function() {
  return jwt.sign({userID: this._id, name: this.name}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
}
UserSchema.methods.comparePW = async function(password) {
  const isMatch = await bcrypt.compare(password, this.password)
  return isMatch
}

module.exports = mongoose.model('User', UserSchema)