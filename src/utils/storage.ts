import type { ExchangeRates, StorageData } from '../types';
import { RATES_EXPIRY_HOURS } from '../constants';
import { storageManager } from './storageManager';

// Legacy compatibility layer - delegates to new storage manager
export const storage = {
  // Get all stored data
  getData(): StorageData | null {
    const mainData = storageManager.getMainData();
    if (!mainData) return null;
    
    return {
      exchangeRates: mainData.exchangeRates!,
      pinnedCurrencies: mainData.pinnedCurrencies,
      pinnedUnitsByCategory: mainData.pinnedUnitsByCategory
    };
  },

  // Get exchange rates only
  getExchangeRates(): ExchangeRates | null {
    return storageManager.getMainData()?.exchangeRates || null;
  },

  // Save exchange rates
  saveExchangeRates(rates: ExchangeRates): void {
    storageManager.updateMainData({ exchangeRates: rates });
  },

  // Save pinned currencies
  savePinnedCurrencies(currencyCodes: string[]): void {
    storageManager.updateMainData({ pinnedCurrencies: currencyCodes });
  },

  // Get pinned units for a category
  getPinnedUnitsForCategory(categoryId: string): string[] {
    return storageManager.getMainData()?.pinnedUnitsByCategory?.[categoryId] || [];
  },

  // Save pinned units for a category
  savePinnedUnitsForCategory(categoryId: string, unitIds: string[]): void {
    const existing = storageManager.getMainData() || { 
      exchangeRates: null, 
      pinnedCurrencies: [],
      pinnedUnitsByCategory: {} 
    };
    
    storageManager.updateMainData({
      pinnedUnitsByCategory: {
        ...existing.pinnedUnitsByCategory,
        [categoryId]: unitIds
      }
    });
  },

  // Check if rates are expired
  areRatesExpired(timestamp: number): boolean {
    const now = Date.now();
    const hoursOld = (now - timestamp) / (1000 * 60 * 60);
    return hoursOld > RATES_EXPIRY_HOURS;
  },

  // Clear all data
  clearData(): void {
    storageManager.clearAllData();
  }
};
