import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import jobRouter from './routes/jobRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// ✅ Use cors middleware properly
const allowedOrigin = 'https://funny-fox-66ff57.netlify.app'; 
app.use(cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// ✅ Root route
app.get('/', (req, res) => {
    res.send({
        activeStatus: true,
        error: false,
        message: "server is running",
    });
});

// ✅ Routes
app.use('/api/jobs', jobRouter);

// ✅ MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB");
        console.log(`📍 Database: ${MONGODB_URI.includes('mongodb.net') ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);
    })
    .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Basic Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
