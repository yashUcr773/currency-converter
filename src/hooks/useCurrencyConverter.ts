import { useState, useEffect, useCallback } from 'react';
import type { Currency, PinnedCurrency, AppState } from '../types';
import { POPULAR_CURRENCIES, DEFAULT_PINNED_CURRENCIES } from '../constants';
import { storage } from '../utils/storage';
import { api } from '../utils/api';
import { logger } from '../utils/env';

export const useCurrencyConverter = () => {
  const [state, setState] = useState<AppState>({
    pinnedCurrencies: [],
    exchangeRates: null,
    lastSync: 0,
    baseCurrency: 'USD' // Default base currency
  });

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Initialize app state from localStorage
  useEffect(() => {
    const initializeApp = async () => {
      const storedData = storage.getData();
      
      // Initialize pinned currencies
      const pinnedCodes = storedData?.pinnedCurrencies || DEFAULT_PINNED_CURRENCIES;
      const pinnedCurrencies: PinnedCurrency[] = pinnedCodes.map(code => {
        const currency = POPULAR_CURRENCIES.find(c => c.code === code);
        return {
          currency: currency || { code, name: code, symbol: code },
          amount: code === 'USD' ? 100 : 0
        };
      });

      // Load exchange rates
      let exchangeRates = storedData?.exchangeRates || null;

      // Check online status and always refresh on page load if online
      const isOnline = await api.isOnline();
      const shouldAlwaysRefresh = isOnline; // Always refresh on page load when online
      
      logger.log('[Init] Online status:', isOnline, 'Rates expired:', exchangeRates ? storage.areRatesExpired(exchangeRates.timestamp) : 'No rates');
      
      if (shouldAlwaysRefresh) {
        logger.log('[Init] Online detected - fetching fresh rates on page load...');
        setSyncing(true);
        const freshRates = await api.fetchExchangeRates();
        if (freshRates) {
          logger.log('[Init] Successfully loaded fresh rates');
          exchangeRates = freshRates;
          storage.saveExchangeRates(freshRates);
        } else {
          logger.log('[Init] Failed to fetch fresh rates, using cached data');
        }
        setSyncing(false);
      }

      setState({
        pinnedCurrencies,
        exchangeRates,
        lastSync: exchangeRates?.timestamp || 0,
        baseCurrency: 'USD'
      });

      setLoading(false);
    };

    initializeApp();
  }, []);

  // Update currency amount and sync all other currencies
  const updateCurrencyAmount = useCallback((currencyCode: string, amount: number) => {
    setState(prev => {
      if (!prev.exchangeRates) return prev;

      const updatedPinned = prev.pinnedCurrencies.map(pinned => {
        if (pinned.currency.code === currencyCode) {
          return { ...pinned, amount };
        } else {
          // Convert from the updated currency to this currency
          const convertedAmount = api.convertCurrency(
            amount,
            currencyCode,
            pinned.currency.code,
            prev.exchangeRates!.rates
          );
          return { ...pinned, amount: convertedAmount };
        }
      });

      return { ...prev, pinnedCurrencies: updatedPinned };
    });
  }, []);

  // Add a currency to pinned list
  const pinCurrency = useCallback((currency: Currency) => {
    setState(prev => {
      const isAlreadyPinned = prev.pinnedCurrencies.some(p => p.currency.code === currency.code);
      if (isAlreadyPinned) return prev;

      const newPinned: PinnedCurrency = {
        currency,
        amount: 0
      };

      const updatedPinned = [...prev.pinnedCurrencies, newPinned];
      const codes = updatedPinned.map(p => p.currency.code);
      storage.savePinnedCurrencies(codes);

      return { ...prev, pinnedCurrencies: updatedPinned };
    });
  }, []);

  // Remove a currency from pinned list
  const unpinCurrency = useCallback((currencyCode: string) => {
    setState(prev => {
      const updatedPinned = prev.pinnedCurrencies.filter(p => p.currency.code !== currencyCode);
      const codes = updatedPinned.map(p => p.currency.code);
      storage.savePinnedCurrencies(codes);

      return { ...prev, pinnedCurrencies: updatedPinned };
    });
  }, []);

  // Direct refresh without modal
  const performDirectRefresh = useCallback(async (): Promise<boolean> => {
    setSyncing(true);
    
    const freshRates = await api.fetchExchangeRates();
    
    if (freshRates) {
      logger.log('[Refresh] Successfully fetched fresh rates');
      storage.saveExchangeRates(freshRates);
      setState(prev => ({
        ...prev,
        exchangeRates: freshRates,
        lastSync: freshRates.timestamp
      }));
      setSyncing(false);
      return true;
    } else {
      logger.log('[Refresh] API returned null, trying cached data...');
      // Try to load cached data as fallback
      const cachedRates = storage.getExchangeRates();
      if (cachedRates && cachedRates.rates) {
        logger.log('[Refresh] Using cached data as fallback');
        setState(prev => ({
          ...prev,
          exchangeRates: cachedRates,
          lastSync: cachedRates.timestamp
        }));
        setSyncing(false);
        return true;
      } else {
        logger.log('[Refresh] No cached data available');
      }
    }
    
    setSyncing(false);
    return false;
  }, []);

  // Manually refresh exchange rates with modal option
  const refreshRates = useCallback(async (showModal = false) => {
    logger.log('[Refresh] Starting manual refresh...', showModal ? 'with modal' : 'direct');
    
    if (showModal) {
      // Start the API call immediately in the background
      setSyncing(true);
      const refreshPromise = api.fetchExchangeRates();
      
      // Show refresh modal to educate users while API call is in progress
      return new Promise<boolean>((resolve) => {
        // Dispatch custom event to show refresh modal
        const event = new CustomEvent('showRefreshModal', {
          detail: {
            onHardRefresh: async () => {
              // Cancel the background refresh and perform hard refresh with cache clearing
              try {
                // Clear service workers
                if ('serviceWorker' in navigator) {
                  const registrations = await navigator.serviceWorker.getRegistrations();
                  await Promise.all(registrations.map(registration => registration.unregister()));
                }
                
                // Clear all caches
                if ('caches' in window) {
                  const cacheNames = await caches.keys();
                  await Promise.all(cacheNames.map(name => caches.delete(name)));
                }
                
                // Clear sessionStorage (keep localStorage for user preferences)
                sessionStorage.clear();
                
                // Force hard refresh
                window.location.reload();
                resolve(true);
              } catch (error) {
                console.error('Error during hard refresh:', error);
                window.location.reload();
                resolve(true);
              }
            },
            onStayHere: async () => {
              // Use the background API call that's already in progress
              try {
                const freshRates = await refreshPromise;
                
                if (freshRates) {
                  logger.log('[Refresh] Successfully fetched fresh rates from background call');
                  storage.saveExchangeRates(freshRates);
                  setState(prev => ({
                    ...prev,
                    exchangeRates: freshRates,
                    lastSync: freshRates.timestamp
                  }));
                  setSyncing(false);
                  resolve(true);
                } else {
                  // Fallback to cached data
                  logger.log('[Refresh] Background API call failed, trying cached data...');
                  const cachedRates = storage.getExchangeRates();
                  if (cachedRates && cachedRates.rates) {
                    logger.log('[Refresh] Using cached data as fallback');
                    setState(prev => ({
                      ...prev,
                      exchangeRates: cachedRates,
                      lastSync: cachedRates.timestamp
                    }));
                    setSyncing(false);
                    resolve(true);
                  } else {
                    logger.log('[Refresh] No cached data available');
                    setSyncing(false);
                    resolve(false);
                  }
                }
              } catch (error) {
                logger.error('[Refresh] Error with background API call:', error);
                setSyncing(false);
                resolve(false);
              }
            }
          }
        });
        window.dispatchEvent(event);
      });
    } else {
      return performDirectRefresh();
    }
  }, [performDirectRefresh]);

  // Get available currencies for pinning
  const getAvailableCurrencies = useCallback(() => {
    const pinnedCodes = state.pinnedCurrencies.map(p => p.currency.code);
    return POPULAR_CURRENCIES.filter(currency => !pinnedCodes.includes(currency.code));
  }, [state.pinnedCurrencies]);

  // Check if rates are expired
  const areRatesExpired = useCallback(() => {
    return state.exchangeRates ? storage.areRatesExpired(state.exchangeRates.timestamp) : true;
  }, [state.exchangeRates]);

  // Get conversion rate for a currency relative to the base currency
  const getConversionRate = useCallback((currencyCode: string) => {
    if (!state.exchangeRates || currencyCode === state.baseCurrency) {
      return null;
    }

    const { rates, base } = state.exchangeRates;
    
    // If base currency is USD (which is typically the case from the API)
    if (base === 'USD') {
      if (state.baseCurrency === 'USD') {
        // Simple case: USD to other currency
        return rates[currencyCode] || null;
      } else {
        // Complex case: Convert from base currency to target currency
        const baseRate = rates[state.baseCurrency];
        const targetRate = rates[currencyCode];
        if (baseRate && targetRate) {
          // Formula: (1 / baseRate) * targetRate
          // This gives us how many target units = 1 base unit
          return targetRate / baseRate;
        }
      }
    }
    
    return null;
  }, [state.exchangeRates, state.baseCurrency]);

  // Set the base currency for conversion rates
  const setBaseCurrency = useCallback((currencyCode: string) => {
    setState(prev => ({ ...prev, baseCurrency: currencyCode }));
  }, []);

  return {
    ...state,
    loading,
    syncing,
    updateCurrencyAmount,
    pinCurrency,
    unpinCurrency,
    refreshRates,
    getAvailableCurrencies,
    areRatesExpired,
    getConversionRate,
    setBaseCurrency
  };
};
