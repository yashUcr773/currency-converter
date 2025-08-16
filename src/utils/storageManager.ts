// Centralized Storage Manager
// Provides a unified interface for all local storage operations with versioning and error handling

import type { ExchangeRates } from '../types';
import type { ItineraryItem } from '@/types/itinerary';
import type { TabType } from './tabStorage';
import { logger } from './env';

// Storage version for future migrations
const STORAGE_VERSION = '1.0.0';

// Standardized storage keys with consistent naming
export const STORAGE_KEYS = {
  // Core app data
  MAIN: 'ratevault-data',
  
  // User preferences (consolidated)
  PREFERENCES: 'ratevault-preferences',
  
  // Feature-specific data
  ITINERARY: 'ratevault-itinerary-items',
  TIMEZONE_CACHE: 'ratevault-timezone-cache',
  
  // Search and history data (consolidated)
  SEARCH_DATA: 'ratevault-search-data',
  
  // Metadata
  METADATA: 'ratevault-metadata'
} as const;

// Type definitions for storage schemas
export interface MainStorageData {
  exchangeRates: ExchangeRates | null;
  pinnedCurrencies: string[];
  pinnedUnitsByCategory?: Record<string, string[]>;
}

export interface UserPreferences {
  activeTab: TabType;
  numberSystem: 'western' | 'eastern';
  preferredTimezone?: string;
  preferredLanguage?: string;
}

export interface RecentCountry {
  name: string;
  flag: string;
  lastUsed: number;
  timezoneCount: number;
}

export interface SearchHistoryItem {
  term: string;
  lastUsed: number;
  resultCount: number;
}

export interface SearchData {
  recentCountries: RecentCountry[];
  searchHistory: SearchHistoryItem[];
}

export interface SerializedItineraryItem {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime?: string;
  location?: string;
  color: string;
  category?: string;
  isAllDay?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimezoneCache {
  [key: string]: {
    data: unknown;
    timestamp: number;
    expiresAt?: number;
  };
}

export interface StorageMetadata {
  version: string;
  lastMigration?: string;
  createdAt: number;
  lastUpdated: number;
}

class StorageManager {
  private initialized = false;

  constructor() {
    this.initializeMetadata();
  }

  private initializeMetadata(): void {
    if (this.initialized) return;
    
    try {
      const metadata = this.getMetadata();
      if (!metadata) {
        this.setMetadata({
          version: STORAGE_VERSION,
          createdAt: Date.now(),
          lastUpdated: Date.now()
        });
      }
      this.initialized = true;
    } catch (error) {
      logger.error('Failed to initialize storage metadata:', error);
    }
  }

  private updateMetadata(): void {
    try {
      const metadata = this.getMetadata();
      if (metadata) {
        this.setMetadata({
          ...metadata,
          lastUpdated: Date.now()
        });
      }
    } catch (error) {
      logger.error('Failed to update storage metadata:', error);
    }
  }

  // Generic storage methods
  private getItem<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  }

  private setItem<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.updateMetadata();
    } catch (error) {
      logger.error(`Error saving to localStorage (${key}):`, error);
    }
  }

  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
      this.updateMetadata();
    } catch (error) {
      logger.error(`Error removing from localStorage (${key}):`, error);
    }
  }

  // Metadata management
  getMetadata(): StorageMetadata | null {
    return this.getItem<StorageMetadata>(STORAGE_KEYS.METADATA);
  }

  private setMetadata(metadata: StorageMetadata): void {
    this.setItem(STORAGE_KEYS.METADATA, metadata);
  }

  // Main data management
  getMainData(): MainStorageData | null {
    return this.getItem<MainStorageData>(STORAGE_KEYS.MAIN);
  }

  setMainData(data: MainStorageData): void {
    this.setItem(STORAGE_KEYS.MAIN, data);
  }

  updateMainData(updates: Partial<MainStorageData>): void {
    const existing = this.getMainData() || {
      exchangeRates: null,
      pinnedCurrencies: [],
      pinnedUnitsByCategory: {}
    };
    this.setMainData({ ...existing, ...updates });
  }

  // User preferences management
  getPreferences(): UserPreferences | null {
    return this.getItem<UserPreferences>(STORAGE_KEYS.PREFERENCES);
  }

  setPreferences(preferences: UserPreferences): void {
    this.setItem(STORAGE_KEYS.PREFERENCES, preferences);
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const existing = this.getPreferences() || {
      activeTab: 'currency' as TabType,
      numberSystem: 'western' as const
    };
    this.setPreferences({ ...existing, ...updates });
  }

  // Itinerary management with proper Date serialization
  getItineraryItems(): ItineraryItem[] {
    try {
      const stored = this.getItem<SerializedItineraryItem[]>(STORAGE_KEYS.ITINERARY);
      if (!stored) return [];
      
      // Deserialize dates
      return stored.map((item: SerializedItineraryItem) => ({
        ...item,
        startDate: new Date(item.startDate),
        endDate: item.endDate ? new Date(item.endDate) : undefined,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        color: item.color as ItineraryItem['color'],
        category: item.category as ItineraryItem['category']
      }));
    } catch (error) {
      logger.error('Error loading itinerary items:', error);
      return [];
    }
  }

  setItineraryItems(items: ItineraryItem[]): void {
    try {
      // Serialize dates to ISO strings
      const serialized = items.map(item => ({
        ...item,
        startDate: item.startDate.toISOString(),
        endDate: item.endDate?.toISOString(),
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString()
      }));
      
      this.setItem(STORAGE_KEYS.ITINERARY, serialized);
    } catch (error) {
      logger.error('Error saving itinerary items:', error);
    }
  }

  // Timezone cache management
  getTimezoneCache(): TimezoneCache | null {
    return this.getItem<TimezoneCache>(STORAGE_KEYS.TIMEZONE_CACHE);
  }

  setTimezoneCache(cache: TimezoneCache): void {
    this.setItem(STORAGE_KEYS.TIMEZONE_CACHE, cache);
  }

  getTimezoneData(key: string): unknown | null {
    const cache = this.getTimezoneCache() || {};
    const entry = cache[key];
    
    if (!entry) return null;
    
    // Check expiration
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.removeTimezoneData(key);
      return null;
    }
    
    return entry.data;
  }

  setTimezoneData(key: string, data: unknown, expiresIn?: number): void {
    const cache = this.getTimezoneCache() || {};
    cache[key] = {
      data,
      timestamp: Date.now(),
      expiresAt: expiresIn ? Date.now() + expiresIn : undefined
    };
    this.setTimezoneCache(cache);
  }

  removeTimezoneData(key: string): void {
    const cache = this.getTimezoneCache() || {};
    delete cache[key];
    this.setTimezoneCache(cache);
  }

  clearTimezoneCache(): void {
    this.removeItem(STORAGE_KEYS.TIMEZONE_CACHE);
  }

  // Search data management
  getSearchData(): SearchData | null {
    return this.getItem<SearchData>(STORAGE_KEYS.SEARCH_DATA);
  }

  setSearchData(data: SearchData): void {
    this.setItem(STORAGE_KEYS.SEARCH_DATA, data);
  }

  updateSearchData(updates: Partial<SearchData>): void {
    const existing = this.getSearchData() || {
      recentCountries: [],
      searchHistory: []
    };
    this.setSearchData({ ...existing, ...updates });
  }

  // Utility methods
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      this.removeItem(key);
    });
    
    this.cleanupLegacyKeys();
  }

  // Aggressive cleanup of any legacy keys
  cleanupLegacyKeys(): void {
    const legacyPatterns = [
      'trip-tools-',
      'number-system-',
      'timezone-',
      'ratevault-timezone-recent-countries',
      'ratevault-timezone-search-history'
    ];

    const allKeys = Object.keys(localStorage);
    let removedCount = 0;

    allKeys.forEach(key => {
      const shouldRemove = legacyPatterns.some(pattern => {
        if (pattern.endsWith('-')) {
          return key.startsWith(pattern);
        }
        return key === pattern;
      });

      // Don't remove current storage keys
      const isCurrentKey = (Object.values(STORAGE_KEYS) as string[]).includes(key);
      
      if (shouldRemove && !isCurrentKey) {
        localStorage.removeItem(key);
        removedCount++;
      }
    });

    if (removedCount > 0) {
      logger.log(`Cleaned up ${removedCount} legacy keys during aggressive cleanup`);
    }
  }

  // Migration helper - runs on every page load to ensure cleanup
  migrateFromLegacyStorage(): void {
    try {
      let migrationNeeded = false;
      const currentVersion = STORAGE_VERSION;

      // Check if migration has been completed for this version
      const metadata = this.getMetadata();
      const lastMigrationVersion = metadata?.version;

      // List of all legacy keys that should be removed
      const legacyKeys = [
        'trip-tools-active-tab',
        'number-system-preference',
        'ratevault-timezone-recent-countries',
        'ratevault-timezone-search-history'
      ];

      // Migrate legacy tab storage
      const legacyTab = localStorage.getItem('trip-tools-active-tab');
      if (legacyTab) {
        this.updatePreferences({ activeTab: legacyTab as TabType });
        migrationNeeded = true;
        logger.log('Migrated legacy tab storage:', legacyTab);
      }

      // Migrate legacy number system preference
      const legacyNumberSystem = localStorage.getItem('number-system-preference');
      if (legacyNumberSystem) {
        this.updatePreferences({ 
          numberSystem: legacyNumberSystem === 'indian' ? 'eastern' : 'western' 
        });
        migrationNeeded = true;
        logger.log('Migrated legacy number system:', legacyNumberSystem);
      }

      // Migrate legacy country storage
      const legacyCountries = localStorage.getItem('ratevault-timezone-recent-countries');
      const legacySearchHistory = localStorage.getItem('ratevault-timezone-search-history');
      
      if (legacyCountries || legacySearchHistory) {
        try {
          const searchData: SearchData = {
            recentCountries: legacyCountries ? JSON.parse(legacyCountries) : [],
            searchHistory: legacySearchHistory ? JSON.parse(legacySearchHistory) : []
          };
          this.setSearchData(searchData);
          migrationNeeded = true;
          logger.log('Migrated legacy search data');
        } catch (error) {
          logger.warn('Failed to migrate search data:', error);
        }
      }

      // Migrate legacy timezone cache (dynamic keys starting with 'timezone-')
      const allKeys = Object.keys(localStorage);
      const timezoneKeys = allKeys.filter(key => key.startsWith('timezone-') && !key.includes('recent') && !key.includes('search'));
      
      if (timezoneKeys.length > 0) {
        const cache: TimezoneCache = this.getTimezoneCache() || {};
        let cacheUpdated = false;
        
        timezoneKeys.forEach(key => {
          try {
            const data = localStorage.getItem(key);
            if (data && !cache[key]) {
              cache[key] = {
                data: JSON.parse(data),
                timestamp: Date.now()
              };
              cacheUpdated = true;
            }
          } catch (error) {
            logger.warn(`Failed to migrate timezone cache key: ${key}`, error);
          }
        });
        
        if (cacheUpdated) {
          this.setTimezoneCache(cache);
          migrationNeeded = true;
          logger.log(`Migrated ${timezoneKeys.length} timezone cache entries`);
        }
      }

      // Always clean up legacy keys on every page load
      let keysRemoved = 0;
      
      // Remove known legacy keys
      legacyKeys.forEach(key => {
        if (localStorage.getItem(key) !== null) {
          localStorage.removeItem(key);
          keysRemoved++;
        }
      });

      // Remove timezone-* keys
      timezoneKeys.forEach(key => {
        localStorage.removeItem(key);
        keysRemoved++;
      });

      if (keysRemoved > 0) {
        logger.log(`Cleaned up ${keysRemoved} legacy storage keys`);
      }

      // Update metadata
      if (migrationNeeded || !metadata || lastMigrationVersion !== currentVersion) {
        this.setMetadata({
          version: currentVersion,
          lastMigration: new Date().toISOString(),
          createdAt: metadata?.createdAt || Date.now(),
          lastUpdated: Date.now()
        });
        logger.log(`Storage migration completed for version ${currentVersion}`);
      }

    } catch (error) {
      logger.error('Failed to migrate legacy storage:', error);
    }
  }

  // Debug helper
  getStorageInfo(): Record<string, unknown> {
    return {
      metadata: this.getMetadata(),
      mainData: this.getMainData(),
      preferences: this.getPreferences(),
      itineraryCount: this.getItineraryItems().length,
      timezoneCacheKeys: Object.keys(this.getTimezoneCache() || {}).length,
      searchData: this.getSearchData()
    };
  }
}

// Export singleton instance
export const storageManager = new StorageManager();

// Export for backward compatibility and easy access
export const storage = {
  // Legacy compatibility methods
  getData: () => storageManager.getMainData(),
  getExchangeRates: () => storageManager.getMainData()?.exchangeRates || null,
  saveExchangeRates: (rates: ExchangeRates) => storageManager.updateMainData({ exchangeRates: rates }),
  savePinnedCurrencies: (currencies: string[]) => storageManager.updateMainData({ pinnedCurrencies: currencies }),
  getPinnedUnitsForCategory: (categoryId: string) => storageManager.getMainData()?.pinnedUnitsByCategory?.[categoryId] || [],
  savePinnedUnitsForCategory: (categoryId: string, unitIds: string[]) => {
    const existing = storageManager.getMainData() || { exchangeRates: null, pinnedCurrencies: [] };
    storageManager.updateMainData({
      pinnedUnitsByCategory: {
        ...existing.pinnedUnitsByCategory,
        [categoryId]: unitIds
      }
    });
  },
  areRatesExpired: (timestamp: number): boolean => {
    const now = Date.now();
    const hoursOld = (now - timestamp) / (1000 * 60 * 60);
    return hoursOld > 24; // Default to 24 hours, should import from constants
  },
  clearData: () => storageManager.clearAllData()
};
