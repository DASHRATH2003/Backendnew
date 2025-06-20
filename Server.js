import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import jobRouter from './routes/jobRoutes.js';
import path from "path";
// import dbConnect from './db.js';
const _dirname = path.resolve();

dotenv.config();

const app = express();
app.use(express.json());

// ✅ CORS Configuration for Frontend
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'https://moonlit-gaufre-fa9bcd.netlify.app',
  'https://gentle-starburst-7139d0.netlify.app',
  'https://endearing-gnome-9639e4.netlify.app' ,// ✅ Add this new URL here
  'https://championshrservices.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// app.use(express.static(path.join(__dirname,"/frontend/dist")));
// app.get('*')

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
    // const Job = (await import('./models/Job.js')).default;

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

// ✅ MongoDB Connection - Connect BEFORE setting up routes
// Enhanced MongoDB connection configuration
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000, // 30 seconds connection timeout
  socketTimeoutMS: 45000, // 45 seconds socket timeout
  serverSelectionTimeoutMS: 30000, // 30 seconds server selection timeout
  maxPoolSize: 10, // Connection pool size
  retryWrites: true,
  retryReads: true,
  w: 'majority'
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log('📊 Database state:', mongoose.connection.readyState);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.error('🔍 Connection string exists:', !!process.env.MONGODB_URI);
});

// ✅ API Routes - Set up AFTER MongoDB connection
app.use('/api/jobs', jobRouter);

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log('✅ Connected to MongoDB');
// })
// .catch((err) => {
//   console.error('❌ MongoDB connection error:', err);
// });

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
