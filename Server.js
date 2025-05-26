import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import jobRouter from './routes/jobRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

// ✅ CORS Configuration for Frontend
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// ✅ Default route
app.get('/', (req, res) => {
  res.send({
    activeStatus: true,
    error: false,
    message: 'server is running',
  });
});

// ✅ Test MongoDB connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    res.json({
      success: true,
      mongodbState: states[dbState],
      mongodbURI: process.env.MONGODB_URI ? 'Set' : 'Not Set',
      message: 'Database connection test'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ✅ Add sample jobs endpoint
app.post('/api/add-sample-jobs', async (req, res) => {
  try {
    const Job = (await import('./models/Job.js')).default;

    const sampleJobs = [
      {
        title: "Software Developer",
        category: "Technology",
        location: "Bangalore",
        experience: "2-4 years",
        education: "B.Tech/B.E in Computer Science",
        driveLocation: "Bangalore Tech Park",
        description: "We are looking for a skilled software developer to join our team. Experience with React, Node.js, and MongoDB required."
      },
      {
        title: "Data Analyst",
        category: "Analytics",
        location: "Mumbai",
        experience: "1-3 years",
        education: "B.Sc/M.Sc in Statistics or related field",
        driveLocation: "Mumbai Business District",
        description: "Seeking a data analyst to help us make data-driven decisions. Proficiency in SQL, Python, and data visualization tools required."
      },
      {
        title: "HR Executive",
        category: "Human Resources",
        location: "Delhi",
        experience: "3-5 years",
        education: "MBA in HR or related field",
        driveLocation: "Delhi Corporate Center",
        description: "Looking for an experienced HR executive to manage recruitment, employee relations, and HR policies."
      }
    ];

    const savedJobs = await Job.insertMany(sampleJobs);

    res.status(201).json({
      success: true,
      message: `${savedJobs.length} sample jobs added successfully`,
      data: savedJobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ✅ API Routes
app.use('/api/jobs', jobRouter);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
