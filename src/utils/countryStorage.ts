// Country selection persistence for timezone search
const TIMEZONE_COUNTRY_STORAGE_KEY = 'timezone-converter-recent-countries';
const TIMEZONE_SEARCH_STORAGE_KEY = 'timezone-converter-search-history';
const MAX_RECENT_COUNTRIES = 10;
const MAX_SEARCH_HISTORY = 20;

export interface RecentCountry {
  name: string;
  flag: string;
  lastUsed: number;
  timezoneCount: number;
}

export interface SearchHistoryItem {
  term: string;
  lastUsed: number;
  resultCount: number;
}

export const saveRecentCountry = (country: string, flag: string, timezoneCount: number): void => {
  try {
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

    localStorage.setItem(TIMEZONE_COUNTRY_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save recent country:', error);
  }
};

export const getRecentCountries = (): RecentCountry[] => {
  try {
    const stored = localStorage.getItem(TIMEZONE_COUNTRY_STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored) as RecentCountry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to load recent countries:', error);
    return [];
  }
};

export const clearRecentCountries = (): void => {
  try {
    localStorage.removeItem(TIMEZONE_COUNTRY_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear recent countries:', error);  
  }
};

// Search history functions
export const saveSearchTerm = (term: string, resultCount: number): void => {
  if (term.length < 2) return; // Don't save very short searches
  
  try {
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

    localStorage.setItem(TIMEZONE_SEARCH_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save search term:', error);
  }
};

export const getSearchHistory = (): SearchHistoryItem[] => {
  try {
    const stored = localStorage.getItem(TIMEZONE_SEARCH_STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored) as SearchHistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to load search history:', error);
    return [];
  }
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
