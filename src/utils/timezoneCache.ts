// Service Worker utilities for timezone caching
import { storageManager } from './storageManager';
import { logger } from './env';

// Cache timezone data in service worker
export const cacheTimezoneData = async (key: string, data: unknown): Promise<boolean> => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      const messageChannel = new MessageChannel();
      
      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data.success || false);
        };
        
        navigator?.serviceWorker?.controller?.postMessage(
          {
            type: 'CACHE_TIMEZONE_DATA',
            data: { key, value: data }
          },
          [messageChannel.port2]
        );
        
        // Timeout after 5 seconds
        setTimeout(() => resolve(false), 5000);
      });
    } catch (error) {
      logger.error('Error caching timezone data:', error);
      return false;
    }
  }
  return false;
};

// Get timezone data from service worker cache
export const getTimezoneDataFromCache = async (key: string): Promise<unknown | null> => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      const messageChannel = new MessageChannel();
      
      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data.data || null);
        };
        
        navigator?.serviceWorker?.controller?.postMessage(
          {
            type: 'GET_TIMEZONE_DATA',
            data: { key }
          },
          [messageChannel.port2]
        );
        
        // Timeout after 5 seconds
        setTimeout(() => resolve(null), 5000);
      });
    } catch (error) {
      logger.error('Error getting timezone data from cache:', error);
      return null;
    }
  }
  return null;
};

// Enhanced localStorage with service worker backup
export const setTimezoneData = async (key: string, data: unknown): Promise<void> => {
  // Save to centralized storage manager first
  storageManager.setTimezoneData(key, data);
  
  // Backup to service worker cache
  await cacheTimezoneData(key, data);
};

// Enhanced retrieving with service worker fallback
export const getTimezoneData = async (key: string): Promise<unknown | null> => {
  // Try centralized storage manager first
  const stored = storageManager.getTimezoneData(key);
  if (stored) {
    return stored;
  }
  
  // Fallback to service worker cache
  return await getTimezoneDataFromCache(key);
};

// Clear all timezone data
export const clearTimezoneData = async (): Promise<void> => {
  // Clear centralized storage
  storageManager.clearTimezoneCache();
  
  // Clear service worker cache
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      const messageChannel = new MessageChannel();
      
      navigator.serviceWorker.controller.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
    } catch (error) {
      logger.error('Error clearing service worker cache:', error);
    }
  }
};
