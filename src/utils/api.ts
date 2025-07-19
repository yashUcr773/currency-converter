import type { ExchangeRates } from '../types';
import { API_BASE_URL } from '../constants';

export const api = {
  // Fetch exchange rates from API with PWA support
  async fetchExchangeRates(baseCurrency = 'USD'): Promise<ExchangeRates | null> {
    try {
      console.log(`[API] Fetching exchange rates for ${baseCurrency} from ${API_BASE_URL}/${baseCurrency}`);
      
      const response = await fetch(`${API_BASE_URL}/${baseCurrency}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log(`[API] Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[API] Successfully fetched exchange rates:', data.base, Object.keys(data.rates).length, 'currencies');
      
      // Check if this is cached data from service worker
      const isCachedData = data.sw_cached_at && data.sw_cached_at > 0;
      
      return {
        base: data.base,
        rates: data.rates,
        timestamp: isCachedData ? data.sw_cached_at : Date.now(),
        lastUpdated: data.date || new Date().toISOString(),
        cached: isCachedData
      };
    } catch (error) {
      console.error('[API] Error fetching exchange rates:', error);
      
      // Log additional debugging information
      console.log('[API] Network status:', navigator.onLine ? 'ONLINE' : 'OFFLINE');
      console.log('[API] Error details:', {
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        message: error instanceof Error ? error.message : String(error)
      });
      
      // Return null instead of throwing, let the caller handle the error
      return null;
    }
  },

  // Check if user is online with enhanced detection
  async isOnline(): Promise<boolean> {
    // Quick check with navigator
    if (!navigator.onLine) {
      return false;
    }

    // Try to fetch a small resource to verify actual connectivity
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch('/favicon.svg?t=' + Date.now(), {
        method: 'HEAD',
        cache: 'no-cache',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
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
