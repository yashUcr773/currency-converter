// Cloud sync hook - integrates backend API with local storage
// Provides automatic synchronization for logged-in users with intelligent conflict resolution

import { useUser } from '@clerk/clerk-react';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { storageManager } from '../utils/storageManager';
import { useSecureCloudStorage } from './useSecureCloudStorage';
import { logger } from '../utils/env';

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

export function useCloudSync() {
  const { user, isSignedIn } = useUser();
  const cloudStorage = useSecureCloudStorage();
  
  const [syncState, setSyncState] = useState<SyncState>({
    status: 'idle',
    lastSync: null,
    error: null,
    isOnline: navigator.onLine,
    cloudAvailable: false
  });

  const [syncInProgress, setSyncInProgress] = useState(false);
  const deviceId = getDeviceId();
  
  // Conflict resolution preferences
  const conflictStrategies = useMemo(() => ({
    mainData: 'merge-smart' as const,
    preferences: 'latest-wins' as const,
    itinerary: 'merge-union' as const,
    searchData: 'merge-union' as const,
    timezoneCache: 'merge-union' as const
  }), []);

  // Update sync state
  const updateSyncState = useCallback((updates: Partial<SyncState>) => {
    setSyncState(prev => ({ ...prev, ...updates }));
  }, []);

  // Check if cloud storage is available
  const checkCloudAvailability = useCallback(async (): Promise<boolean> => {
    try {
      const available = await cloudStorage.isAvailable();
      updateSyncState({ cloudAvailable: available });
      return available;
    } catch (error) {
      logger.error('Failed to check cloud availability:', error);
      updateSyncState({ cloudAvailable: false });
      return false;
    }
  }, [cloudStorage, updateSyncState]);

  // Helper to get data by type
  const getDataByType = useCallback(async (dataType: string): Promise<unknown> => {
    switch (dataType) {
      case 'mainData':
        return storageManager.getMainData();
      case 'preferences':
        return storageManager.getPreferences();
      case 'itinerary':
        return storageManager.getItineraryItems();
      case 'searchData':
        return storageManager.getSearchData();
      case 'timezoneCache':
        return storageManager.getTimezoneCache();
      default:
        return null;
    }
  }, []);

  // Helper to set data by type
  const setDataByType = useCallback(async (dataType: string, data: unknown): Promise<void> => {
    switch (dataType) {
      case 'mainData':
        storageManager.setMainData(data as never);
        break;
      case 'preferences':
        storageManager.setPreferences(data as never);
        break;
      case 'itinerary':
        storageManager.setItineraryItems(data as never);
        break;
      case 'searchData':
        storageManager.setSearchData(data as never);
        break;
      case 'timezoneCache':
        storageManager.setTimezoneCache(data as never);
        break;
    }
  }, []);

  // Helper for reconciliation
  const reconcileData = useCallback((localData: unknown, cloudData: unknown, strategy: string): unknown => {
    // Simple reconciliation logic - can be enhanced later
    switch (strategy) {
      case 'latest-wins':
        return cloudData; // Assume cloud is more recent for now
      case 'merge-smart':
        if (Array.isArray(localData) && Array.isArray(cloudData)) {
          // Merge arrays by union
          const combined = [...(localData || []), ...(cloudData || [])];
          return combined.filter((item, index, arr) => 
            arr.findIndex(i => JSON.stringify(i) === JSON.stringify(item)) === index
          );
        }
        // For objects, merge properties
        if (localData && cloudData && typeof localData === 'object' && typeof cloudData === 'object') {
          return { ...(localData as Record<string, unknown>), ...(cloudData as Record<string, unknown>) };
        }
        return cloudData;
      case 'merge-union':
        if (Array.isArray(localData) && Array.isArray(cloudData)) {
          return [...(localData || []), ...(cloudData || [])];
        }
        if (localData && cloudData && typeof localData === 'object' && typeof cloudData === 'object') {
          return { ...(localData as Record<string, unknown>), ...(cloudData as Record<string, unknown>) };
        }
        return cloudData;
      default:
        return cloudData;
    }
  }, []);

  // Upload local data to cloud
  const uploadData = useCallback(async (dataType: string, data: unknown): Promise<void> => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      switch (dataType) {
        case 'mainData':
          await cloudStorage.saveMainData(user.id, data as never, deviceId);
          break;
        case 'preferences':
          await cloudStorage.savePreferences(user.id, data as never, deviceId);
          break;
        case 'itinerary': {
          const serialized = Array.isArray(data) ? data.map(item => ({ ...item })) : data;
          await cloudStorage.saveItinerary(user.id, serialized as never, deviceId);
          break;
        }
        case 'searchData':
          await cloudStorage.saveSearchData(user.id, data as never, deviceId);
          break;
        case 'timezoneCache':
          await cloudStorage.saveTimezoneCache(user.id, data as never, deviceId);
          break;
        default:
          throw new Error(`Unknown data type: ${dataType}`);
      }
    } catch (error) {
      logger.error(`Failed to upload ${dataType}:`, error);
      throw error;
    }
  }, [user?.id, cloudStorage, deviceId]);

  // Download data from cloud
  const downloadData = useCallback(async (dataType: string): Promise<unknown> => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      switch (dataType) {
        case 'mainData':
          return await cloudStorage.getMainData(user.id);
        case 'preferences':
          return await cloudStorage.getPreferences(user.id);
        case 'itinerary':
          return await cloudStorage.getItinerary(user.id);
        case 'searchData':
          return await cloudStorage.getSearchData(user.id);
        case 'timezoneCache':
          return await cloudStorage.getTimezoneCache(user.id);
        default:
          throw new Error(`Unknown data type: ${dataType}`);
      }
    } catch (error) {
      logger.error(`Failed to download ${dataType}:`, error);
      throw error;
    }
  }, [user?.id, cloudStorage]);

  // Sync specific data type
  const syncDataType = useCallback(async (dataType: string): Promise<void> => {
    if (!user?.id || !syncState.cloudAvailable) return;

    try {
      // Get local data
      const localData = await getDataByType(dataType);

      // Get cloud data
      const cloudData = await downloadData(dataType);

      if (!cloudData) {
        // No cloud data, upload local if exists
        if (localData !== null) {
          await uploadData(dataType, localData);
          logger.log(`Uploaded initial ${dataType} to cloud`);
        }
        return;
      }

      // Both exist, resolve conflicts
      const strategy = conflictStrategies[dataType as keyof typeof conflictStrategies] || 'latest-wins';
      const reconciledData = reconcileData(localData, cloudData, strategy);

      if (reconciledData !== localData) {
        // Update local storage
        await setDataByType(dataType, reconciledData);
        logger.log(`Updated local ${dataType} from cloud reconciliation`);
      }

      // Always upload to ensure cloud has latest
      await uploadData(dataType, reconciledData);

    } catch (error) {
      logger.error(`Failed to sync ${dataType}:`, error);
      throw error;
    }
  }, [user?.id, syncState.cloudAvailable, getDataByType, downloadData, uploadData, reconcileData, setDataByType, conflictStrategies]);

  // Full sync operation
  const performFullSync = useCallback(async (): Promise<void> => {
    if (!isSignedIn || !user?.id || syncInProgress) return;

    setSyncInProgress(true);
    updateSyncState({ status: 'syncing', error: null });

    try {
      const available = await checkCloudAvailability();
      if (!available) {
        throw new Error('Cloud storage not available');
      }

      // Sync all data types
      const dataTypes = ['mainData', 'preferences', 'itinerary', 'searchData', 'timezoneCache'];
      
      for (const dataType of dataTypes) {
        await syncDataType(dataType);
      }

      updateSyncState({ 
        status: 'success', 
        lastSync: Date.now(),
        error: null 
      });

      logger.log('Full sync completed successfully');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown sync error';
      updateSyncState({ 
        status: 'error', 
        error: errorMessage 
      });
      logger.error('Sync failed:', error);
      throw error;
    } finally {
      setSyncInProgress(false);
    }
  }, [isSignedIn, user?.id, syncInProgress, checkCloudAvailability, syncDataType, updateSyncState]);

  // Force upload all local data
  const uploadAllData = useCallback(async (): Promise<void> => {
    if (!user?.id || !syncState.cloudAvailable) return;

    const dataTypes = ['mainData', 'preferences', 'itinerary', 'searchData', 'timezoneCache'];
    
    for (const dataType of dataTypes) {
      try {
        const localData = await getDataByType(dataType);
        if (localData !== null) {
          await uploadData(dataType, localData);
        }
      } catch (error) {
        logger.error(`Failed to upload ${dataType}:`, error);
      }
    }
  }, [user?.id, syncState.cloudAvailable, uploadData, getDataByType]);

  // Delete all cloud data
  const deleteAllCloudData = useCallback(async (): Promise<void> => {
    if (!user?.id) return;
    
    try {
      await cloudStorage.deleteAll(user.id);
      logger.log('Deleted all cloud data');
    } catch (error) {
      logger.error('Failed to delete cloud data:', error);
      throw error;
    }
  }, [user?.id, cloudStorage]);

  // Check if user has any cloud data
  const hasCloudData = useCallback(async (): Promise<boolean> => {
    if (!user?.id || !syncState.cloudAvailable) return false;
    
    try {
      const hasMain = !!(await cloudStorage.getMainData(user.id));
      const hasPrefs = !!(await cloudStorage.getPreferences(user.id));
      return hasMain || hasPrefs;
    } catch (error) {
      logger.error('Failed to check cloud data:', error);
      return false;
    }
  }, [user?.id, syncState.cloudAvailable, cloudStorage]);

  // Auto-sync setup - Initial sync only
  useEffect(() => {
    if (!isSignedIn || !user?.id) return;

    // Initial sync when user signs in
    performFullSync().catch(error => {
      logger.error('Initial sync failed:', error);
    });

    // Note: Periodic sync is handled by cloudSyncManager, not here
  }, [isSignedIn, user?.id, performFullSync]);

  // Online status monitoring
  useEffect(() => {
    const handleOnline = () => updateSyncState({ isOnline: true });
    const handleOffline = () => updateSyncState({ isOnline: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [updateSyncState]);

  // Check cloud availability on mount
  useEffect(() => {
    if (isSignedIn && user?.id) {
      checkCloudAvailability();
    }
  }, [isSignedIn, user?.id, checkCloudAvailability]);

  return {
    syncState,
    performFullSync,
    uploadAllData,
    deleteAllCloudData,
    hasCloudData,
    checkCloudAvailability,
    syncInProgress
  };
}
