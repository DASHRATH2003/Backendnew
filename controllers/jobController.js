import Job from '../models/Job.js';

// Create a new job
export const createJob = async (req, res) => {
    try {
        const { title, category, location, experience, education, driveLocation, description } = req.body;

        // Validate required fields
        if (!title || !category || !location || !experience || !education || !driveLocation || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: title, category, location, experience, education, driveLocation, and description'
            });
        }

        const job = new Job({
            title,
            category,
            location,
            experience,
            education,
            driveLocation,
            description
        });

        const savedJob = await job.save();
        res.status(201).json({
            success: true,
            data: savedJob
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: jobs
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get recent jobs
export const getRecentJobs = async (req, res) => {
    try {
        const recentJobs = await Job.find()
            .sort({ createdAt: -1 }) // Sort by creation date, newest first
            .limit(5); // Get only the 5 most recent jobs
        
        res.status(200).json({
            success: true,
            data: recentJobs
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get a single job
export const getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }
        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update a job
export const updateJob = async (req, res) => {
    try {
        const { title, category, location, experience, education, driveLocation, description } = req.body;

        // Validate required fields
        if (!title || !category || !location || !experience || !education || !driveLocation || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: title, category, location, experience, education, driveLocation, and description'
            });
        }

        const job = await Job.findByIdAndUpdate(
            req.params.id,
            {
                title,
                category,
                location,
                experience,
                education,
                driveLocation,
                description
            },
            { new: true, runValidators: true }
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a job
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}; 