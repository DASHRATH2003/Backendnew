// Implement a queue system for job creation
import Queue from 'bull';

const jobQueue = new Queue('job creation', process.env.REDIS_URL);

jobQueue.process(async (job) => {
  try {
    const newJob = await Job.create(job.data);
    return newJob;
  } catch (error) {
    throw error;
  }
});

export const createJob = async (req, res) => {
  try {
    await jobQueue.add(req.body);
    return res.status(202).json({
      success: true,
      message: 'Job creation request accepted - processing'
    });
  } catch (error) {
    // error handling
  }
};
