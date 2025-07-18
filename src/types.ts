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
}

export interface PinnedCurrency {
  currency: Currency;
  amount: number;
}

export interface AppState {
  pinnedCurrencies: PinnedCurrency[];
  exchangeRates: ExchangeRates | null;
  isOnline: boolean;
  lastSync: number;
}

export interface StorageData {
  exchangeRates: ExchangeRates;
  pinnedCurrencies: string[];
}
