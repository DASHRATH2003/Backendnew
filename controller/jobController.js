import jobModel from '../models/jobModel.js'; // Updated import path and name

export const createJob = async (req, res) => {
    const { position, experience, joblocation, education, category, details } = req.body;
    try {
        const job = new jobModel({
            position,
            experience,
            joblocation,
            education,
            category,
            details
        });
        await job.save();
        return res.status(200).json({
            job: job
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};