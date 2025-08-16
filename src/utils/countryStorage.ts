// Country selection persistence for timezone search
import { storageManager } from './storageManager';
import type { RecentCountry, SearchHistoryItem } from './storageManager';

const MAX_RECENT_COUNTRIES = 10;
const MAX_SEARCH_HISTORY = 20;

export type { RecentCountry, SearchHistoryItem };

export const saveRecentCountry = (country: string, flag: string, timezoneCount: number): void => {
  const existing = getRecentCountries();
  const existingIndex = existing.findIndex(c => c.name.toLowerCase() === country.toLowerCase());
  
  const countryData: RecentCountry = {
    name: country,
    flag,
    lastUsed: Date.now(),
    timezoneCount
  };

  let updated: RecentCountry[];
  if (existingIndex >= 0) {
    // Update existing entry
    updated = [...existing];
    updated[existingIndex] = countryData;
  } else {
    // Add new entry
    updated = [countryData, ...existing];
  }

  // Sort by last used and limit to MAX_RECENT_COUNTRIES
  updated.sort((a, b) => b.lastUsed - a.lastUsed);
  updated = updated.slice(0, MAX_RECENT_COUNTRIES);

  storageManager.updateSearchData({ recentCountries: updated });
};

export const getRecentCountries = (): RecentCountry[] => {
  const searchData = storageManager.getSearchData();
  return searchData?.recentCountries || [];
};

export const clearRecentCountries = (): void => {
  storageManager.updateSearchData({ recentCountries: [] });
};

// Search history functions
export const saveSearchTerm = (term: string, resultCount: number): void => {
  if (term.length < 2) return; // Don't save very short searches
  
  const existing = getSearchHistory();
  const existingIndex = existing.findIndex(s => s.term.toLowerCase() === term.toLowerCase());
  
  const searchData: SearchHistoryItem = {
    term,
    lastUsed: Date.now(),
    resultCount
  };

  let updated: SearchHistoryItem[];
  if (existingIndex >= 0) {
    updated = [...existing];
    updated[existingIndex] = searchData;
  } else {
    updated = [searchData, ...existing];
  }

  updated.sort((a, b) => b.lastUsed - a.lastUsed);
  updated = updated.slice(0, MAX_SEARCH_HISTORY);

  storageManager.updateSearchData({ searchHistory: updated });
};

export const getSearchHistory = (): SearchHistoryItem[] => {
  const searchData = storageManager.getSearchData();
  return searchData?.searchHistory || [];
};

// Get unique countries from timezone list for suggestions
export const getCountrySuggestions = (timezones: { country: string }[]): string[] => {
  const countries = new Set<string>();
  timezones.forEach(tz => {
    if (tz.country) {
      countries.add(tz.country);
    }
  });
  return Array.from(countries).sort();
};
