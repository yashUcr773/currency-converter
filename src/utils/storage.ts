import type { ExchangeRates, StorageData } from '../types';
import { STORAGE_KEY, RATES_EXPIRY_HOURS } from '../constants';

export const storage = {
  // Get all stored data
  getData(): StorageData | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  // Save exchange rates
  saveExchangeRates(rates: ExchangeRates): void {
    try {
      const existingData = this.getData() || {
        exchangeRates: rates,
        pinnedCurrencies: []
      };
      
      const updatedData = {
        ...existingData,
        exchangeRates: rates
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving exchange rates:', error);
    }
  },

  // Save pinned currencies
  savePinnedCurrencies(currencyCodes: string[]): void {
    try {
      const existingData = this.getData() || {
        exchangeRates: null,
        pinnedCurrencies: currencyCodes
      };
      
      const updatedData = {
        ...existingData,
        pinnedCurrencies: currencyCodes
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving pinned currencies:', error);
    }
  },

  // Check if rates are expired
  areRatesExpired(timestamp: number): boolean {
    const now = Date.now();
    const hoursOld = (now - timestamp) / (1000 * 60 * 60);
    return hoursOld > RATES_EXPIRY_HOURS;
  },

  // Clear all data
  clearData(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};
