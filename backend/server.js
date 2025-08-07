import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/tasks.js';
import userRoutes from './routes/users.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Connect to MongoDB Atlas
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    console.log('Connected to MongoDB Atlas');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });
