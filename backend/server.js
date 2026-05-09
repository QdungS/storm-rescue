import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDatabase } from './src/infrastructure/database/mongoose/connection.js';
import { errorHandler } from './src/infrastructure/http/middleware/error.middleware.js';
import { notFoundHandler } from './src/infrastructure/http/middleware/notFound.middleware.js';

import authRoutes from './src/infrastructure/http/routes/auth.routes.js';
import warningRoutes from './src/infrastructure/http/routes/warning.routes.js';

import userRoutes from './src/infrastructure/http/routes/user.routes.js';
import safetyRoutes from './src/infrastructure/http/routes/safety.routes.js';
import rescueRoutes from './src/infrastructure/http/routes/rescue.routes.js';
import chatRoutes from './src/infrastructure/http/routes/chat.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:5174'];

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
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    if (isVercelDomain(origin)) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

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

app.use('/api/auth', authRoutes);
app.use('/api/warnings', warningRoutes);
app.use('/api/users', userRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/rescues', rescueRoutes);
app.use('/api/chat', chatRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();
    console.log('✓ Database connected');

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
