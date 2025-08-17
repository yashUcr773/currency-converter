// Simplified Storage System
// Replaces both storage.ts and storageManager.ts with a single, clean interface

import type { ExchangeRates } from '../types';
import type { TabType } from './tabStorage';

// Simple storage keys
const STORAGE_KEYS = {
  MAIN_DATA: 'ratevault-data',
  PREFERENCES: 'ratevault-preferences'
} as const;

// Main data structure
interface AppData {
  exchangeRates: ExchangeRates | null;
  pinnedCurrencies: string[];
  pinnedUnitsByCategory: Record<string, string[]>;
}

// User preferences
interface UserPreferences {
  activeTab: TabType;
  numberSystem: 'western' | 'eastern';
  language?: string;
}

class SimpleStorage {
  // Generic storage helpers
  private static getItem<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  }

  private static setItem<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  }

  // Main data management
  static getMainData(): AppData {
    return this.getItem<AppData>(STORAGE_KEYS.MAIN_DATA) || {
      exchangeRates: null,
      pinnedCurrencies: ['USD', 'EUR', 'GBP', 'JPY'],
      pinnedUnitsByCategory: {}
    };
  }

  static updateMainData(updates: Partial<AppData>): void {
    const existing = this.getMainData();
    this.setItem(STORAGE_KEYS.MAIN_DATA, { ...existing, ...updates });
  }

  // Exchange rates
  static getExchangeRates(): ExchangeRates | null {
    return this.getMainData().exchangeRates;
  }

  static saveExchangeRates(rates: ExchangeRates): void {
    this.updateMainData({ exchangeRates: rates });
  }

  static areRatesExpired(timestamp: number): boolean {
    const hoursOld = (Date.now() - timestamp) / (1000 * 60 * 60);
    return hoursOld > 24; // 24 hours expiry
  }

  // Pinned currencies
  static getPinnedCurrencies(): string[] {
    return this.getMainData().pinnedCurrencies;
  }

  static savePinnedCurrencies(codes: string[]): void {
    this.updateMainData({ pinnedCurrencies: codes });
  }

  // Pinned units
  static getPinnedUnits(categoryId: string): string[] {
    return this.getMainData().pinnedUnitsByCategory[categoryId] || [];
  }

  static savePinnedUnits(categoryId: string, unitIds: string[]): void {
    const existing = this.getMainData();
    this.updateMainData({
      pinnedUnitsByCategory: {
        ...existing.pinnedUnitsByCategory,
        [categoryId]: unitIds
      }
    });
  }

  // User preferences
  static getPreferences(): UserPreferences {
    return this.getItem<UserPreferences>(STORAGE_KEYS.PREFERENCES) || {
      activeTab: 'currency',
      numberSystem: 'western'
    };
  }

  static updatePreferences(updates: Partial<UserPreferences>): void {
    const existing = this.getPreferences();
    this.setItem(STORAGE_KEYS.PREFERENCES, { ...existing, ...updates });
  }

  // Migration from old storage (run once)
  static migrateFromLegacyStorage(): void {
    const hasNewFormat = localStorage.getItem(STORAGE_KEYS.MAIN_DATA);
    if (hasNewFormat) return; // Already migrated

    console.log('Migrating from legacy storage format...');

    // Migrate main data
    const legacyKeys = [
      'currency-converter-data',
      'exchangeRates',
      'pinnedCurrencies',
      'pinnedUnitsByCategory'
    ];

    const migratedData: Partial<AppData> = {};

    legacyKeys.forEach(key => {
      const data = this.getItem<Record<string, unknown>>(key);
      if (data) {
        if (key.includes('exchangeRates') || key.includes('currency-converter-data')) {
          if (data.exchangeRates) migratedData.exchangeRates = data.exchangeRates as ExchangeRates;
          if (data.pinnedCurrencies) migratedData.pinnedCurrencies = data.pinnedCurrencies as string[];
          if (data.pinnedUnitsByCategory) migratedData.pinnedUnitsByCategory = data.pinnedUnitsByCategory as Record<string, string[]>;
        }
        localStorage.removeItem(key); // Clean up
      }
    });

    if (Object.keys(migratedData).length > 0) {
      this.updateMainData(migratedData);
      console.log('Legacy data migration completed');
    }

    // Migrate preferences
    const legacyTab = this.getItem<TabType>('activeTab');
    const legacyNumberSystem = this.getItem<'western' | 'eastern'>('numberSystem');
    
    if (legacyTab || legacyNumberSystem) {
      const preferenceUpdates: Partial<UserPreferences> = {};
      if (legacyTab) preferenceUpdates.activeTab = legacyTab;
      if (legacyNumberSystem) preferenceUpdates.numberSystem = legacyNumberSystem;
      
      this.updatePreferences(preferenceUpdates);
      
      if (legacyTab) localStorage.removeItem('activeTab');
      if (legacyNumberSystem) localStorage.removeItem('numberSystem');
    }
  }

  // Clear all data
  static clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export { SimpleStorage as storage };
