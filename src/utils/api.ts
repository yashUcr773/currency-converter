import type { ExchangeRates } from '../types';
import { API_BASE_URL } from '../constants';

export const api = {
  // Fetch exchange rates from API
  async fetchExchangeRates(baseCurrency = 'USD'): Promise<ExchangeRates | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/${baseCurrency}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        base: data.base,
        rates: data.rates,
        timestamp: Date.now(),
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      return null;
    }
  },

  // Check if user is online
  isOnline(): boolean {
    return navigator.onLine;
  },

  // Convert amount between currencies
  convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    rates: Record<string, number>
  ): number {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    // Use official rates
    let result = amount;
    
    // Convert from source currency to USD first (if not already USD)
    if (fromCurrency !== 'USD') {
      result = result / rates[fromCurrency];
    }
    
    // Convert from USD to target currency (if not USD)
    if (toCurrency !== 'USD') {
      result = result * rates[toCurrency];
    }
    
    return Math.round(result * 100000) / 100000; // Round to 5 decimal places
  }
};
