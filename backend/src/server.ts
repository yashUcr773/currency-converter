import express from 'express';
import morgan from 'morgan';
import { config } from './config/env';
import { testConnection } from './config/database';
import {
  corsMiddleware,
  securityHeaders,
  rateLimiter,
  compressionMiddleware
} from './middleware/security';

// Import routes
import syncRoutes from './routes/sync';
import healthRoutes from './routes/health';

const app = express();

// Trust proxy (for rate limiting and security headers)
app.set('trust proxy', 1);

// Apply security middleware
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(compressionMiddleware);
app.use(rateLimiter);

// Logging middleware
if (config.server.nodeEnv !== 'test') {
  app.use(morgan('combined'));
}

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.path} - Headers:`, {
    authorization: req.headers.authorization ? 'Present' : 'Missing',
    'content-type': req.headers['content-type'],
    origin: req.headers.origin
  });
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Public routes (no auth required)
app.use('/api/health', healthRoutes);

// Protected routes
app.use('/api/sync', syncRoutes);

// Root endpoint
app.get('/', (req, res) => {
  console.log('Root endpoint hit');
  res.json({
    success: true,
    message: 'Currency Converter Backend API',
    version: '1.1.0',
    environment: config.server.nodeEnv,
    endpoints: {
      health: '/api/health',
      sync: '/api/sync/:dataType',
      bulkSync: '/api/sync/bulk/all'
    }
  });
});

// Simple test endpoint
app.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ success: true, message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// Test sync endpoint without auth (temporary for debugging)
app.get('/test-sync/:dataType', async (req, res) => {
  console.log('Test sync endpoint hit for dataType:', req.params.dataType);
  try {
    const { dataService } = await import('./services/dataService');
    const { dataType } = req.params;
    
    // Test with a fake user ID
    const result = await dataService.getUserData('test-user-123', dataType as any);
    res.json({ 
      success: true, 
      message: `Sync test for ${dataType} completed`, 
      hasData: !!result,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Test sync error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      dataType: req.params.dataType,
      timestamp: new Date().toISOString() 
    });
  }
});


// Catch-all route: redirect all non-API requests to https://triptools.uk
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: 'Not found',
      message: 'Endpoint not found'
    });
  }
  // Redirect to external frontend
  return res.redirect(302, 'https://triptools.uk');
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: 'Internal server error',
    message: config.server.nodeEnv === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('Failed to connect to database');
      process.exit(1);
    }

    const server = app.listen(config.server.port, config.server.host, () => {
      console.log(`🚀 Server running on http://${config.server.host}:${config.server.port}`);
      console.log(`📝 Environment: ${config.server.nodeEnv}`);
      console.log(`💾 Database: Connected`);
      console.log(`🔒 CORS Origins: ${config.cors.allowedOrigins.join(', ')}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};


// Only start the server locally (not on Vercel)
if (require.main === module) {
  startServer();
}

// For Vercel serverless: export the app as the handler
module.exports = app;
