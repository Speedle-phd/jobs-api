const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
// const bcrypt = require('bcryptjs')

const register = async (req, res, next) => {
  // const {name,email,password} = req.body
  // if(!name||!email||!password) throw new BadRequestError('Please provide name, email and password')
  //hash password       (the following is handled by model and pre()-middleware which is executed before something is saved)
  // const {name,email,password} = req.body
  //the bigger the genSalt Value the securer, but takes more performance, default: 10
  // const salt = await bcrypt.genSalt(10)
  //hashPW takes String and salt-value
  // const hashedPW = await bcrypt.hash(password, salt)
  // const tempUser = {name,email,password:hashedPW}
  const user = await User.create({ ...req.body })
  // handled as method in model UserSchema
  // const token = jwt.sign(
  //   { userId: user._id, name: user.name },
  //   process.env.JWT_SECRET,
  //   { expiresIn: '30d' }
  // )
  const token = user.createJWT()
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.getName() }, token })
}
const login = async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password)
    throw new BadRequestError('Please provide email and password')
  const user = await User.findOne({ email })
  if (!user) throw new UnauthenticatedError('Invalid credentials')
  const isMatchingPW = await user.comparePW(password)
  if (!isMatchingPW) throw new UnauthenticatedError('Invalid password')
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = { register, login }
