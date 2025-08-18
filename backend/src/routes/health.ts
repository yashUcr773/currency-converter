import { Router, Request, Response } from 'express';
import { dataService } from '../services/dataService';
import { config } from '../config/env';

const router = Router();

// GET /api/health - Health check endpoint
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('trigger')
    console.log('Health check endpoint called');
    const dbHealthy = await dataService.healthCheck();
    console.log('DB health check result:', dbHealthy);
    
    const health = {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: '1.1.0',
      environment: config.server.nodeEnv,
      services: {
        database: dbHealthy ? 'connected' : 'disconnected',
        server: 'running'
      }
    };

    const statusCode = dbHealthy ? 200 : 503;

    console.log('Sending health response:', health);
    res.status(statusCode).json({
      success: dbHealthy,
      data: health
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      success: false,
      error: 'Service unavailable',
      message: 'Health check failed'
    });
  }
});

export default router;
