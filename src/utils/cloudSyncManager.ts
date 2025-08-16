// Cloud sync manager - integrates DynamoDB with local storage
// Provides automatic synchronization for logged-in users with intelligent conflict resolution

import { useUser } from '@clerk/clerk-react';
import { useCallback, useEffect, useState } from 'react';
import { storageManager } from './storageManager';
import { cloudStorage } from './dynamoDBService';
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
  
  // Conflict resolution preferences
  private conflictStrategies = {
    mainData: 'merge-smart' as const,
    preferences: 'latest-wins' as const,
    itinerary: 'merge-union' as const,
    searchData: 'merge-union' as const,
    timezoneCache: 'merge-union' as const
  };

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
        await cloudStorage.saveMainData(userId, mainData, this.deviceId);
      }

      // Upload preferences
      const preferences = storageManager.getPreferences();
      if (preferences) {
        await cloudStorage.savePreferences(userId, preferences, this.deviceId);
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
        await cloudStorage.saveItinerary(userId, serialized, this.deviceId);
      }

      // Upload search data
      const searchData = storageManager.getSearchData();
      if (searchData) {
        await cloudStorage.saveSearchData(userId, searchData, this.deviceId);
      }

      // Upload timezone cache
      const timezoneCache = storageManager.getTimezoneCache();
      if (timezoneCache) {
        await cloudStorage.saveTimezoneCache(userId, timezoneCache, this.deviceId);
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

      // Get device metadata
      const deviceId = this.deviceId;
      const localMeta = dataReconciler.createMetadata(deviceId);
      const cloudMeta = dataReconciler.createMetadata('cloud', '1.0.0');

      // Download and reconcile main data
      const cloudMainData = await cloudStorage.getMainData(userId);
      const localMainData = storageManager.getMainData();
      
      if (cloudMainData || localMainData) {
        const reconciled = dataReconciler.reconcileMainData(
          localMainData,
          cloudMainData,
          localMeta,
          cloudMeta,
          this.conflictStrategies.mainData
        );
        
        dataReconciler.logReconciliation(reconciled, 'main data');
        storageManager.setMainData(reconciled.mergedData);
      }

      // Download and reconcile preferences
      const cloudPreferences = await cloudStorage.getPreferences(userId);
      const localPreferences = storageManager.getPreferences();
      
      if (cloudPreferences || localPreferences) {
        const reconciled = dataReconciler.reconcilePreferences(
          localPreferences,
          cloudPreferences,
          localMeta,
          cloudMeta,
          this.conflictStrategies.preferences
        );
        
        dataReconciler.logReconciliation(reconciled, 'preferences');
        storageManager.setPreferences(reconciled.mergedData);
      }

      // Download and reconcile itinerary
      const cloudItinerary = await cloudStorage.getItinerary(userId);
      const localItinerary = storageManager.getItineraryItems();
      
      if (cloudItinerary || localItinerary.length > 0) {
        const reconciled = dataReconciler.reconcileItinerary(
          localItinerary,
          cloudItinerary || [],
          localMeta,
          cloudMeta,
          this.conflictStrategies.itinerary
        );
        
        dataReconciler.logReconciliation(reconciled, 'itinerary');
        storageManager.setItineraryItems(reconciled.mergedData);
      }

      // Download and reconcile search data
      const cloudSearchData = await cloudStorage.getSearchData(userId);
      const localSearchData = storageManager.getSearchData();
      
      if (cloudSearchData || localSearchData) {
        const reconciled = dataReconciler.reconcileSearchData(
          localSearchData,
          cloudSearchData,
          localMeta,
          cloudMeta,
          this.conflictStrategies.searchData
        );
        
        dataReconciler.logReconciliation(reconciled, 'search data');
        storageManager.setSearchData(reconciled.mergedData);
      }

      // Download and reconcile timezone cache
      const cloudTimezoneCache = await cloudStorage.getTimezoneCache(userId);
      const localTimezoneCache = storageManager.getTimezoneCache();
      
      if (cloudTimezoneCache || localTimezoneCache) {
        const reconciled = dataReconciler.reconcileTimezoneCache(
          localTimezoneCache,
          cloudTimezoneCache,
          localMeta,
          cloudMeta,
          this.conflictStrategies.timezoneCache
        );
        
        dataReconciler.logReconciliation(reconciled, 'timezone cache');
        storageManager.setTimezoneCache(reconciled.mergedData);
      }

      logger.log('Download and reconciliation from cloud completed successfully');
      return true;
    } catch (error) {
      logger.error('Failed to download from cloud:', error);
      return false;
    }
  }

  // Full bidirectional sync with intelligent reconciliation
  async performFullSync(userId: string): Promise<boolean> {
    return this.queueSync(async () => {
      logger.log('Starting full bidirectional sync with reconciliation...');
      
      // Step 1: Download and reconcile cloud data with local data
      const downloadSuccess = await this.downloadFromCloud(userId);
      
      if (!downloadSuccess) {
        logger.error('Download phase failed during full sync');
        return false;
      }
      
      // Step 2: Upload the reconciled data back to cloud
      // This ensures cloud has the merged result
      const uploadSuccess = await this.uploadToCloud(userId);
      
      if (!uploadSuccess) {
        logger.error('Upload phase failed during full sync');
        return false;
      }
      
      logger.log('Full bidirectional sync completed successfully');
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
              return await cloudStorage.saveMainData(userId, data, this.deviceId);
            }
            break;
          }
          case 'preferences': {
            const data = storageManager.getPreferences();
            if (data) {
              return await cloudStorage.savePreferences(userId, data, this.deviceId);
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
              return await cloudStorage.saveItinerary(userId, serialized, this.deviceId);
            }
            break;
          }
          case 'search': {
            const data = storageManager.getSearchData();
            if (data) {
              return await cloudStorage.saveSearchData(userId, data, this.deviceId);
            }
            break;
          }
          case 'timezone': {
            const data = storageManager.getTimezoneCache();
            if (data) {
              return await cloudStorage.saveTimezoneCache(userId, data, this.deviceId);
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
      return await cloudStorage.deleteAll(userId);
    } catch (error) {
      logger.error('Failed to delete cloud data:', error);
      return false;
    }
  }

  // Check if cloud storage is available
  async isCloudAvailable(): Promise<boolean> {
    try {
      return await cloudStorage.isAvailable();
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
      const hasMain = !!(await cloudStorage.getMainData(userId));
      const hasPrefs = !!(await cloudStorage.getPreferences(userId));
      const hasItinerary = !!(await cloudStorage.getItinerary(userId));
      
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
  const { user, isLoaded } = useUser();
  const [syncState, setSyncState] = useState<SyncState>({
    status: 'idle',
    lastSync: null,
    error: null,
    isOnline: navigator.onLine,
    cloudAvailable: false
  });

  // Check cloud availability on mount
  useEffect(() => {
    const checkAvailability = async () => {
      const available = await cloudSyncManager.isCloudAvailable();
      setSyncState(prev => ({ ...prev, cloudAvailable: available }));
    };
    checkAvailability();
  }, []);

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
        
        // Also trigger an immediate sync when coming back online
        setTimeout(() => {
          performFullSync();
        }, 1000);
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
      
      if (isLoaded && user && syncState.isOnline && syncState.cloudAvailable) {
        // Debounce auto-sync to avoid excessive calls
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const timeout = (window as any).autoSyncTimeout;
        if (timeout) clearTimeout(timeout);
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).autoSyncTimeout = setTimeout(() => {
          // Double-check sync state before executing
          if (syncState.status !== 'syncing') {
            logger.log('Auto-sync triggered by storage change:', event.detail?.key);
            performFullSync();
          } else {
            logger.log('Skipping auto-sync - sync in progress');
          }
        }, 10000); // Increase debounce to 10 seconds to reduce frequency
      }
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
    isLoggedIn: isLoaded && !!user,
    canSync: isLoaded && !!user && syncState.isOnline && syncState.cloudAvailable
  };
}
