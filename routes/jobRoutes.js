import express from 'express';
import { createJob, getAllJobs, getJob, updateJob, deleteJob, getRecentJobs } from '../controllers/jobController.js';

const router = express.Router();

// Job routes
router.post('/', createJob);           // POST /api/jobs
router.get('/', getAllJobs);           // GET /api/jobs
router.get('/recent', getRecentJobs);  // GET /api/jobs/recent
router.get('/:id', getJob);            // GET /api/jobs/:id
router.put('/:id', updateJob);         // PUT /api/jobs/:id
router.delete('/:id', deleteJob);      // DELETE /api/jobs/:id

export default router;