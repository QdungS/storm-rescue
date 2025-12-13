import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDatabase } from './src/infrastructure/database/mongoose/connection.js';
import { errorHandler } from './src/infrastructure/http/middleware/error.middleware.js';
import { notFoundHandler } from './src/infrastructure/http/middleware/notFound.middleware.js';

// Import routes
import authRoutes from './src/infrastructure/http/routes/auth.routes.js';
import landslideRoutes from './src/infrastructure/http/routes/landslide.routes.js';
import warningRoutes from './src/infrastructure/http/routes/warning.routes.js';
import reportRoutes from './src/infrastructure/http/routes/report.routes.js';
import userRoutes from './src/infrastructure/http/routes/user.routes.js';
import safetyRoutes from './src/infrastructure/http/routes/safety.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
// CORS configuration - support multiple origins for production
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
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
    message: 'Landslide Management System API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      landslides: '/api/landslides',
      warnings: '/api/warnings',
      reports: '/api/reports',
      users: '/api/users',
      safety: '/api/safety'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/landslides', landslideRoutes);
app.use('/api/warnings', warningRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/safety', safetyRoutes);

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

