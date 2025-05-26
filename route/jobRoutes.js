import express from 'express';
import { createJob, getAllJobs } from '../controllers/jobController.js';

const router = express.Router();

// Job Routes
router.post('/create-job', createJob);
router.get('/all-jobs', getAllJobs);

export default router;