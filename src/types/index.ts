// Consolidated Type Definitions
// Centralizes all type definitions used across the app

// Currency types
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
  cached?: boolean;
}

export interface PinnedCurrency {
  currency: Currency;
  amount: number;
}

// Timezone types
export interface Timezone {
  id: string;
  value: string; // IANA timezone identifier
  label: string;
  country: string;
  flag: string;
  utcOffset: number; // UTC offset in minutes
}

export interface PinnedTimezone {
  timezone: Timezone;
  time: Date | null;
  isCustomTime?: boolean;
}

// Unit conversion types
export interface Unit {
  id: string;
  name: string;
  symbol: string;
  conversionFactor: number; // Factor to convert to base unit
  aliases?: string[];
}

export interface UnitCategory {
  id: string;
  name: string;
  icon: string;
  baseUnit: string; // ID of the base unit for this category
  units: Unit[];
}

export interface PinnedUnit {
  unit: Unit;
  value: number;
}

// Itinerary types
export interface ItineraryItem {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  startTime: string;
  endTime?: string;
  location?: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink' | 'yellow' | 'indigo';
  category?: 'flight' | 'hotel' | 'activity' | 'transport' | 'food' | 'meeting' | 'other';
  isAllDay?: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// App state types
export interface AppState {
  pinnedCurrencies: PinnedCurrency[];
  exchangeRates: ExchangeRates | null;
  lastSync: number;
  baseCurrency: string;
}

export interface TimezoneAppState {
  pinnedTimezones: PinnedTimezone[];
  baseTimezone: string | null;
}

export interface UnitAppState {
  pinnedUnitsByCategory: Record<string, PinnedUnit[]>;
}

// Storage types
export interface StorageData {
  exchangeRates: ExchangeRates;
  pinnedCurrencies: string[];
  pinnedUnitsByCategory?: Record<string, string[]>;
}

// UI types
export type TabType = 'currency' | 'timezone' | 'units' | 'calculators' | 'itinerary';

export type NumberSystem = 'international' | 'indian';

export type ThemeType = 'light' | 'dark' | 'system';

// API types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

// PWA types
export interface PWAStatus {
  isInstalled: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
  updateDismissed: boolean;
  canInstall: boolean;
}

// Search and history types
export interface RecentCountry {
  id: string;
  name: string;
  flag: string;
  lastUsed: number;
  timezoneCount: number;
}

export interface SearchHistoryItem {
  id: string;
  term: string;
  lastUsed: number;
  resultCount: number;
}

// User preferences
export interface UserPreferences {
  activeTab: TabType;
  numberSystem: 'western' | 'eastern';
  theme?: ThemeType;
  language?: string;
  timezone?: string;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: number;
}
