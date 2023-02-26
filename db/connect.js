const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const connectDB = (url) => {
  return mongoose.connect(url).then(() => console.log("connected to database..."))
}

module.exports = connectDB
