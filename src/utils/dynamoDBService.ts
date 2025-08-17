// AWS DynamoDB service for cloud storage of user data
// Provides synchronization and backup for logged-in users

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { MainStorageData, UserPreferences, SearchData, TimezoneCache, SerializedItineraryItem } from './storageManager';
import { logger } from './env';

// AWS Configuration - these should be set via environment variables
const AWS_CONFIG = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
};

const TABLE_NAME = import.meta.env.VITE_DYNAMODB_TABLE_NAME || 'ratevault-user-data';

// DynamoDB client setup
let dynamoClient: DynamoDBDocumentClient | null = null;

function initializeDynamoClient(): DynamoDBDocumentClient | null {
  try {
    if (!AWS_CONFIG.accessKeyId || !AWS_CONFIG.secretAccessKey) {
      logger.warn('AWS credentials not provided, DynamoDB sync disabled');
      return null;
    }

    const client = new DynamoDBClient({
      region: AWS_CONFIG.region,
      credentials: {
        accessKeyId: AWS_CONFIG.accessKeyId,
        secretAccessKey: AWS_CONFIG.secretAccessKey,
      },
    });

    return DynamoDBDocumentClient.from(client);
  } catch (error) {
    logger.error('Failed to initialize DynamoDB client:', error);
    return null;
  }
}

// Get or initialize the DynamoDB client
function getDynamoClient(): DynamoDBDocumentClient | null {
  if (!dynamoClient) {
    dynamoClient = initializeDynamoClient();
  }
  return dynamoClient;
}

// User data structure in DynamoDB
export interface UserDataRecord {
  userId: string; // Primary key (Clerk user ID)
  dataType: string; // Sort key (main, preferences, itinerary, search, timezone-cache)
  data: unknown; // The actual data
  lastUpdated: number; // Timestamp
  version: string; // Data schema version
  deviceId?: string; // Optional device identifier
}

// Data type constants
export const DATA_TYPES = {
  MAIN: 'main',
  PREFERENCES: 'preferences', 
  ITINERARY: 'itinerary',
  SEARCH: 'search',
  TIMEZONE_CACHE: 'timezone-cache',
} as const;

export type DataType = typeof DATA_TYPES[keyof typeof DATA_TYPES];

class DynamoDBService {
  private client: DynamoDBDocumentClient | null = null;

  constructor() {
    this.client = getDynamoClient();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async executeCommand<T>(command: any, operation: string): Promise<T | null> {
    if (!this.client) {
      logger.warn(`DynamoDB not available for ${operation}`);
      return null;
    }

    try {
      const result = await this.client.send(command);
      return result as T;
    } catch (error) {
      logger.error(`DynamoDB ${operation} failed:`, error);
      return null;
    }
  }

  // Save user data to DynamoDB
  async saveUserData(
    userId: string,
    dataType: DataType,
    data: unknown,
    deviceId?: string
  ): Promise<boolean> {
    const record: UserDataRecord = {
      userId,
      dataType,
      data,
      lastUpdated: Date.now(),
      version: '1.0.0',
      deviceId,
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: record,
    });

    const result = await this.executeCommand(command, `save ${dataType} data`);
    return result !== null;
  }

  // Get user data from DynamoDB
  async getUserData(userId: string, dataType: DataType): Promise<UserDataRecord | null> {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        userId,
        dataType,
      },
    });

    const result = await this.executeCommand<{ Item?: UserDataRecord }>(
      command,
      `get ${dataType} data`
    );

    return result?.Item || null;
  }

  // Delete user data from DynamoDB
  async deleteUserData(userId: string, dataType: DataType): Promise<boolean> {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        userId,
        dataType,
      },
    });

    const result = await this.executeCommand(command, `delete ${dataType} data`);
    return result !== null;
  }

  // Update specific fields in user data
  async updateUserData(
    userId: string,
    dataType: DataType,
    updates: Partial<UserDataRecord>,
    deviceId?: string
  ): Promise<boolean> {
    const updateExpression = [];
    const expressionAttributeValues: Record<string, unknown> = {};
    const expressionAttributeNames: Record<string, string> = {};

    // Build update expression
    if (updates.data !== undefined) {
      updateExpression.push('#data = :data');
      expressionAttributeNames['#data'] = 'data';
      expressionAttributeValues[':data'] = updates.data;
    }

    updateExpression.push('#lastUpdated = :lastUpdated');
    expressionAttributeNames['#lastUpdated'] = 'lastUpdated';
    expressionAttributeValues[':lastUpdated'] = Date.now();

    if (deviceId) {
      updateExpression.push('#deviceId = :deviceId');
      expressionAttributeNames['#deviceId'] = 'deviceId';
      expressionAttributeValues[':deviceId'] = deviceId;
    }

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        userId,
        dataType,
      },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    const result = await this.executeCommand(command, `update ${dataType} data`);
    return result !== null;
  }

  // Get all user data for sync purposes
  async getAllUserData(userId: string): Promise<UserDataRecord[]> {
    // Note: This would typically use a Query operation with GSI
    // For simplicity, we'll get each data type individually
    const dataTypes = Object.values(DATA_TYPES);
    const results: UserDataRecord[] = [];

    for (const dataType of dataTypes) {
      const data = await this.getUserData(userId, dataType);
      if (data) {
        results.push(data);
      }
    }

    return results;
  }

  // Delete all user data (for account deletion)
  async deleteAllUserData(userId: string): Promise<boolean> {
    const dataTypes = Object.values(DATA_TYPES);
    let allSuccessful = true;

    for (const dataType of dataTypes) {
      const success = await this.deleteUserData(userId, dataType);
      if (!success) {
        allSuccessful = false;
      }
    }

    return allSuccessful;
  }

  // Health check for DynamoDB connection
  async healthCheck(): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      // Try a simple operation to test connectivity
      const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          userId: 'health-check',
          dataType: 'test',
        },
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      logger.error('DynamoDB health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const dynamoDBService = new DynamoDBService();

// Helper functions for specific data types
export const cloudStorage = {
  // Main app data (exchange rates, pinned currencies)
  saveMainData: (userId: string, data: MainStorageData, deviceId?: string) =>
    dynamoDBService.saveUserData(userId, DATA_TYPES.MAIN, data, deviceId),

  getMainData: async (userId: string): Promise<MainStorageData | null> => {
    const record = await dynamoDBService.getUserData(userId, DATA_TYPES.MAIN);
    return record?.data as MainStorageData || null;
  },

  // User preferences
  savePreferences: (userId: string, data: UserPreferences, deviceId?: string) =>
    dynamoDBService.saveUserData(userId, DATA_TYPES.PREFERENCES, data, deviceId),

  getPreferences: async (userId: string): Promise<UserPreferences | null> => {
    const record = await dynamoDBService.getUserData(userId, DATA_TYPES.PREFERENCES);
    return record?.data as UserPreferences || null;
  },

  // Itinerary data
  saveItinerary: (userId: string, data: SerializedItineraryItem[], deviceId?: string) =>
    dynamoDBService.saveUserData(userId, DATA_TYPES.ITINERARY, data, deviceId),

  getItinerary: async (userId: string): Promise<SerializedItineraryItem[] | null> => {
    const record = await dynamoDBService.getUserData(userId, DATA_TYPES.ITINERARY);
    return record?.data as SerializedItineraryItem[] || null;
  },

  // Search data
  saveSearchData: (userId: string, data: SearchData, deviceId?: string) =>
    dynamoDBService.saveUserData(userId, DATA_TYPES.SEARCH, data, deviceId),

  getSearchData: async (userId: string): Promise<SearchData | null> => {
    const record = await dynamoDBService.getUserData(userId, DATA_TYPES.SEARCH);
    return record?.data as SearchData || null;
  },

  // Timezone cache
  saveTimezoneCache: (userId: string, data: TimezoneCache, deviceId?: string) =>
    dynamoDBService.saveUserData(userId, DATA_TYPES.TIMEZONE_CACHE, data, deviceId),

  getTimezoneCache: async (userId: string): Promise<TimezoneCache | null> => {
    const record = await dynamoDBService.getUserData(userId, DATA_TYPES.TIMEZONE_CACHE);
    return record?.data as TimezoneCache || null;
  },

  // Sync all data
  syncAll: async (userId: string) => {
    const allData = await dynamoDBService.getAllUserData(userId);
    return allData;
  },

  // Delete all data
  deleteAll: (userId: string) => dynamoDBService.deleteAllUserData(userId),

  // Health check
  isAvailable: () => dynamoDBService.healthCheck(),
};
