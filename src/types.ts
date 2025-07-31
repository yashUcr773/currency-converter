export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
}

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
  lastUpdated: string;
  cached?: boolean; // Indicates if data came from service worker cache
}

export interface PinnedCurrency {
  currency: Currency;
  amount: number;
}

export interface AppState {
  pinnedCurrencies: PinnedCurrency[];
  exchangeRates: ExchangeRates | null;
  lastSync: number;
  baseCurrency: string; // Currency code for showing conversion rates
}

export interface StorageData {
  exchangeRates: ExchangeRates;
  pinnedCurrencies: string[];
  pinnedUnitsByCategory?: Record<string, string[]>; // Store pinned unit IDs per category
}

// Timezone types
export interface Timezone {
  id: string; // Unique identifier for React keys
  value: string; // IANA timezone identifier (e.g., 'America/New_York')
  label: string; // Display name (e.g., 'New York (UTC-5)')
  country: string; // Country name
  flag: string; // Country flag emoji
  utcOffset: number; // Current UTC offset in minutes
}

export interface PinnedTimezone {
  timezone: Timezone;
  time: Date | null; // Current time in this timezone
  isCustomTime?: boolean; // Whether this timezone has a custom set time
}

export interface TimezoneAppState {
  pinnedTimezones: PinnedTimezone[];
  baseTimezone: string; // Reference timezone for time input
}
