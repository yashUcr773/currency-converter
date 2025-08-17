// Secure Backend Service - Replaces direct DynamoDB access with Node.js backend API calls
// This service communicates with the Express.js backend instead of AWS Lambda or direct DynamoDB

import type { MainStorageData, UserPreferences, SearchData, TimezoneCache, SerializedItineraryItem } from './storageManager';
import { logger } from './env';

// API Configuration
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Data type constants (must match backend)
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
  success: boolean;
  data?: T;
  legacy?: T;
  devices?: Array<{
    userId: string;
    deviceDataId: string;
    dataType: string;
    deviceId: string;
    data: T;
    lastUpdated: number;
    version: string;
  }>;
  timestamp?: number;
  version?: string;
  error?: string;
  message?: string;
  merged?: boolean;
}

class SecureBackendService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = BACKEND_BASE_URL;
  }

  // Generic API call method
  async apiCall<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: unknown,
    authToken?: string
  ): Promise<ApiResponse<T> | null> {
    try {
      const url = `${this.apiUrl}${endpoint}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const options: RequestInit = {
        method,
        headers,
        credentials: 'include',
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify({ data });
      }

      logger.log(`Backend API call: ${method} ${url}`);

      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: 'Network error',
          message: `HTTP ${response.status}: ${response.statusText}` 
        }));
        logger.error(`Backend API call failed: ${response.status}`, errorData);
        return null;
      }

      const result = await response.json();
      return result as ApiResponse<T>;
    } catch (error) {
      logger.error('Backend API call failed:', error);
      return null;
    }
  }

  // Save user data to backend
  async saveUserData(dataType: DataType, data: unknown, authToken?: string, userId?: string, deviceId?: string): Promise<boolean> {
    const userIdParam = userId || 'default-user';
    const deviceIdParam = deviceId || 'web';
    const result = await this.apiCall(`/api/sync/${userIdParam}/${deviceIdParam}/${dataType}`, 'POST', data, authToken);
    return result?.success === true;
  }

  // Get user data from backend - returns raw device data for client-side merging
  async getUserData<T>(dataType: DataType, authToken?: string, userId?: string, deviceId?: string): Promise<{ devices?: Array<{ deviceId: string; data: T; lastUpdated: number; version: string; }>; legacy?: T; } | null> {
    const userIdParam = userId || 'default-user';
    const deviceIdParam = deviceId || 'web';
    const result = await this.apiCall<T>(`/api/sync/${userIdParam}/${deviceIdParam}/${dataType}`, 'GET', undefined, authToken);
    logger.log(`getUserData(${dataType}) result:`, { 
      success: result?.success,
      hasDevices: result?.devices !== undefined,
      deviceCount: result?.devices?.length || 0,
      hasLegacy: result?.legacy !== undefined,
      hasData: result?.data !== undefined
    });
    
    if (result?.success) {
      // Handle new multi-device format
      if (result.devices && result.devices.length > 0) {
        return {
          devices: result.devices.map(device => ({
            deviceId: device.deviceId,
            data: device.data,
            lastUpdated: device.lastUpdated,
            version: device.version
          }))
        };
      }
      
      // Handle legacy format
      if (result.legacy !== undefined) {
        return { legacy: result.legacy };
      }
      
      // Backward compatibility - if data exists but no devices/legacy structure
      if (result.data !== undefined) {
        return { legacy: result.data };
      }
    }
    
    return null;
  }

  // Delete user data
  async deleteUserData(dataType: DataType, authToken?: string, userId?: string, deviceId?: string): Promise<boolean> {
    const userIdParam = userId || 'default-user';
    const deviceIdParam = deviceId || 'web';
    const result = await this.apiCall(`/api/sync/${userIdParam}/${deviceIdParam}/${dataType}`, 'DELETE', undefined, authToken);
    return result?.success === true;
  }

  // Get all user data for sync
  async getAllUserData(authToken?: string, userId?: string): Promise<Record<string, unknown> | null> {
    const userIdParam = userId || 'default-user';
    const result = await this.apiCall<Record<string, unknown>>(`/api/sync/${userIdParam}/bulk/all`, 'GET', undefined, authToken);
    return result?.data || null;
  }

  // Delete all user data
  async deleteAllUserData(authToken?: string, userId?: string): Promise<boolean> {
    const userIdParam = userId || 'default-user';
    const result = await this.apiCall(`/api/sync/${userIdParam}/bulk/all`, 'DELETE', undefined, authToken);
    return result?.success === true;
  }

  // Health check
  async isAvailable(authToken?: string): Promise<boolean> {
    const result = await this.apiCall('/api/health', 'GET', undefined, authToken);
    return result?.success === true;
  }

  // Update API URL (for configuration)
  updateApiUrl(newUrl: string): void {
    this.apiUrl = newUrl;
    logger.log(`Updated backend API URL to: ${newUrl}`);
  }
}

// Export singleton instance
export const secureBackendService = new SecureBackendService();

// Helper functions for specific data types (compatible with existing code)
export const cloudStorage = {
  // Main app data (exchange rates, pinned currencies)
  saveMainData: async (userId: string, _data: MainStorageData, deviceId?: string) => {
    logger.log('saveMainData called with userId:', userId, 'deviceId:', deviceId);
    // Auth token will be provided by the calling hook
    return false; // This will be overridden by the hook
  },

  getMainData: async (userId: string): Promise<MainStorageData | null> => {
    logger.log('getMainData called with userId:', userId);
    // Auth token will be provided by the calling hook
    return null; // This will be overridden by the hook
  },

  // User preferences
  savePreferences: async (userId: string, _data: UserPreferences, deviceId?: string) => {
    logger.log('savePreferences called with userId:', userId, 'deviceId:', deviceId);
    return false; // This will be overridden by the hook
  },

  getPreferences: async (userId: string): Promise<UserPreferences | null> => {
    logger.log('getPreferences called with userId:', userId);
    return null; // This will be overridden by the hook
  },

  // Itinerary data
  saveItinerary: async (userId: string, _data: SerializedItineraryItem[], deviceId?: string) => {
    logger.log('saveItinerary called with userId:', userId, 'deviceId:', deviceId);
    return false; // This will be overridden by the hook
  },

  getItinerary: async (userId: string): Promise<SerializedItineraryItem[] | null> => {
    logger.log('getItinerary called with userId:', userId);
    return null; // This will be overridden by the hook
  },

  // Search data
  saveSearchData: async (userId: string, _data: SearchData, deviceId?: string) => {
    logger.log('saveSearchData called with userId:', userId, 'deviceId:', deviceId);
    return false; // This will be overridden by the hook
  },

  getSearchData: async (userId: string): Promise<SearchData | null> => {
    logger.log('getSearchData called with userId:', userId);
    return null; // This will be overridden by the hook
  },

  // Timezone cache
  saveTimezoneCache: async (userId: string, _data: TimezoneCache, deviceId?: string) => {
    logger.log('saveTimezoneCache called with userId:', userId, 'deviceId:', deviceId);
    return false; // This will be overridden by the hook
  },

  getTimezoneCache: async (userId: string): Promise<TimezoneCache | null> => {
    logger.log('getTimezoneCache called with userId:', userId);
    return null; // This will be overridden by the hook
  },

  // Sync all data
  syncAll: async (userId: string) => {
    logger.log('syncAll called with userId:', userId);
    return null; // This will be overridden by the hook
  },

  // Delete all data
  deleteAll: async (userId: string) => {
    logger.log('deleteAll called with userId:', userId);
    return false; // This will be overridden by the hook
  },

  // Health check
  isAvailable: () => secureBackendService.isAvailable(),
};
