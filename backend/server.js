import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDatabase } from './src/infrastructure/database/mongoose/connection.js';
import { errorHandler } from './src/infrastructure/http/middleware/error.middleware.js';
import { notFoundHandler } from './src/infrastructure/http/middleware/notFound.middleware.js';

// Import routes
import authRoutes from './src/infrastructure/http/routes/auth.routes.js';
import warningRoutes from './src/infrastructure/http/routes/warning.routes.js';

import userRoutes from './src/infrastructure/http/routes/user.routes.js';
import safetyRoutes from './src/infrastructure/http/routes/safety.routes.js';
import rescueRoutes from './src/infrastructure/http/routes/rescue.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
// CORS configuration - support multiple origins for production
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:5174'];

// Check if origin is a Vercel domain
const isVercelDomain = (origin) => {
  return origin && (
    origin.includes('.vercel.app') ||
    origin.includes('.vercel.sh') ||
    origin.includes('localhost') ||
    origin.includes('127.0.0.1')
  );
};

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Allow if in allowed origins list
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // Allow Vercel domains in production
    if (isVercelDomain(origin)) {
      return callback(null, true);
    }

    // Allow all origins in development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    // Reject in production if not allowed
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Flood Rescue Platform API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      warnings: '/api/warnings',
      users: '/api/users',
      safety: '/api/safety',
      rescues: '/api/rescues'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API info route
app.get('/api', (req, res) => {
  res.json({
    message: 'Flood Rescue Platform API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      warnings: '/api/warnings',
      users: '/api/users',
      safety: '/api/safety',
      rescues: '/api/rescues'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/warnings', warningRoutes);
app.use('/api/users', userRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/rescues', rescueRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    console.log('✓ Database connected');

    // Start listening - use 0.0.0.0 for Render deployment
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
