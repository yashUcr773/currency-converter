import { Router, Request, Response } from 'express';
import { dataService, DATA_TYPES, DataType } from '../services/dataService';

const router = Router();

// GET /api/sync/:userId/:deviceId/:dataType - Get specific data type
router.get('/:userId/:deviceId/:dataType', async (req: Request, res: Response): Promise<void> => {
  // Set a response timeout
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      console.error(`[SYNC GET] Request timeout for ${req.params.dataType}`);
      res.status(408).json({
        success: false,
        error: 'Request timeout',
        message: 'Request took too long to complete'
      });
    }
  }, 15000); // 15 second timeout
  
  try {
    console.log(`[SYNC GET] Request started for dataType: ${req.params.dataType}`);
    const { userId, deviceId, dataType } = req.params;

    // Validate required parameters
    if (!userId || !deviceId || !dataType) {
      console.log(`[SYNC GET] Missing required parameters: userId=${userId}, deviceId=${deviceId}, dataType=${dataType}`);
      clearTimeout(timeout);
      res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        message: 'userId, deviceId, and dataType are required'
      });
      return;
    }

    // Validate data type
    if (!Object.values(DATA_TYPES).includes(dataType as DataType)) {
      console.log(`[SYNC GET] Invalid data type: ${dataType}`);
      clearTimeout(timeout);
      res.status(400).json({
        success: false,
        error: 'Invalid data type',
        message: `Data type must be one of: ${Object.values(DATA_TYPES).join(', ')}`
      });
      return;
    }

    console.log(`[SYNC GET] Calling dataService.getUserData for userId: ${userId}, dataType: ${dataType}`);
    const data = await dataService.getUserData(userId, dataType as DataType);
    console.log(`[SYNC GET] Data retrieved:`, data ? 'Found' : 'Not found');
    
    const response = {
      success: true,
      data: data?.devices || null,
      legacy: data?.legacy?.data || null,
      timestamp: data?.devices?.[0]?.lastUpdated || data?.legacy?.lastUpdated || null,
      version: data?.devices?.[0]?.version || data?.legacy?.version || null,
      merged: false // Raw device data, not merged
    };
    
    console.log(`[SYNC GET] Sending response`);
    clearTimeout(timeout);
    if (!res.headersSent) {
      res.json(response);
    }
  } catch (error) {
    console.error('[SYNC GET] Error getting data:', error);
    clearTimeout(timeout);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve data'
      });
    }
  }
});

// POST /api/sync/:userId/:deviceId/:dataType - Save specific data type
router.post('/:userId/:deviceId/:dataType', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, deviceId, dataType } = req.params;
    const { data } = req.body;

    // Validate required parameters
    if (!userId || !deviceId || !dataType) {
      res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        message: 'userId, deviceId, and dataType are required'
      });
      return;
    }

    // Validate data type
    if (!Object.values(DATA_TYPES).includes(dataType as DataType)) {
      res.status(400).json({
        success: false,
        error: 'Invalid data type',
        message: `Data type must be one of: ${Object.values(DATA_TYPES).join(', ')}`
      });
      return;
    }

    if (data === undefined) {
      res.status(400).json({
        success: false,
        error: 'Missing data',
        message: 'Request body must contain data field'
      });
      return;
    }

    const success = await dataService.saveUserData(
      userId, 
      dataType as DataType, 
      data, 
      deviceId
    );

    res.json({
      success,
      timestamp: Date.now(),
      deviceId: deviceId,
      merged: true // Indicates this data has been merged with other devices
    });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to save data'
    });
  }
});

// PUT /api/sync/:userId/:deviceId/:dataType - Update specific data type (alias for POST)
router.put('/:userId/:deviceId/:dataType', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, deviceId, dataType } = req.params;
    const { data } = req.body;

    // Validate required parameters
    if (!userId || !deviceId || !dataType) {
      res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        message: 'userId, deviceId, and dataType are required'
      });
      return;
    }

    // Validate data type
    if (!Object.values(DATA_TYPES).includes(dataType as DataType)) {
      res.status(400).json({
        success: false,
        error: 'Invalid data type',
        message: `Data type must be one of: ${Object.values(DATA_TYPES).join(', ')}`
      });
      return;
    }

    if (data === undefined) {
      res.status(400).json({
        success: false,
        error: 'Missing data',
        message: 'Request body must contain data field'
      });
      return;
    }

    const success = await dataService.saveUserData(
      userId, 
      dataType as DataType, 
      data, 
      deviceId
    );

    res.json({
      success,
      timestamp: Date.now(),
      deviceId: deviceId,
      merged: true // Indicates this data has been merged with other devices
    });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to save data'
    });
  }
});

// DELETE /api/sync/:userId/:deviceId/:dataType - Delete specific data type
router.delete('/:userId/:deviceId/:dataType', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, deviceId, dataType } = req.params;

    // Validate required parameters
    if (!userId || !deviceId || !dataType) {
      res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        message: 'userId, deviceId, and dataType are required'
      });
      return;
    }

    // Validate data type
    if (!Object.values(DATA_TYPES).includes(dataType as DataType)) {
      res.status(400).json({
        success: false,
        error: 'Invalid data type',
        message: `Data type must be one of: ${Object.values(DATA_TYPES).join(', ')}`
      });
      return;
    }

    const success = await dataService.deleteUserData(userId, dataType as DataType);

    res.json({
      success,
      message: 'Data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete data'
    });
  }
});

// GET /api/sync/:userId/bulk/all - Get all user data
router.get('/:userId/bulk/all', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Validate required parameters
    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        message: 'userId is required'
      });
      return;
    }

    const allData = await dataService.getAllUserData(userId);

    res.json({
      success: true,
      data: allData
    });
  } catch (error) {
    console.error('Error getting all data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve all data'
    });
  }
});

// DELETE /api/sync/:userId/bulk/all - Delete all user data
router.delete('/:userId/bulk/all', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Validate required parameters
    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        message: 'userId is required'
      });
      return;
    }

    const success = await dataService.deleteAllUserData(userId);

    res.json({
      success,
      message: 'All data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting all data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete all data'
    });
  }
});

export default router;
