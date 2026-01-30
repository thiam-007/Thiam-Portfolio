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

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Render/proxies
app.set('trust proxy', 1);

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://thiam-portfolio.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Security Middleware
app.use(helmet());

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', globalLimiter);

// Data Sanitization
app.use(express.json());
app.use(mongoSanitizeMiddleware); // Custom sanitizer for Express 5 compatibility
app.use(hpp()); // Prevent HTTP Parameter Pollution

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
