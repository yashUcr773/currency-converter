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
}
