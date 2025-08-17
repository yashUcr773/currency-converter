// React hook for authenticated backend API calls
// This hook provides the authenticated cloudStorage interface

import { useAuth } from '@clerk/clerk-react';
import { useCallback } from 'react';
import { secureBackendService, DATA_TYPES } from '../utils/secureBackendService';
import type { MainStorageData, UserPreferences, SearchData, TimezoneCache, SerializedItineraryItem } from '../utils/storageManager';
import { logger } from '../utils/env';

export const useSecureCloudStorage = () => {
  const { getToken } = useAuth();

  // Get auth token helper
  const getAuthToken = useCallback(async (): Promise<string | null> => {
    try {
      const token = await getToken();
      return token;
    } catch (error) {
      logger.error('Failed to get auth token:', error);
      return null;
    }
  }, [getToken]);

  // Authenticated cloud storage interface
  const cloudStorage = {
    // Main app data (exchange rates, pinned currencies)
    saveMainData: useCallback(async (userId: string, data: MainStorageData, deviceId?: string): Promise<boolean> => {
      logger.log('saveMainData called with userId:', userId, 'deviceId:', deviceId);
      const token = await getAuthToken();
      if (!token) return false;
      return secureBackendService.saveUserData(DATA_TYPES.MAIN, data, token, userId, deviceId);
    }, [getAuthToken]),

    getMainData: useCallback(async (userId: string, deviceId?: string): Promise<{ devices?: Array<{ deviceId: string; data: MainStorageData; lastUpdated: number; version: string; }>; legacy?: MainStorageData; } | null> => {
      logger.log('getMainData called with userId:', userId, 'deviceId:', deviceId);
      const token = await getAuthToken();
      if (!token) return null;
      return secureBackendService.getUserData<MainStorageData>(DATA_TYPES.MAIN, token, userId, deviceId);
    }, [getAuthToken]),

    // User preferences
    savePreferences: useCallback(async (userId: string, data: UserPreferences, deviceId?: string): Promise<boolean> => {
      logger.log('savePreferences called with userId:', userId, 'deviceId:', deviceId);
      const token = await getAuthToken();
      if (!token) return false;
      return secureBackendService.saveUserData(DATA_TYPES.PREFERENCES, data, token, userId, deviceId);
    }, [getAuthToken]),

    getPreferences: useCallback(async (userId: string, deviceId?: string): Promise<{ devices?: Array<{ deviceId: string; data: UserPreferences; lastUpdated: number; version: string; }>; legacy?: UserPreferences; } | null> => {
      logger.log('getPreferences called with userId:', userId, 'deviceId:', deviceId);
      const token = await getAuthToken();
      if (!token) return null;
      return secureBackendService.getUserData<UserPreferences>(DATA_TYPES.PREFERENCES, token, userId, deviceId);
    }, [getAuthToken]),

    // Itinerary data
    saveItinerary: useCallback(async (userId: string, data: SerializedItineraryItem[], deviceId?: string): Promise<boolean> => {
      logger.log('saveItinerary called with userId:', userId, 'deviceId:', deviceId);
      const token = await getAuthToken();
      if (!token) return false;
      return secureBackendService.saveUserData(DATA_TYPES.ITINERARY, data, token, userId, deviceId);
    }, [getAuthToken]),

    getItinerary: useCallback(async (userId: string, deviceId?: string): Promise<{ devices?: Array<{ deviceId: string; data: SerializedItineraryItem[]; lastUpdated: number; version: string; }>; legacy?: SerializedItineraryItem[]; } | null> => {
      logger.log('getItinerary called with userId:', userId, 'deviceId:', deviceId);
      const token = await getAuthToken();
      if (!token) return null;
      return secureBackendService.getUserData<SerializedItineraryItem[]>(DATA_TYPES.ITINERARY, token, userId, deviceId);
    }, [getAuthToken]),

    // Search data
    saveSearchData: useCallback(async (userId: string, data: SearchData, deviceId?: string): Promise<boolean> => {
      logger.log('saveSearchData called with userId:', userId, 'deviceId:', deviceId);
      const token = await getAuthToken();
      if (!token) return false;
      return secureBackendService.saveUserData(DATA_TYPES.SEARCH, data, token, userId, deviceId);
    }, [getAuthToken]),

    getSearchData: useCallback(async (userId: string, deviceId?: string): Promise<{ devices?: Array<{ deviceId: string; data: SearchData; lastUpdated: number; version: string; }>; legacy?: SearchData; } | null> => {
      logger.log('getSearchData called with userId:', userId, 'deviceId:', deviceId);
      const token = await getAuthToken();
      if (!token) return null;
      return secureBackendService.getUserData<SearchData>(DATA_TYPES.SEARCH, token, userId, deviceId);
    }, [getAuthToken]),

    // Timezone cache
    saveTimezoneCache: useCallback(async (userId: string, data: TimezoneCache, deviceId?: string): Promise<boolean> => {
      logger.log('saveTimezoneCache called with userId:', userId, 'deviceId:', deviceId);
      const token = await getAuthToken();
      if (!token) return false;
      return secureBackendService.saveUserData(DATA_TYPES.TIMEZONE_CACHE, data, token, userId, deviceId);
    }, [getAuthToken]),

    getTimezoneCache: useCallback(async (userId: string, deviceId?: string): Promise<{ devices?: Array<{ deviceId: string; data: TimezoneCache; lastUpdated: number; version: string; }>; legacy?: TimezoneCache; } | null> => {
      logger.log('getTimezoneCache called with userId:', userId, 'deviceId:', deviceId);
      const token = await getAuthToken();
      if (!token) return null;
      return secureBackendService.getUserData<TimezoneCache>(DATA_TYPES.TIMEZONE_CACHE, token, userId, deviceId);
    }, [getAuthToken]),

    // Sync all data
    syncAll: useCallback(async (userId: string) => {
      logger.log('syncAll called with userId:', userId);
      const token = await getAuthToken();
      if (!token) return null;
      return secureBackendService.getAllUserData(token, userId);
    }, [getAuthToken]),

    // Delete all data
    deleteAll: useCallback(async (userId: string): Promise<boolean> => {
      logger.log('deleteAll called with userId:', userId);
      const token = await getAuthToken();
      if (!token) return false;
      return secureBackendService.deleteAllUserData(token, userId);
    }, [getAuthToken]),

    // Health check
    isAvailable: useCallback(async (): Promise<boolean> => {
      return secureBackendService.isAvailable();
    }, []),

    // Update API URL (for configuration)
    updateApiUrl: useCallback((newUrl: string) => {
      secureBackendService.updateApiUrl(newUrl);
    }, []),
  };

  return cloudStorage;
};
