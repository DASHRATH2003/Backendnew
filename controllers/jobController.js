import Job from '../models/Job.js';

// Create a new job
// export const createJob = async (req, res) => {
//     try {
//         console.log('Received job creation request');
//         console.log('Request body:', req.body);
//         console.log('Request headers:', req.headers);

//         const { title, category, location, experience, education, driveLocation, description } = req.body;

//         console.log('Extracted fields:', {
//             title, category, location, experience, education, driveLocation, description
//         });

//         // Validate required fields
//         if (!title || !category || !location || !experience || !education || !driveLocation || !description) {
//             console.log('Validation failed - missing fields');
//             return res.status(400).json({
//                 success: false,
//                 message: 'Please provide all required fields: title, category, location, experience, education, driveLocation, and description'
//             });
//         }

//         console.log('Creating new job...');
//         const job = new Job({
//             title,
//             category,
//             location,
//             experience,
//             education,
//             driveLocation,
//             description
//         });

//         console.log('Saving job to database...');
//         const savedJob = await job.save();
//         console.log('Job saved successfully:', savedJob);

//         res.status(201).json({
//             success: true,
//             data: savedJob
//         });
//     } catch (error) {
//         console.error('Error creating job:', error);
//         res.status(400).json({
//             success: false,
//             message: error.message
//         });
//     }
// };
export const createJob = async (req, res) => {
    try {
        console.log('Starting job creation process');
        
        const { title, category, location, experience, education, driveLocation, description } = req.body;

        // Validate required fields
        const requiredFields = ['title', 'category', 'location', 'experience', 'education', 'driveLocation', 'description'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        console.log('Creating new job document');
        const job = new Job({
            title,
            category,
            location,
            experience,
            education,
            driveLocation,
            description
        });

        console.log('Attempting to save job to database');
        const savedJob = await job.save({ maxTimeMS: 20000 }); // 20 second timeout for the save operation
        
        console.log('Job saved successfully');
        res.status(201).json({
            success: true,
            data: savedJob
        });
    } catch (error) {
        console.error('Error in createJob:', error);
        
        // Handle specific MongoDB timeout errors
        if (error.message.includes('buffering timed out')) {
            return res.status(504).json({
                success: false,
                message: 'Database operation timed out. Please try again.'
            });
        }
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
        // Generic error response
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all jobs
export const getAllJobs = async (req, res) => {
    try {
        // Try to get jobs from database first
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: jobs
        });
    } catch (error) {
        // If database fails, return mock data
        console.log('Database error, returning mock data:', error.message);
        const mockJobs = [
            {
                _id: "507f1f77bcf86cd799439011",
                title: "Software Developer",
                category: "Technology",
                location: "Bangalore",
                experience: "2-4 years",
                education: "B.Tech/B.E in Computer Science",
                driveLocation: "Bangalore Tech Park",
                description: "We are looking for a skilled software developer to join our team. Experience with React, Node.js, and MongoDB required. Join our dynamic team and work on cutting-edge projects.",
                createdAt: new Date('2024-01-15')
            },
            {
                _id: "507f1f77bcf86cd799439012",
                title: "Data Analyst",
                category: "Analytics",
                location: "Mumbai",
                experience: "1-3 years",
                education: "B.Sc/M.Sc in Statistics or related field",
                driveLocation: "Mumbai Business District",
                description: "Seeking a data analyst to help us make data-driven decisions. Proficiency in SQL, Python, and data visualization tools required. Work with large datasets and create meaningful insights.",
                createdAt: new Date('2024-01-14')
            },
            {
                _id: "507f1f77bcf86cd799439013",
                title: "HR Executive",
                category: "Human Resources",
                location: "Delhi",
                experience: "3-5 years",
                education: "MBA in HR or related field",
                driveLocation: "Delhi Corporate Center",
                description: "Looking for an experienced HR executive to manage recruitment, employee relations, and HR policies. Handle end-to-end recruitment process and employee engagement activities.",
                createdAt: new Date('2024-01-13')
            },
            {
                _id: "507f1f77bcf86cd799439014",
                title: "Marketing Manager",
                category: "Marketing",
                location: "Pune",
                experience: "4-6 years",
                education: "MBA in Marketing",
                driveLocation: "Pune IT Hub",
                description: "Seeking a creative marketing manager to lead our marketing campaigns. Experience in digital marketing, brand management, and campaign execution required.",
                createdAt: new Date('2024-01-12')
            },
            {
                _id: "507f1f77bcf86cd799439015",
                title: "UI/UX Designer",
                category: "Design",
                location: "Hyderabad",
                experience: "2-4 years",
                education: "B.Des or equivalent",
                driveLocation: "Hyderabad Design Center",
                description: "Looking for a talented UI/UX designer to create amazing user experiences. Proficiency in Figma, Adobe Creative Suite, and user research methodologies required.",
                createdAt: new Date('2024-01-11')
            }
        ];

        res.status(200).json({
            success: true,
            data: mockJobs
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
        // If database fails, return mock recent jobs
        console.log('Database error, returning mock recent jobs:', error.message);
        const mockRecentJobs = [
            {
                _id: "507f1f77bcf86cd799439011",
                title: "Software Developer",
                location: "Bangalore",
                experience: "2-4 years",
                createdAt: new Date('2024-01-15')
            },
            {
                _id: "507f1f77bcf86cd799439012",
                title: "Data Analyst",
                location: "Mumbai",
                experience: "1-3 years",
                createdAt: new Date('2024-01-14')
            },
            {
                _id: "507f1f77bcf86cd799439013",
                title: "HR Executive",
                location: "Delhi",
                experience: "3-5 years",
                createdAt: new Date('2024-01-13')
            }
        ];

        res.status(200).json({
            success: true,
            data: mockRecentJobs
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