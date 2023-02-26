const { StatusCodes } = require('http-status-codes')
const Job = require('../models/Job')
const { BadRequestError, NotFoundError} = require('../errors')

const getAllJobs = async (req, res, next) => {
  const {_id: userID} = req.user
  const jobs = await Job.find({createdBy: userID}).sort('createdAt')
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}
const getJob = async (req, res, next) => {
  const {id: jobID} = req.params
  const {_id: userID} = req.user
  const job = await Job.findOne({createdBy: userID, _id: jobID})
  if(!job) throw new NotFoundError(`The requested job with the id ${jobID} does not exist`)
  res.status(StatusCodes.OK).json({ job })
}
const createJob = async (req, res, next) => {
  //just add new property and the property comes with auth middleware Token Bearer
  const {_id: userID} = req.user
  req.body.createdBy = userID
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({job})
}
const patchJob = async (req, res, next) => {
  const {body: {company, position}, user: {_id: userID}, params: {id: jobID}} = req
  if(company === ""|| position === "") throw new BadRequestError('Company or Position fields cannot be empty')
  const job = await Job.findOneAndUpdate({createdBy: userID, _id: jobID}, req.body, {
    new: true,
    runValidators: true,
  })
  if (!job)
    throw new NotFoundError(
      `The requested job with the id ${jobID} does not exist`
    )
  res.status(StatusCodes.OK).json({ job })
}
const deleteJob = async (req, res, next) => {
  const {
    user: { _id: userID },
    params: { id: jobID },
  } = req
  const job = await Job.findByIdAndRemove({ createdBy: userID, _id: jobID })
  if (!job)
    throw new NotFoundError(
      `The requested job with the id ${jobID} does not exist`
    )
  res.status(StatusCodes.OK).json( {job} )
}


module.exports = { getAllJobs, getJob, createJob, patchJob, deleteJob }
