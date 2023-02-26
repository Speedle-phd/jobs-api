const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
 company: {
  type: String,
  maxlength: 50,
  required: [true, 'Please provide a company name']
 },
 position: {
  type: String,
  maxlength: 100,
  required: [true, 'Please provide a company name'],
 },
 status: {
  type: String,
  enum: ['interview', 'client', 'pending'],
  default: 'pending',
 },
 // every time we create a job we associate it with a user
 createdBy: {
  type: mongoose.Types.ObjectId,
  ref: 'User',
  required: [true, 'Please provide an user']
 }
},{timestamps: true})


module.exports = mongoose.model("Jobs", JobSchema)