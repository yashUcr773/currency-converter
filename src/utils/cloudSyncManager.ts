// Cloud sync manager - integrates DynamoDB with local storage
// Provides automatic synchronization for logged-in users with intelligent conflict resolution

import { useUser } from '@clerk/clerk-react';
import { useCallback, useEffect, useState } from 'react';
import { storageManager } from './storageManager';
import { useSecureCloudStorage } from '../hooks/useSecureCloudStorage'; // Updated to use secure hook
import { dataReconciler } from './dataReconciler';
import { logger } from './env';

// Sync status types
export type SyncStatus = 'idle' | 'syncing' | 'error' | 'success';

export interface SyncState {
  status: SyncStatus;
  lastSync: number | null;
  error: string | null;
  isOnline: boolean;
  cloudAvailable: boolean;
}

// Device ID for conflict resolution
function getDeviceId(): string {
  let deviceId = localStorage.getItem('device-id');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('device-id', deviceId);
  }
  return deviceId;
}

class CloudSyncManager {
  private syncInProgress = false;
  private deviceId = getDeviceId();
  private syncQueue: (() => Promise<void>)[] = [];
  private periodicSyncTimer: NodeJS.Timeout | null = null;
  private readonly SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cloudStorage: any = null; // Will be set by the React hook - TODO: Type properly
  
  // Conflict resolution preferences - Enhanced for multi-device sync
  private conflictStrategies = {
    mainData: 'latest-wins' as const,          // Use latest for main data
    preferences: 'latest-wins' as const,       // Use latest for preferences
    itinerary: 'merge-by-id' as const,         // Merge itinerary items by ID across devices
    searchData: 'merge-union' as const,        // Merge search data from all devices
    timezoneCache: 'merge-union' as const      // Merge timezone cache from all devices
  };

  // Set cloud storage instance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCloudStorage(storage: any): void {
    this.cloudStorage = storage;
  }

  // Queue sync operations to prevent conflicts
  private async queueSync<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.syncQueue.push(async () => {
        try {
          const result = await operation();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processSyncQueue();
    });
  }

  private async processSyncQueue(): Promise<void> {
    if (this.syncInProgress || this.syncQueue.length === 0) {
      return;
    }

    this.syncInProgress = true;
    
    while (this.syncQueue.length > 0) {
      const operation = this.syncQueue.shift();
      if (operation) {
        try {
          await operation();
        } catch (error) {
          logger.error('Sync operation failed:', error);
        }
      }
    }

    this.syncInProgress = false;
  }

  // Upload local data to cloud
  async uploadToCloud(userId: string): Promise<boolean> {
    try {
      logger.log('Uploading local data to cloud...');

      // Upload main data
      const mainData = storageManager.getMainData();
      if (mainData) {
        await this.cloudStorage.saveMainData(userId, mainData, this.deviceId);
      }

      // Upload preferences
      const preferences = storageManager.getPreferences();
      if (preferences) {
        await this.cloudStorage.savePreferences(userId, preferences, this.deviceId);
      }

      // Upload itinerary (serialize dates)
      const itineraryItems = storageManager.getItineraryItems();
      if (itineraryItems.length > 0) {
        const serialized = itineraryItems.map(item => ({
          ...item,
          startDate: item.startDate.toISOString(),
          endDate: item.endDate?.toISOString(),
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString()
        }));
        await this.cloudStorage.saveItinerary(userId, serialized, this.deviceId);
      }

      // Upload search data
      const searchData = storageManager.getSearchData();
      if (searchData) {
        await this.cloudStorage.saveSearchData(userId, searchData, this.deviceId);
      }

      // Upload timezone cache
      const timezoneCache = storageManager.getTimezoneCache();
      if (timezoneCache) {
        await this.cloudStorage.saveTimezoneCache(userId, timezoneCache, this.deviceId);
      }

      logger.log('Upload to cloud completed successfully');
      return true;
    } catch (error) {
      logger.error('Failed to upload to cloud:', error);
      return false;
    }
  }

  // Download cloud data and reconcile with local data intelligently
  async downloadFromCloud(userId: string): Promise<boolean> {
    try {
      logger.log('Downloading and reconciling data from cloud...');

      // Get or create device metadata with actual timestamps
      const deviceId = this.deviceId;
      const storageMetadata = storageManager.getMetadata();
      
      // Create local metadata based on actual storage metadata
      const localMeta = dataReconciler.createMetadata(deviceId, '1.0.0');
      if (storageMetadata) {
        localMeta.lastModified = storageMetadata.lastUpdated;
        localMeta.version = storageMetadata.version;
      }
      
      // Cloud metadata will be updated with actual cloud data timestamps
      const cloudMeta = dataReconciler.createMetadata('cloud', '1.0.0');

      // Download and reconcile main data with multi-device support
      const cloudMainDataResponse = await this.cloudStorage.getMainData(userId, this.deviceId);
      const localMainData = storageManager.getMainData();
      
      logger.log('Main data sync:', { 
        hasCloudDevices: !!(cloudMainDataResponse?.devices?.length), 
        hasCloudLegacy: !!cloudMainDataResponse?.legacy,
        hasLocalData: !!localMainData,
        deviceCount: cloudMainDataResponse?.devices?.length || 0,
        localDataKeys: localMainData ? Object.keys(localMainData) : []
      });
      
      // Handle multi-device merging
      let mergedMainData = localMainData;
      if (cloudMainDataResponse) {
        const { devices = [], legacy } = cloudMainDataResponse;
        
        // Start with legacy data if available
        let cloudMainData = legacy;
        
        // Merge multi-device data if available
        if (devices.length > 0) {
          const { mergeDeviceData } = await import('./dataReconciler');
          const mergedFromDevices = mergeDeviceData(devices, this.conflictStrategies.mainData);
          cloudMainData = mergedFromDevices || cloudMainData;
        }
        
        if (cloudMainData || localMainData) {
          const reconciled = dataReconciler.reconcileMainData(
            localMainData,
            cloudMainData,
            localMeta,
            cloudMeta,
            this.conflictStrategies.mainData
          );
          
          dataReconciler.logReconciliation(reconciled, 'main data');
          logger.log('Storing reconciled main data:', { 
            dataKeys: Object.keys(reconciled.mergedData),
            hasConflicts: reconciled.hasConflicts 
          });
          mergedMainData = reconciled.mergedData;
        }
      }
      
      if (mergedMainData) {
        storageManager.setMainData(mergedMainData);
      }

      // Download and reconcile preferences with multi-device support
      const cloudPreferencesResponse = await this.cloudStorage.getPreferences(userId, this.deviceId);
      const localPreferences = storageManager.getPreferences();
      
      logger.log('Preferences sync:', { 
        hasCloudDevices: !!(cloudPreferencesResponse?.devices?.length), 
        hasCloudLegacy: !!cloudPreferencesResponse?.legacy,
        hasLocalData: !!localPreferences,
        deviceCount: cloudPreferencesResponse?.devices?.length || 0
      });
      
      // Handle multi-device merging
      let mergedPreferences = localPreferences;
      if (cloudPreferencesResponse) {
        const { devices = [], legacy } = cloudPreferencesResponse;
        
        // Start with legacy data if available
        let cloudPreferences = legacy;
        
        // Merge multi-device data if available
        if (devices.length > 0) {
          const { mergeDeviceData } = await import('./dataReconciler');
          const mergedFromDevices = mergeDeviceData(devices, this.conflictStrategies.preferences);
          cloudPreferences = mergedFromDevices || cloudPreferences;
        }
        
        if (cloudPreferences || localPreferences) {
          const reconciled = dataReconciler.reconcilePreferences(
            localPreferences,
            cloudPreferences,
            localMeta,
            cloudMeta,
            this.conflictStrategies.preferences
          );
          
          dataReconciler.logReconciliation(reconciled, 'preferences');
          logger.log('Storing reconciled preferences:', reconciled.mergedData);
          mergedPreferences = reconciled.mergedData;
        }
      }
      
      if (mergedPreferences) {
        storageManager.setPreferences(mergedPreferences);
      }

      // Download and reconcile itinerary with multi-device support
      const cloudItineraryResponse = await this.cloudStorage.getItinerary(userId, this.deviceId);
      const localItinerary = storageManager.getItineraryItems();
      
      logger.log('Itinerary sync:', { 
        hasCloudDevices: !!(cloudItineraryResponse?.devices?.length), 
        hasCloudLegacy: !!cloudItineraryResponse?.legacy,
        hasLocalData: localItinerary.length > 0,
        deviceCount: cloudItineraryResponse?.devices?.length || 0,
        localItemCount: localItinerary.length
      });
      
      // Handle multi-device merging
      let mergedItinerary = localItinerary;
      if (cloudItineraryResponse) {
        const { devices = [], legacy } = cloudItineraryResponse;
        
        // Start with legacy data if available
        let cloudItinerary = legacy || [];
        
        // Merge multi-device data if available
        if (devices.length > 0) {
          const { mergeDeviceData } = await import('./dataReconciler');
          const mergedFromDevices = mergeDeviceData(devices, this.conflictStrategies.itinerary);
          cloudItinerary = mergedFromDevices || cloudItinerary;
        }
        
        if (cloudItinerary.length > 0 || localItinerary.length > 0) {
          const reconciled = dataReconciler.reconcileItinerary(
            localItinerary,
            cloudItinerary,
            localMeta,
            cloudMeta,
            this.conflictStrategies.itinerary
          );
          
          dataReconciler.logReconciliation(reconciled, 'itinerary');
          logger.log('Storing reconciled itinerary:', { 
            itemCount: reconciled.mergedData.length,
            hasConflicts: reconciled.hasConflicts 
          });
          mergedItinerary = reconciled.mergedData;
        }
      }
      
      if (mergedItinerary) {
        storageManager.setItineraryItems(mergedItinerary);
      }

      // Download and reconcile search data with multi-device support
      const cloudSearchDataResponse = await this.cloudStorage.getSearchData(userId, this.deviceId);
      const localSearchData = storageManager.getSearchData();
      
      logger.log('Search data sync:', { 
        hasCloudDevices: !!(cloudSearchDataResponse?.devices?.length), 
        hasCloudLegacy: !!cloudSearchDataResponse?.legacy,
        hasLocalData: !!localSearchData,
        deviceCount: cloudSearchDataResponse?.devices?.length || 0
      });
      
      // Handle multi-device merging
      let mergedSearchData = localSearchData;
      if (cloudSearchDataResponse) {
        const { devices = [], legacy } = cloudSearchDataResponse;
        
        // Start with legacy data if available
        let cloudSearchData = legacy;
        
        // Merge multi-device data if available
        if (devices.length > 0) {
          const { mergeDeviceData } = await import('./dataReconciler');
          const mergedFromDevices = mergeDeviceData(devices, this.conflictStrategies.searchData);
          cloudSearchData = mergedFromDevices || cloudSearchData;
        }
        
        if (cloudSearchData || localSearchData) {
          const reconciled = dataReconciler.reconcileSearchData(
            localSearchData,
            cloudSearchData,
            localMeta,
            cloudMeta,
            this.conflictStrategies.searchData
          );
          
          dataReconciler.logReconciliation(reconciled, 'search data');
          logger.log('Storing reconciled search data:', reconciled.mergedData);
          mergedSearchData = reconciled.mergedData;
        }
      }
      
      if (mergedSearchData) {
        storageManager.setSearchData(mergedSearchData);
      }

      // Download and reconcile timezone cache with multi-device support
      const cloudTimezoneCacheResponse = await this.cloudStorage.getTimezoneCache(userId, this.deviceId);
      const localTimezoneCache = storageManager.getTimezoneCache();
      
      logger.log('Timezone cache sync:', { 
        hasCloudDevices: !!(cloudTimezoneCacheResponse?.devices?.length), 
        hasCloudLegacy: !!cloudTimezoneCacheResponse?.legacy,
        hasLocalData: !!localTimezoneCache,
        deviceCount: cloudTimezoneCacheResponse?.devices?.length || 0
      });
      
      // Handle multi-device merging
      let mergedTimezoneCache = localTimezoneCache;
      if (cloudTimezoneCacheResponse) {
        const { devices = [], legacy } = cloudTimezoneCacheResponse;
        
        // Start with legacy data if available
        let cloudTimezoneCache = legacy;
        
        // Merge multi-device data if available
        if (devices.length > 0) {
          const { mergeDeviceData } = await import('./dataReconciler');
          const mergedFromDevices = mergeDeviceData(devices, this.conflictStrategies.timezoneCache);
          cloudTimezoneCache = mergedFromDevices || cloudTimezoneCache;
        }
        
        if (cloudTimezoneCache || localTimezoneCache) {
          const reconciled = dataReconciler.reconcileTimezoneCache(
            localTimezoneCache,
            cloudTimezoneCache,
            localMeta,
            cloudMeta,
            this.conflictStrategies.timezoneCache
          );
          
          dataReconciler.logReconciliation(reconciled, 'timezone cache');
          logger.log('Storing reconciled timezone cache:', reconciled.mergedData);
          mergedTimezoneCache = reconciled.mergedData;
        }
      }
      
      if (mergedTimezoneCache) {
        storageManager.setTimezoneCache(mergedTimezoneCache);
      }

      logger.log('Download and reconciliation from cloud completed successfully');
      return true;
    } catch (error) {
      logger.error('Failed to download from cloud:', error);
      return false;
    }
  }

  // Full bidirectional sync with multi-device awareness
  async performFullSync(userId: string): Promise<boolean> {
    return this.queueSync(async () => {
      logger.log('Starting multi-device bidirectional sync...');
      
      // Step 1: Upload current device data to cloud
      // This will trigger server-side merging with other device data
      const uploadSuccess = await this.uploadToCloud(userId);
      
      if (!uploadSuccess) {
        logger.error('Upload phase failed during full sync');
        return false;
      }
      
      // Step 2: Download merged data from cloud
      // The backend has already merged data from all devices
      const downloadSuccess = await this.downloadFromCloud(userId);
      
      if (!downloadSuccess) {
        logger.error('Download phase failed during full sync');
        return false;
      }
      
      logger.log('Multi-device bidirectional sync completed successfully');
      return true;
    });
  }

  // Sync specific data type
  async syncDataType(
    userId: string, 
    dataType: 'main' | 'preferences' | 'itinerary' | 'search' | 'timezone'
  ): Promise<boolean> {
    return this.queueSync(async () => {
      try {
        switch (dataType) {
          case 'main': {
            const data = storageManager.getMainData();
            if (data) {
              return await this.cloudStorage.saveMainData(userId, data, this.deviceId);
            }
            break;
          }
          case 'preferences': {
            const data = storageManager.getPreferences();
            if (data) {
              return await this.cloudStorage.savePreferences(userId, data, this.deviceId);
            }
            break;
          }
          case 'itinerary': {
            const items = storageManager.getItineraryItems();
            if (items.length > 0) {
              const serialized = items.map(item => ({
                ...item,
                startDate: item.startDate.toISOString(),
                endDate: item.endDate?.toISOString(),
                createdAt: item.createdAt.toISOString(),
                updatedAt: item.updatedAt.toISOString()
              }));
              return await this.cloudStorage.saveItinerary(userId, serialized, this.deviceId);
            }
            break;
          }
          case 'search': {
            const data = storageManager.getSearchData();
            if (data) {
              return await this.cloudStorage.saveSearchData(userId, data, this.deviceId);
            }
            break;
          }
          case 'timezone': {
            const data = storageManager.getTimezoneCache();
            if (data) {
              return await this.cloudStorage.saveTimezoneCache(userId, data, this.deviceId);
            }
            break;
          }
        }
        return false;
      } catch (error) {
        logger.error(`Failed to sync ${dataType}:`, error);
        return false;
      }
    });
  }

  // Delete all cloud data for user
  async deleteCloudData(userId: string): Promise<boolean> {
    try {
      return await this.cloudStorage.deleteAll(userId);
    } catch (error) {
      logger.error('Failed to delete cloud data:', error);
      return false;
    }
  }

  // Check if cloud storage is available
  async isCloudAvailable(): Promise<boolean> {
    try {
      console.log("🚀 ~ CloudSyncManager ~ isCloudAvailable ~ this.cloudStorage:", this.cloudStorage)
      if (!this.cloudStorage) {
        return false;
      }
      console.log("🚀 ~ CloudSyncManager ~ isCloudAvailable ~ await this.cloudStorage.isAvailable():", await this.cloudStorage.isAvailable())
      return await this.cloudStorage.isAvailable();
    } catch (error) {
      logger.error('Cloud availability check failed:', error);
      return false;
    }
  }

  // Initial sync for new users - handles first login scenario
  async performInitialSync(userId: string): Promise<boolean> {
    return this.queueSync(async () => {
      logger.log('Performing initial sync for new user...');
      
      try {
        // Check if user has existing cloud data
        const hasCloudData = await this.hasExistingCloudData(userId);
        
        if (hasCloudData) {
          // User has cloud data - download and merge with local
          logger.log('Existing cloud data found, downloading and reconciling...');
          return await this.downloadFromCloud(userId);
        } else {
          // New user - upload local data to cloud
          logger.log('No cloud data found, uploading local data...');
          return await this.uploadToCloud(userId);
        }
      } catch (error) {
        logger.error('Initial sync failed:', error);
        return false;
      }
    });
  }

  // Check if user has existing data in cloud
  private async hasExistingCloudData(userId: string): Promise<boolean> {
    try {
      const hasMain = !!(await this.cloudStorage.getMainData(userId, this.deviceId));
      const hasPrefs = !!(await this.cloudStorage.getPreferences(userId, this.deviceId));
      const hasItinerary = !!(await this.cloudStorage.getItinerary(userId, this.deviceId));
      
      return hasMain || hasPrefs || hasItinerary;
    } catch (error) {
      logger.error('Failed to check existing cloud data:', error);
      return false;
    }
  }

  // Start periodic sync service
  startPeriodicSync(userId: string): void {
    // Prevent multiple instances
    if (this.periodicSyncTimer) {
      logger.log('Periodic sync already running, skipping start request');
      return;
    }
    
    logger.log(`Starting periodic sync service (every ${this.SYNC_INTERVAL / 1000 / 60} minutes)`);
    
    this.periodicSyncTimer = setInterval(async () => {
      // Only sync if online and cloud is available
      if (navigator.onLine) {
        try {
          const isAvailable = await this.isCloudAvailable();
          if (isAvailable) {
            logger.log('Running periodic sync...');
            
            // Dispatch custom event to notify UI
            window.dispatchEvent(new CustomEvent('periodicSyncStarted'));
            
            const success = await this.performFullSync(userId);
            
            // Dispatch completion event
            window.dispatchEvent(new CustomEvent('periodicSyncCompleted', { 
              detail: { success } 
            }));
            
            if (success) {
              logger.log('Periodic sync completed successfully');
            } else {
              logger.warn('Periodic sync failed');
            }
          } else {
            logger.warn('Skipping periodic sync - cloud not available');
          }
        } catch (error) {
          logger.error('Periodic sync failed:', error);
          window.dispatchEvent(new CustomEvent('periodicSyncCompleted', { 
            detail: { success: false, error: error instanceof Error ? error.message : 'Unknown error' } 
          }));
        }
      } else {
        logger.log('Skipping periodic sync - offline');
      }
    }, this.SYNC_INTERVAL);
  }

  // Stop periodic sync service
  stopPeriodicSync(): void {
    if (this.periodicSyncTimer) {
      logger.log('Stopping periodic sync service');
      clearInterval(this.periodicSyncTimer);
      this.periodicSyncTimer = null;
    }
  }

  // Check if periodic sync is running
  isPeriodicSyncActive(): boolean {
    return this.periodicSyncTimer !== null;
  }
}

// Export singleton instance
export const cloudSyncManager = new CloudSyncManager();

// React hook for cloud sync
export function useCloudSync() {
  // Check if Clerk is properly configured
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = PUBLISHABLE_KEY && 
    PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here' && 
    PUBLISHABLE_KEY !== 'pk_test_your_actual_clerk_key_here';

  const { user, isLoaded } = useUser();
  const cloudStorage = useSecureCloudStorage();
  const [syncState, setSyncState] = useState<SyncState>({
    status: 'idle',
    lastSync: null,
    error: null,
    isOnline: navigator.onLine,
    cloudAvailable: false
  });

  // Set cloud storage instance in the manager
  useEffect(() => {
    cloudSyncManager.setCloudStorage(cloudStorage);
  }, [cloudStorage]);

  // Check cloud availability on mount - only if Clerk is configured
  useEffect(() => {
    const checkAvailability = async () => {
      if (!isClerkConfigured) {
        setSyncState(prev => ({ ...prev, cloudAvailable: false }));
        return;
      }
      const available = await cloudSyncManager.isCloudAvailable();
      setSyncState(prev => ({ ...prev, cloudAvailable: available }));
    };
    checkAvailability();
  }, [isClerkConfigured]);

  const performFullSync = useCallback(async () => {
    if (!user || !syncState.isOnline || !syncState.cloudAvailable) {
      return false;
    }

    setSyncState(prev => ({ ...prev, status: 'syncing', error: null }));

    try {
      const success = await cloudSyncManager.performFullSync(user.id);
      
      setSyncState(prev => ({
        ...prev,
        status: success ? 'success' : 'error',
        lastSync: success ? Date.now() : prev.lastSync,
        error: success ? null : 'Sync failed'
      }));

      return success;
    } catch (error) {
      setSyncState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
      return false;
    } finally {
      // Reset status after a delay
      setTimeout(() => {
        setSyncState(prev => ({ ...prev, status: 'idle' }));
      }, 3000);
    }
  }, [user, syncState.isOnline, syncState.cloudAvailable]);

  // Monitor online status and storage changes
  useEffect(() => {
    const handleOnline = () => {
      setSyncState(prev => ({ ...prev, isOnline: true }));
      
      // Only restart periodic sync if user is logged in and cloud is available
      if (isLoaded && user && syncState.cloudAvailable) {
        logger.log('Back online - restarting periodic sync');
        cloudSyncManager.startPeriodicSync(user.id);
        
        // Remove immediate sync when coming back online to prevent sync loops
        // Periodic sync will handle synchronization automatically
        logger.log('Skipping immediate sync - periodic sync will handle this');
      }
    };
    
    const handleOffline = () => {
      setSyncState(prev => ({ ...prev, isOnline: false }));
      // Stop periodic sync when offline to prevent failed attempts
      cloudSyncManager.stopPeriodicSync();
      logger.log('Gone offline - stopping periodic sync');
    };

    // Listen for storage changes to trigger automatic sync
    const handleStorageChange = (event: CustomEvent) => {
      // Skip metadata changes to prevent sync loops
      if (event.detail?.key === 'ratevault-metadata') {
        return;
      }
      
      // Skip if sync is already in progress
      if (syncState.status === 'syncing') {
        logger.log('Skipping auto-sync - sync already in progress');
        return;
      }
      
      // Disable auto-sync on storage changes to prevent infinite loops
      // Periodic sync will handle synchronization automatically
      logger.log('Storage changed, but skipping auto-sync to prevent loops. Periodic sync will handle this.');
      
      // Only log the storage change for debugging
      logger.log('Storage change detected:', event.detail?.key);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('storageChanged', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('storageChanged', handleStorageChange as EventListener);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const timeout = (window as any).autoSyncTimeout;
      if (timeout) clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user?.id]); // Intentionally limited dependencies to prevent restart loops

  // Auto-sync when user logs in and manage periodic sync
  useEffect(() => {
    let initialSyncTimer: NodeJS.Timeout;
    let regularSyncTimer: NodeJS.Timeout;

    if (isLoaded && user) {
      const hasPerformedInitialSync = localStorage.getItem(`initial-sync-${user.id}`);
      
      if (!hasPerformedInitialSync) {
        // First time login - perform initial sync
        logger.log('First login detected, performing initial sync...');
        initialSyncTimer = setTimeout(async () => {
          // Check conditions at time of execution
          if (syncState.isOnline && syncState.cloudAvailable) {
            const success = await cloudSyncManager.performInitialSync(user.id);
            if (success) {
              localStorage.setItem(`initial-sync-${user.id}`, 'true');
              logger.log('Initial sync completed successfully');
              
              // Start periodic sync after successful initial sync
              cloudSyncManager.startPeriodicSync(user.id);
            } else {
              logger.error('Initial sync failed');
            }
          } else {
            logger.log('Skipping initial sync - offline or cloud unavailable');
          }
        }, 2000);
      } else {
        // Regular sync for returning user
        regularSyncTimer = setTimeout(async () => {
          // Check conditions at time of execution
          if (syncState.isOnline && syncState.cloudAvailable) {
            const success = await performFullSync();
            if (success) {
              // Start periodic sync after successful regular sync
              cloudSyncManager.startPeriodicSync(user.id);
            }
          } else {
            logger.log('Skipping regular sync - offline or cloud unavailable');
            // Still start periodic sync, it will handle online/offline internally
            cloudSyncManager.startPeriodicSync(user.id);
          }
        }, 2000);
      }
    } else if (isLoaded && !user) {
      // User logged out - stop periodic sync
      cloudSyncManager.stopPeriodicSync();
    }

    // Cleanup timers and periodic sync when component unmounts or user changes
    return () => {
      if (initialSyncTimer) clearTimeout(initialSyncTimer);
      if (regularSyncTimer) clearTimeout(regularSyncTimer);
      if (!user) {
        cloudSyncManager.stopPeriodicSync();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user?.id]); // Only depend on user.id to prevent sync restart loops

  const uploadToCloud = useCallback(async () => {
    if (!user || !syncState.isOnline || !syncState.cloudAvailable) {
      return false;
    }

    setSyncState(prev => ({ ...prev, status: 'syncing' }));
    
    try {
      const success = await cloudSyncManager.uploadToCloud(user.id);
      setSyncState(prev => ({
        ...prev,
        status: success ? 'success' : 'error',
        lastSync: success ? Date.now() : prev.lastSync
      }));
      return success;
    } catch (error) {
      setSyncState(prev => ({ ...prev, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }));
      return false;
    }
  }, [user, syncState.isOnline, syncState.cloudAvailable]);

  const downloadFromCloud = useCallback(async () => {
    if (!user || !syncState.isOnline || !syncState.cloudAvailable) {
      return false;
    }

    setSyncState(prev => ({ ...prev, status: 'syncing' }));
    
    try {
      const success = await cloudSyncManager.downloadFromCloud(user.id);
      setSyncState(prev => ({
        ...prev,
        status: success ? 'success' : 'error',
        lastSync: success ? Date.now() : prev.lastSync
      }));
      return success;
    } catch (error) {
      setSyncState(prev => ({ ...prev, status: 'error', error: error instanceof Error ? error.message : 'Download failed' }));
      return false;
    }
  }, [user, syncState.isOnline, syncState.cloudAvailable]);

  const stopPeriodicSync = useCallback(() => {
    if (user) {
      cloudSyncManager.stopPeriodicSync();
    }
  }, [user]);

  const startPeriodicSync = useCallback(() => {
    if (user && syncState.isOnline && syncState.cloudAvailable) {
      cloudSyncManager.startPeriodicSync(user.id);
    }
  }, [user, syncState.isOnline, syncState.cloudAvailable]);

  const isPeriodicSyncActive = useCallback(() => {
    return cloudSyncManager.isPeriodicSyncActive();
  }, []);

  return {
    syncState,
    performFullSync,
    uploadToCloud,
    downloadFromCloud,
    startPeriodicSync,
    stopPeriodicSync,
    isPeriodicSyncActive,
    isLoggedIn: isClerkConfigured && isLoaded && !!user,
    canSync: isClerkConfigured && isLoaded && !!user && syncState.isOnline && syncState.cloudAvailable
  };
}
