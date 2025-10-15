import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import { logger, loggerStream } from './utils/logger';
import { database } from './database/connection';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import investmentRoutes from './routes/investments';
import transactionRoutes from './routes/transactions';
import walletRoutes from './routes/wallet';
import referralRoutes from './routes/referrals';
import telegramRoutes from './routes/telegram';
import dashboardRoutes from './routes/dashboard';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy (important for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:", "wss:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration (read from env)
const corsOptions = {
  origin: function (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
    const rawEnv = (process.env.CORS_ORIGINS || '').split(',');
    const envOrigins = rawEnv.map(o => o.trim()).filter(Boolean);

    const defaultDevOrigins = [
      'http://localhost:3000', // React dev server
      'http://localhost:5173', // Vite dev server
    ];

    // Optional explicit frontend origin for production (set FRONTEND_URL=https://your-frontend.example.com)
    const defaultProdOrigins = [process.env.FRONTEND_URL || ''].filter(Boolean);

    const allowAll = (process.env.CORS_ORIGINS || '').trim() === '*';

    const allowedOrigins = Array.from(new Set([
      ...defaultDevOrigins,
      ...defaultProdOrigins,
      ...envOrigins,
      'null', // Some in-app webviews (incl. Telegram) may send Origin: null
    ]));

    // Allow any HTTPS origin if explicitly configured with '*'
    if (allowAll) {
      return callback(null, true);
    }

    // Allow requests with no origin (like mobile apps or curl requests) or from whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  // Set to true only if you use cookies for auth. If using Bearer tokens, you can set false.
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  // Include Telegram Web App header for auth handshakes
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Telegram-Init-Data', 'x-telegram-init-data'],
  optionsSuccessStatus: 200,
  maxAge: 86400,
};

app.use(cors(corsOptions));
// Ensure preflight requests are handled for all routes
app.options('*', cors(corsOptions));

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// HTTP request logging
app.use(morgan('combined', { stream: loggerStream }));

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    dbConnected: database.isConnectionReady(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/telegram', telegramRoutes);
app.use('/api/dashboard', dashboardRoutes);

// API info endpoint
app.get('/api', (req: express.Request, res: express.Response) => {
  res.json({
    name: 'Investment Bot API',
    version: '1.0.0',
    description: 'REST API for Telegram Investment Bot',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      investments: '/api/investments',
      transactions: '/api/transactions',
      wallet: '/api/wallet',
      referrals: '/api/referrals',
      telegram: '/api/telegram',
    },
    documentation: '/api/docs',
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Graceful shutdown initiated.`);
  
  try {
    // Stop accepting new connections
    await new Promise<void>((resolve) => {
      server.close(() => {
        logger.info('HTTP server closed.');
        resolve();
      });
    });
    
    // Close database connection
    await database.disconnect();
    
    logger.info('Graceful shutdown completed.');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
const server = app.listen(PORT, async () => {
  try {
    // Connect to database
    await database.connect();
    
    logger.info(`🚀 Server is running on port ${PORT}`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔗 API URL: http://localhost:${PORT}`);
    logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
    
    // Start background jobs
    if (process.env.NODE_ENV === 'production') {
      const { startScheduledJobs } = await import('./services/cronJobs');
      startScheduledJobs();
      logger.info('📅 Scheduled jobs started');
    }
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    if (process.env.ALLOW_START_WITHOUT_DB === 'true') {
      logger.warn('ALLOW_START_WITHOUT_DB is true: starting server without DB connection.');
    } else {
      process.exit(1);
    }
  }
});

export default app;