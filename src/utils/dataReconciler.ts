// Enhanced data reconciliation logic for cloud sync
// Provides intelligent merging to prevent data loss when both local and cloud data exist

import type { MainStorageData, UserPreferences, SearchData, TimezoneCache, SerializedItineraryItem } from './storageManager';
import type { ItineraryItem } from '@/types/itinerary';
import { logger } from './env';

// Metadata for conflict resolution
export interface DataMetadata {
  lastModified: number;
  deviceId: string;
  version: string;
  checksum?: string;
}

// Conflict resolution strategies
export type ConflictStrategy = 
  | 'local-wins'      // Local data takes precedence
  | 'cloud-wins'      // Cloud data takes precedence  
  | 'latest-wins'     // Most recently modified wins
  | 'merge-smart'     // Intelligent merge based on data type
  | 'merge-union'     // Union of both datasets (for arrays)
  | 'merge-by-id'     // Merge by unique ID (for arrays with ID fields)
  | 'user-choice';    // Prompt user to choose (future enhancement)

// Conflict information
export interface DataConflict<T = unknown> {
  dataType: string;
  localData: T;
  cloudData: T;
  localMetadata: DataMetadata;
  cloudMetadata: DataMetadata;
  strategy: ConflictStrategy;
}

// Result of reconciliation
export interface ReconciliationResult<T = unknown> {
  mergedData: T;
  hasConflicts: boolean;
  conflicts: DataConflict[];
  metadata: DataMetadata;
}

class DataReconciler {
  
  // Generate checksum for data integrity checks
  private generateChecksum(data: unknown): string {
    try {
      const obj = data as Record<string, unknown>;
      const str = JSON.stringify(obj, Object.keys(obj || {}).sort());
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash).toString(36);
    } catch {
      return JSON.stringify(data).length.toString();
    }
  }

  // Create metadata for data
  createMetadata(deviceId: string, version: string = '1.0.0'): DataMetadata {
    return {
      lastModified: Date.now(),
      deviceId,
      version,
      checksum: ''
    };
  }

  // Check if data has been modified (by comparing checksums)
  hasDataChanged(data: unknown, metadata: DataMetadata): boolean {
    const currentChecksum = this.generateChecksum(data);
    return currentChecksum !== metadata.checksum;
  }

  // Reconcile main storage data
  reconcileMainData(
    localData: MainStorageData | null,
    cloudData: MainStorageData | null,
    localMeta: DataMetadata,
    cloudMeta: DataMetadata,
    strategy: ConflictStrategy = 'merge-smart'
  ): ReconciliationResult<MainStorageData> {
    
    // Handle null cases
    if (!localData && !cloudData) {
      return {
        mergedData: {} as MainStorageData,
        hasConflicts: false,
        conflicts: [],
        metadata: this.createMetadata(localMeta.deviceId)
      };
    }
    
    if (!localData) {
      return {
        mergedData: cloudData!,
        hasConflicts: false,
        conflicts: [],
        metadata: cloudMeta
      };
    }
    
    if (!cloudData) {
      return {
        mergedData: localData,
        hasConflicts: false,
        conflicts: [],
        metadata: localMeta
      };
    }

    const conflicts: DataConflict[] = [];
    const mergedData: MainStorageData = { ...localData };

    // Compare each field and apply strategy
    const fields = new Set([...Object.keys(localData), ...Object.keys(cloudData)]);
    
    fields.forEach(field => {
      const localValue = localData[field as keyof MainStorageData];
      const cloudValue = cloudData[field as keyof MainStorageData];
      
      if (JSON.stringify(localValue) !== JSON.stringify(cloudValue)) {
        // Conflict detected
        const conflict: DataConflict = {
          dataType: `main.${field}`,
          localData: localValue,
          cloudData: cloudValue,
          localMetadata: localMeta,
          cloudMetadata: cloudMeta,
          strategy
        };
        
        conflicts.push(conflict);
        
        // Apply resolution strategy
        switch (strategy) {
          case 'cloud-wins':
            (mergedData as unknown as Record<string, unknown>)[field] = cloudValue;
            break;
          case 'latest-wins':
            if (cloudMeta.lastModified > localMeta.lastModified) {
              (mergedData as unknown as Record<string, unknown>)[field] = cloudValue;
            }
            break;
          case 'merge-smart':
            // For main data, prefer non-null/non-empty values
            if (cloudValue !== null && cloudValue !== undefined && 
                (typeof cloudValue !== 'string' || cloudValue !== '')) {
              (mergedData as unknown as Record<string, unknown>)[field] = cloudValue;
            }
            break;
          // 'local-wins' - keep local value (no change needed)
        }
      }
    });

    const resultMetadata: DataMetadata = {
      lastModified: Math.max(localMeta.lastModified, cloudMeta.lastModified),
      deviceId: localMeta.deviceId,
      version: localMeta.version,
      checksum: this.generateChecksum(mergedData)
    };

    return {
      mergedData,
      hasConflicts: conflicts.length > 0,
      conflicts,
      metadata: resultMetadata
    };
  }

  // Reconcile user preferences
  reconcilePreferences(
    localData: UserPreferences | null,
    cloudData: UserPreferences | null,
    localMeta: DataMetadata,
    cloudMeta: DataMetadata,
    strategy: ConflictStrategy = 'latest-wins'
  ): ReconciliationResult<UserPreferences> {
    
    if (!localData && !cloudData) {
      return {
        mergedData: {} as UserPreferences,
        hasConflicts: false,
        conflicts: [],
        metadata: this.createMetadata(localMeta.deviceId)
      };
    }
    
    if (!localData) {
      return {
        mergedData: cloudData!,
        hasConflicts: false,
        conflicts: [],
        metadata: cloudMeta
      };
    }
    
    if (!cloudData) {
      return {
        mergedData: localData,
        hasConflicts: false,
        conflicts: [],
        metadata: localMeta
      };
    }

    // For preferences, latest timestamp wins by default
    const useCloud = strategy === 'cloud-wins' || 
                     (strategy === 'latest-wins' && cloudMeta.lastModified > localMeta.lastModified);

    const mergedData = useCloud ? cloudData : localData;
    const hasConflicts = JSON.stringify(localData) !== JSON.stringify(cloudData);
    
    const conflicts = hasConflicts ? [{
      dataType: 'preferences',
      localData,
      cloudData,
      localMetadata: localMeta,
      cloudMetadata: cloudMeta,
      strategy
    }] : [];

    return {
      mergedData,
      hasConflicts,
      conflicts,
      metadata: useCloud ? cloudMeta : localMeta
    };
  }

  // Reconcile itinerary items (complex merge with ID-based deduplication)
  reconcileItinerary(
    localItems: ItineraryItem[],
    cloudItems: SerializedItineraryItem[],
    localMeta: DataMetadata,
    cloudMeta: DataMetadata,
    strategy: ConflictStrategy = 'merge-union'
  ): ReconciliationResult<ItineraryItem[]> {
    
    // Convert cloud items to ItineraryItem format
    const cloudItemsConverted: ItineraryItem[] = cloudItems.map(item => ({
      ...item,
      startDate: new Date(item.startDate),
      endDate: item.endDate ? new Date(item.endDate) : undefined,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      color: item.color as ItineraryItem['color'],
      category: item.category as ItineraryItem['category']
    }));

    const conflicts: DataConflict[] = [];
    const mergedItems: ItineraryItem[] = [];
    const processedIds = new Set<string>();

    // Process local items first
    localItems.forEach(localItem => {
      const cloudItem = cloudItemsConverted.find(c => c.id === localItem.id);
      
      if (!cloudItem) {
        // Local-only item
        mergedItems.push(localItem);
        processedIds.add(localItem.id);
      } else {
        // Conflict: same ID exists in both
        const localUpdated = localItem.updatedAt.getTime();
        const cloudUpdated = cloudItem.updatedAt.getTime();
        
        if (localUpdated !== cloudUpdated) {
          conflicts.push({
            dataType: `itinerary.${localItem.id}`,
            localData: localItem,
            cloudData: cloudItem,
            localMetadata: localMeta,
            cloudMetadata: cloudMeta,
            strategy
          });
        }

        // Merge strategy for conflicts
        let finalItem: ItineraryItem;
        switch (strategy) {
          case 'cloud-wins':
            finalItem = cloudItem;
            break;
          case 'latest-wins':
            finalItem = cloudUpdated > localUpdated ? cloudItem : localItem;
            break;
          case 'merge-by-id':
            // For merge-by-id, use the item with the latest updatedAt timestamp
            finalItem = cloudUpdated > localUpdated ? cloudItem : localItem;
            break;
          case 'merge-smart':
            // Intelligent merge: use latest updatedAt, but preserve local modifications if newer
            finalItem = cloudUpdated > localUpdated ? {
              ...cloudItem,
              // Preserve any local modifications that might be more recent
              updatedAt: new Date(Math.max(localUpdated, cloudUpdated))
            } : localItem;
            break;
          default: // local-wins or merge-union
            finalItem = localItem;
        }
        
        mergedItems.push(finalItem);
        processedIds.add(localItem.id);
      }
    });

    // Add cloud-only items
    cloudItemsConverted.forEach(cloudItem => {
      if (!processedIds.has(cloudItem.id)) {
        mergedItems.push(cloudItem);
      }
    });

    // Sort by creation date for consistent ordering
    mergedItems.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    const resultMetadata: DataMetadata = {
      lastModified: Math.max(localMeta.lastModified, cloudMeta.lastModified),
      deviceId: localMeta.deviceId,
      version: localMeta.version,
      checksum: this.generateChecksum(mergedItems)
    };

    return {
      mergedData: mergedItems,
      hasConflicts: conflicts.length > 0,
      conflicts,
      metadata: resultMetadata
    };
  }

  // Reconcile search data (merge arrays intelligently)
  reconcileSearchData(
    localData: SearchData | null,
    cloudData: SearchData | null,
    localMeta: DataMetadata,
    cloudMeta: DataMetadata,
    strategy: ConflictStrategy = 'merge-union'
  ): ReconciliationResult<SearchData> {
    
    const defaultSearchData: SearchData = {
      recentCountries: [],
      searchHistory: []
    };

    if (!localData && !cloudData) {
      return {
        mergedData: defaultSearchData,
        hasConflicts: false,
        conflicts: [],
        metadata: this.createMetadata(localMeta.deviceId)
      };
    }
    
    if (!localData) {
      return {
        mergedData: cloudData!,
        hasConflicts: false,
        conflicts: [],
        metadata: cloudMeta
      };
    }
    
    if (!cloudData) {
      return {
        mergedData: localData,
        hasConflicts: false,
        conflicts: [],
        metadata: localMeta
      };
    }

    const conflicts: DataConflict[] = [];
    
    // Merge recent countries (keep unique, maintain order)
    const allCountries = [...(localData.recentCountries || []), ...(cloudData.recentCountries || [])];
    const uniqueCountries = Array.from(new Set(allCountries));
    
    // Merge search history (keep unique, maintain order) 
    const allHistory = [...(localData.searchHistory || []), ...(cloudData.searchHistory || [])];
    const uniqueHistory = Array.from(new Set(allHistory));

    // Limit arrays to reasonable sizes
    const maxCountries = 20;
    const maxHistory = 50;
    
    const mergedData: SearchData = {
      recentCountries: uniqueCountries.slice(0, maxCountries),
      searchHistory: uniqueHistory.slice(0, maxHistory)
    };

    // Check for conflicts (different ordering or content)
    const hasConflicts = JSON.stringify(localData) !== JSON.stringify(cloudData);
    
    if (hasConflicts) {
      conflicts.push({
        dataType: 'searchData',
        localData,
        cloudData,
        localMetadata: localMeta,
        cloudMetadata: cloudMeta,
        strategy
      });
    }

    const resultMetadata: DataMetadata = {
      lastModified: Math.max(localMeta.lastModified, cloudMeta.lastModified),
      deviceId: localMeta.deviceId,
      version: localMeta.version,
      checksum: this.generateChecksum(mergedData)
    };

    return {
      mergedData,
      hasConflicts,
      conflicts,
      metadata: resultMetadata
    };
  }

  // Reconcile timezone cache (merge objects)
  reconcileTimezoneCache(
    localData: TimezoneCache | null,
    cloudData: TimezoneCache | null,
    localMeta: DataMetadata,
    cloudMeta: DataMetadata,
    strategy: ConflictStrategy = 'merge-union'
  ): ReconciliationResult<TimezoneCache> {
    
    if (!localData && !cloudData) {
      return {
        mergedData: {},
        hasConflicts: false,
        conflicts: [],
        metadata: this.createMetadata(localMeta.deviceId)
      };
    }
    
    if (!localData) {
      return {
        mergedData: cloudData!,
        hasConflicts: false,
        conflicts: [],
        metadata: cloudMeta
      };
    }
    
    if (!cloudData) {
      return {
        mergedData: localData,
        hasConflicts: false,
        conflicts: [],
        metadata: localMeta
      };
    }

    // Merge cache objects (union of keys, cloud data takes precedence for conflicts)
    const mergedData: TimezoneCache = { ...localData, ...cloudData };
    
    const conflicts: DataConflict[] = [];
    
    // Check for key conflicts
    Object.keys(localData).forEach(key => {
      if (cloudData[key] && JSON.stringify(localData[key]) !== JSON.stringify(cloudData[key])) {
        conflicts.push({
          dataType: `timezoneCache.${key}`,
          localData: localData[key],
          cloudData: cloudData[key],
          localMetadata: localMeta,
          cloudMetadata: cloudMeta,
          strategy
        });
      }
    });

    const resultMetadata: DataMetadata = {
      lastModified: Math.max(localMeta.lastModified, cloudMeta.lastModified),
      deviceId: localMeta.deviceId,
      version: localMeta.version,
      checksum: this.generateChecksum(mergedData)
    };

    return {
      mergedData,
      hasConflicts: conflicts.length > 0,
      conflicts,
      metadata: resultMetadata
    };
  }

  // Log reconciliation results
  logReconciliation(result: ReconciliationResult, dataType: string): void {
    if (result.hasConflicts) {
      logger.warn(`Data conflicts resolved for ${dataType}:`, {
        conflictCount: result.conflicts.length,
        conflicts: result.conflicts.map(c => ({
          type: c.dataType,
          strategy: c.strategy,
          localTime: new Date(c.localMetadata.lastModified).toISOString(),
          cloudTime: new Date(c.cloudMetadata.lastModified).toISOString()
        }))
      });
    } else {
      logger.log(`No conflicts in ${dataType} reconciliation`);
    }
  }
}

// Export singleton instance
export const dataReconciler = new DataReconciler();

// Client-side data merging for multi-device sync
export function mergeDeviceData<T>(
  devices: Array<{ deviceId: string; data: T; lastUpdated: number; version: string; }>,
  strategy: ConflictStrategy = 'latest-wins'
): T | null {
  if (!devices || devices.length === 0) {
    return null;
  }

  if (devices.length === 1) {
    return devices[0].data;
  }

  // Sort by lastUpdated (most recent first)
  const sortedDevices = devices.sort((a, b) => b.lastUpdated - a.lastUpdated);

  switch (strategy) {
    case 'latest-wins':
      return sortedDevices[0].data;

    case 'merge-by-id':
      // Handle array data specifically
      if (Array.isArray(sortedDevices[0].data)) {
        const allItems = sortedDevices.flatMap(d => Array.isArray(d.data) ? d.data : []);
        return mergeByUniqueId(allItems as Record<string, unknown>[]) as T;
      }
      return sortedDevices[0].data;

    case 'merge-smart':
    case 'merge-union':
      return mergeUnion(sortedDevices.map(d => d.data));

    default:
      return sortedDevices[0].data;
  }
}

// Merge arrays by unique ID, taking latest timestamp for conflicts
export function mergeByUniqueId<T extends Record<string, unknown>>(items: T[], idField: string = 'id', mergeStrategy: 'latest' | 'first' = 'latest'): T[] {
  const seen = new Map<string, T>();
  
  for (const item of items) {
    const id = item[idField] as string;
    if (!id) continue;
    
    const existing = seen.get(id);
    if (!existing) {
      seen.set(id, item);
    } else if (mergeStrategy === 'latest') {
      // Use latest timestamp or last seen
      const itemTime = (item.updatedAt || item.createdAt || item.timestamp || item.lastUsed) as string | number | undefined;
      const existingTime = (existing.updatedAt || existing.createdAt || existing.timestamp || existing.lastUsed) as string | number | undefined;
      
      let shouldReplace = false;
      if (!existingTime) {
        shouldReplace = true;
      } else if (itemTime) {
        if (typeof itemTime === 'string' && typeof existingTime === 'string') {
          shouldReplace = new Date(itemTime).getTime() > new Date(existingTime).getTime();
        } else if (typeof itemTime === 'number' && typeof existingTime === 'number') {
          shouldReplace = itemTime > existingTime;
        }
      }
      
      if (shouldReplace) {
        seen.set(id, item);
      }
    }
  }
  
  return Array.from(seen.values());
}

// Merge arrays and objects by union
function mergeUnion<T>(dataArray: T[]): T {
  if (!dataArray || dataArray.length === 0) {
    return null as T;
  }

  const firstData = dataArray[0];
  
  // Handle array merging
  if (Array.isArray(firstData)) {
    const combined = [];
    const seen = new Set<string>();
    
    for (const data of dataArray) {
      if (Array.isArray(data)) {
        for (const item of data) {
          const key = (item && typeof item === 'object' && 'id' in item) 
            ? item.id 
            : JSON.stringify(item);
          
          if (!seen.has(key)) {
            seen.add(key);
            combined.push(item);
          }
        }
      }
    }
    
    return combined as T;
  }

  // Handle object merging
  if (typeof firstData === 'object' && firstData !== null) {
    const merged = { ...firstData };
    
    for (const data of dataArray.slice(1)) {
      if (typeof data === 'object' && data !== null) {
        Object.assign(merged, data);
      }
    }
    
    return merged;
  }

  // For primitive types, return the first value
  return firstData;
}
