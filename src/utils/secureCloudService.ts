// Secure Cloud Service - Replaces direct DynamoDB access with Lambda API calls
// This service communicates with AWS Lambda functions instead of directly accessing DynamoDB

import type { MainStorageData, UserPreferences, SearchData, TimezoneCache, SerializedItineraryItem } from './storageManager';
import { logger } from './env';

// API Configuration - This will be set after Lambda deployment
const API_BASE_URL = import.meta.env.VITE_LAMBDA_API_URL || 'https://your-api-gateway-url.execute-api.us-west-2.amazonaws.com/prod';

// Data type constants (must match Lambda functions)
export const DATA_TYPES = {
  MAIN: 'main',
  PREFERENCES: 'preferences', 
  ITINERARY: 'itinerary',
  SEARCH: 'search',
  TIMEZONE_CACHE: 'timezone-cache',
} as const;

export type DataType = typeof DATA_TYPES[keyof typeof DATA_TYPES];

// Response interface for API calls
interface ApiResponse<T = unknown> {
  data?: T;
  timestamp?: number;
  version?: string;
  success?: boolean;
  error?: string;
  message?: string;
  healthy?: boolean;
}

class SecureCloudService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = API_BASE_URL;
  }

  // Get user ID from Clerk (this should be implemented based on your auth setup)
  private getUserId(): string | null {
    // In a real implementation, get this from Clerk
    // For now, return null if not authenticated
    try {
      // You'll need to implement this based on your Clerk setup
      // Example: return clerk.user?.id || null;
      return null;
    } catch {
      return null;
    }
  }

  // Get auth headers for API calls
  private getAuthHeaders(): Record<string, string> {
    const userId = this.getUserId();
    
    return {
      'Content-Type': 'application/json',
      'x-user-id': userId || '',
      // Add Clerk JWT token here when available
      // 'Authorization': `Bearer ${clerkToken}`
    };
  }

  // Generic API call method
  private async apiCall<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: unknown
  ): Promise<ApiResponse<T> | null> {
    try {
      const url = `${this.apiUrl}${endpoint}`;
      const headers = this.getAuthHeaders();

      const options: RequestInit = {
        method,
        headers,
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify({ data, version: '1.0.0', deviceId: 'web' });
      }

      logger.log(`API call: ${method} ${url}`);

      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        logger.error(`API call failed: ${response.status}`, errorData);
        return null;
      }

      const result = await response.json();
      return result as ApiResponse<T>;
    } catch (error) {
      logger.error('API call failed:', error);
      return null;
    }
  }

  // Save user data to Lambda/DynamoDB
  async saveUserData(dataType: DataType, data: unknown): Promise<boolean> {
    const result = await this.apiCall(`/data/${dataType}`, 'PUT', data);
    return result?.success === true;
  }

  // Get user data from Lambda/DynamoDB
  async getUserData<T>(dataType: DataType): Promise<T | null> {
    const result = await this.apiCall<T>(`/data/${dataType}`, 'GET');
    return result?.data || null;
  }

  // Delete user data
  async deleteUserData(dataType: DataType): Promise<boolean> {
    const result = await this.apiCall(`/data/${dataType}`, 'DELETE');
    return result?.success === true;
  }

  // Get all user data for sync
  async getAllUserData(): Promise<Record<string, unknown> | null> {
    const result = await this.apiCall<Record<string, unknown>>('/bulk', 'GET');
    return result?.data || null;
  }

  // Delete all user data
  async deleteAllUserData(): Promise<boolean> {
    const result = await this.apiCall('/bulk', 'DELETE');
    return result?.success === true;
  }

  // Health check
  async isAvailable(): Promise<boolean> {
    const result = await this.apiCall('/bulk', 'POST');
    return result?.healthy === true;
  }

  // Update API URL (call this after Lambda deployment)
  updateApiUrl(newUrl: string): void {
    this.apiUrl = newUrl;
    logger.log(`Updated API URL to: ${newUrl}`);
  }
}

// Export singleton instance
export const secureCloudService = new SecureCloudService();

// Helper functions for specific data types (compatible with existing code)
export const cloudStorage = {
  // Main app data (exchange rates, pinned currencies)
  saveMainData: (userId: string, data: MainStorageData, deviceId?: string) => {
    logger.log('saveMainData called with userId:', userId, 'deviceId:', deviceId);
    return secureCloudService.saveUserData(DATA_TYPES.MAIN, data);
  },

  getMainData: async (userId: string): Promise<MainStorageData | null> => {
    logger.log('getMainData called with userId:', userId);
    return secureCloudService.getUserData<MainStorageData>(DATA_TYPES.MAIN);
  },

  // User preferences
  savePreferences: (userId: string, data: UserPreferences, deviceId?: string) => {
    logger.log('savePreferences called with userId:', userId, 'deviceId:', deviceId);
    return secureCloudService.saveUserData(DATA_TYPES.PREFERENCES, data);
  },

  getPreferences: async (userId: string): Promise<UserPreferences | null> => {
    logger.log('getPreferences called with userId:', userId);
    return secureCloudService.getUserData<UserPreferences>(DATA_TYPES.PREFERENCES);
  },

  // Itinerary data
  saveItinerary: (userId: string, data: SerializedItineraryItem[], deviceId?: string) => {
    logger.log('saveItinerary called with userId:', userId, 'deviceId:', deviceId);
    return secureCloudService.saveUserData(DATA_TYPES.ITINERARY, data);
  },

  getItinerary: async (userId: string): Promise<SerializedItineraryItem[] | null> => {
    logger.log('getItinerary called with userId:', userId);
    return secureCloudService.getUserData<SerializedItineraryItem[]>(DATA_TYPES.ITINERARY);
  },

  // Search data
  saveSearchData: (userId: string, data: SearchData, deviceId?: string) => {
    logger.log('saveSearchData called with userId:', userId, 'deviceId:', deviceId);
    return secureCloudService.saveUserData(DATA_TYPES.SEARCH, data);
  },

  getSearchData: async (userId: string): Promise<SearchData | null> => {
    logger.log('getSearchData called with userId:', userId);
    return secureCloudService.getUserData<SearchData>(DATA_TYPES.SEARCH);
  },

  // Timezone cache
  saveTimezoneCache: (userId: string, data: TimezoneCache, deviceId?: string) => {
    logger.log('saveTimezoneCache called with userId:', userId, 'deviceId:', deviceId);
    return secureCloudService.saveUserData(DATA_TYPES.TIMEZONE_CACHE, data);
  },

  getTimezoneCache: async (userId: string): Promise<TimezoneCache | null> => {
    logger.log('getTimezoneCache called with userId:', userId);
    return secureCloudService.getUserData<TimezoneCache>(DATA_TYPES.TIMEZONE_CACHE);
  },

  // Sync all data
  syncAll: async (userId: string) => {
    logger.log('syncAll called with userId:', userId);
    return secureCloudService.getAllUserData();
  },

  // Delete all data
  deleteAll: (userId: string) => {
    logger.log('deleteAll called with userId:', userId);
    return secureCloudService.deleteAllUserData();
  },

  // Health check
  isAvailable: () => secureCloudService.isAvailable(),

  // Update API URL (for configuration after deployment)
  updateApiUrl: (newUrl: string) => secureCloudService.updateApiUrl(newUrl),
};
