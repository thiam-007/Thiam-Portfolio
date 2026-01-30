import 'dotenv/config';
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import cors from 'cors';
import connectToDatabase from './lib/mongodb';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { mongoSanitizeMiddleware } from './middleware/mongoSanitize';
import hpp from 'hpp';
import authRoutes from './routes/auth';
import experienceRoutes from './routes/experiences';
import projectRoutes from './routes/projectRoutes';
import certificationRoutes from './routes/certifications';
import contactRoutes from './routes/contact';
import profileRoutes from './routes/profile';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;

// Security configuration
app.set('trust proxy', 1);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://thiam-portfolio.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(helmet());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', globalLimiter);

app.use(express.json());
app.use(mongoSanitizeMiddleware);
app.use(hpp());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/profile', profileRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Global Error Handler (must be last)
app.use(errorHandler);

function validateEnv() {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'FRONTEND_URL'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`❌ Missing mandatory environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

async function start() {
  validateEnv();
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Backend started on http://localhost:${PORT}`);
  });
}

start();
