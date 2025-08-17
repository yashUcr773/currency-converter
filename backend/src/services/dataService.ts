import { dynamodb, dynamodbClient, tableName } from '../config/database';
import { PutCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { DescribeTableCommand } from '@aws-sdk/client-dynamodb';

// Data type constants (matching frontend)
export const DATA_TYPES = {
  MAIN: 'main',
  PREFERENCES: 'preferences', 
  ITINERARY: 'itinerary',
  SEARCH: 'search',
  TIMEZONE_CACHE: 'timezone-cache',
} as const;

export type DataType = typeof DATA_TYPES[keyof typeof DATA_TYPES];

export interface UserDataRecord {
  userId: string; // Primary key
  dataType: DataType; // Sort key
  data: unknown; // The actual data
  lastUpdated: number; // Timestamp
  version: string; // Data schema version
  deviceId?: string; // Optional device identifier
}

// Enhanced model for per-device data storage
export interface DeviceDataRecord {
  userId: string; // Primary key
  deviceDataId: string; // Sort key: `${dataType}#${deviceId}`
  dataType: DataType;
  deviceId: string;
  data: unknown;
  lastUpdated: number;
  version: string;
}

export class DataService {
  // Save device-specific user data
  async saveDeviceData(
    userId: string,
    dataType: DataType,
    data: unknown,
    deviceId: string
  ): Promise<boolean> {
    try {
      const deviceDataId = `${dataType}#${deviceId}`;
      
      const record: DeviceDataRecord = {
        userId,
        deviceDataId,
        dataType,
        deviceId,
        data,
        lastUpdated: Date.now(),
        version: '1.0.0',
      };

      console.log(`[DATASERVICE] Saving device data - userId: ${userId}, deviceDataId: ${deviceDataId}`);

      await dynamodb.send(new PutCommand({
        TableName: tableName,
        Item: record,
      }));

      return true;
    } catch (error) {
      console.error('Error saving device data:', error);
      throw new Error('Failed to save device data');
    }
  }

  // Save user data - now only saves device-specific data
  async saveUserData(
    userId: string,
    dataType: DataType,
    data: unknown,
    deviceId?: string
  ): Promise<boolean> {
    try {
      const finalDeviceId = deviceId || 'web';
      
      // Only save device-specific data, no server-side merging
      await this.saveDeviceData(userId, dataType, data, finalDeviceId);

      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      throw new Error('Failed to save user data');
    }
  }

  // Get user data - now returns all device data for client-side merging
  async getUserData(userId: string, dataType: DataType): Promise<{ devices: DeviceDataRecord[]; legacy?: UserDataRecord } | null> {
    try {
      console.log(`[DATASERVICE] getUserData called - userId: ${userId}, dataType: ${dataType}`);
      
      // Get all device-specific data for this user and dataType
      const deviceData = await this.getAllDeviceData(userId, dataType);
      console.log(`[DATASERVICE] Found ${deviceData.length} device records`);
      
      if (deviceData.length > 0) {
        return { devices: deviceData };
      }
      
      // Fallback to legacy single record format for backward compatibility
      console.log(`[DATASERVICE] No device data found, checking legacy format...`);
      const command = new GetCommand({
        TableName: tableName,
        Key: {
          userId,
          dataType,
        },
      });
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('DynamoDB request timeout after 10 seconds')), 10000);
      });
      
      const result = await Promise.race([
        dynamodb.send(command),
        timeoutPromise
      ]);
      
      console.log(`[DATASERVICE] DynamoDB query result:`, result.Item ? 'Legacy item found' : 'No item found');
      
      if (result.Item) {
        return { 
          devices: [], 
          legacy: result.Item as UserDataRecord 
        };
      }
      
      return null;
    } catch (error) {
      console.error('[DATASERVICE] Error getting user data:', error);
      throw new Error('Failed to retrieve user data');
    }
  }

  // Get all device-specific data for a user and data type
  async getAllDeviceData(userId: string, dataType: DataType): Promise<DeviceDataRecord[]> {
    try {
      console.log(`[DATASERVICE] Getting all device data - userId: ${userId}, dataType: ${dataType}`);
      
      // Query all records with deviceDataId starting with dataType
      const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
      
      const command = new ScanCommand({
        TableName: tableName,
        FilterExpression: 'userId = :userId AND begins_with(deviceDataId, :dataTypePrefix)',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':dataTypePrefix': `${dataType}#`,
        },
      });
      
      const result = await dynamodb.send(command);
      console.log(`[DATASERVICE] Found ${result.Items?.length || 0} device records`);
      
      return (result.Items || []) as DeviceDataRecord[];
    } catch (error) {
      console.error('[DATASERVICE] Error getting all device data:', error);
      return [];
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
  await dynamodbClient.send(new DescribeTableCommand({ TableName: tableName }));
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Delete user data
  async deleteUserData(userId: string, dataType: DataType): Promise<boolean> {
    try {
      await dynamodb.send(new DeleteCommand({
        TableName: tableName,
        Key: {
          userId,
          dataType,
        },
      }));

      return true;
    } catch (error) {
      console.error('Error deleting user data:', error);
      throw new Error('Failed to delete user data');
    }
  }

  // Delete all user data
  async deleteAllUserData(userId: string): Promise<boolean> {
    try {
      const dataTypes = Object.values(DATA_TYPES);
      let allSuccessful = true;

      for (const dataType of dataTypes) {
        try {
          await this.deleteUserData(userId, dataType);
        } catch (error) {
          console.error(`Failed to delete ${dataType} for user ${userId}:`, error);
          allSuccessful = false;
        }
      }

      return allSuccessful;
    } catch (error) {
      console.error('Error deleting all user data:', error);
      throw new Error('Failed to delete all user data');
    }
  }

  // Get all user data
  async getAllUserData(userId: string): Promise<Record<string, unknown>> {
    try {
      const dataTypes = Object.values(DATA_TYPES);
      const results: Record<string, unknown> = {};

      // Get all data types for the user
      for (const dataType of dataTypes) {
        const data = await this.getUserData(userId, dataType);
        if (data) {
          if (data.devices.length > 0) {
            // Return device data for client-side merging
            results[dataType] = {
              devices: data.devices,
              type: 'multi-device'
            };
          } else if (data.legacy) {
            // Return legacy format
            results[dataType] = {
              data: data.legacy.data,
              timestamp: data.legacy.lastUpdated,
              version: data.legacy.version,
              deviceId: data.legacy.deviceId,
              type: 'legacy'
            };
          }
        }
      }

      return results;
    } catch (error) {
      console.error('Error getting all user data:', error);
      throw new Error('Failed to retrieve all user data');
    }
  }
}

export const dataService = new DataService();
