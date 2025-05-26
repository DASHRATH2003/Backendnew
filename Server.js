import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jobRouter from './routes/jobRoutes.js';
// import { useActionState } from 'react';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});
app.get('/',(req,res)=>{
    res.send({
        activeStatus:true,
        error:false,
        massage:"server is running",
    })
})

app.use('/api/jobs', jobRouter);

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log("✅ Connected to MongoDB");
    console.log(`📍 Database: ${MONGODB_URI.includes('mongodb.net') ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);
})
.catch(err => console.error("❌ MongoDB connection error:", err));

// Basic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));