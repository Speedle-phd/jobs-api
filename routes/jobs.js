const { getAllJobs, getJob, createJob, patchJob, deleteJob } = require('../controllers/jobs')

const express = require('express')
const router = express.Router()

router.route('/').get(getAllJobs).post(createJob)
router.route('/:id').get(getJob).patch(patchJob).delete(deleteJob)


module.exports = router