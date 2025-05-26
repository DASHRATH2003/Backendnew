import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required']
  },
  category: {
    type: String,
    required: [true, 'Job category is required']
  },
  location: {
    type: String,
    required: [true, 'Job location is required']
  },
  experience: {
    type: String,
    required: [true, 'Experience requirement is required']
  },
  education: {
    type: String,
    required: [true, 'Education requirement is required']
  },
  driveLocation: {
    type: String,
    required: [true, 'Drive location is required']
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  googleFormLink: {
    type: String,
    required: false
  }
}, {
  timestamps: true // This enables createdAt and updatedAt fields
});

const Job = mongoose.model('Job', jobSchema);

export default Job; 