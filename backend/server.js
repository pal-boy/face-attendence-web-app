import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import attendanceRoutes from './routes/attendence.route.js';
import morgan from 'morgan';
import { loadModels } from './helpers/faceCompare.js';

dotenv.config();

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Handle base64 images
app.use(express.urlencoded({ extended: true }));
app.use(express.static('models')); // Serve static files from models directory

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

await loadModels(); // Load face-api.js models

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
