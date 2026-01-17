import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDatabase from './lib/mongodb';
import authRoutes from './routes/auth';
import experienceRoutes from './routes/experiences';
import projectRoutes from './routes/projectRoutes';
import certificationRoutes from './routes/certifications';
import contactRoutes from './routes/contact';
import profileRoutes from './routes/profile';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/profile', profileRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

async function start() {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Backend started on http://localhost:${PORT}`);
  });
}

start();
