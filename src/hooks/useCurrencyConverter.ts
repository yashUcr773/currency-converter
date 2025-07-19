import { useState, useEffect, useCallback } from 'react';
import type { Currency, PinnedCurrency, AppState } from '../types';
import { POPULAR_CURRENCIES, DEFAULT_PINNED_CURRENCIES } from '../constants';
import { storage } from '../utils/storage';
import { api } from '../utils/api';

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

      // Try to fetch fresh rates if online and rates are expired or missing
      const isOnline = await api.isOnline();
      console.log('[Init] Online status:', isOnline, 'Rates expired:', exchangeRates ? storage.areRatesExpired(exchangeRates.timestamp) : 'No rates');
      
      if (isOnline && (!exchangeRates || storage.areRatesExpired(exchangeRates.timestamp))) {
        console.log('[Init] Fetching fresh rates...');
        setSyncing(true);
        const freshRates = await api.fetchExchangeRates();
        if (freshRates) {
          console.log('[Init] Successfully loaded fresh rates');
          exchangeRates = freshRates;
          storage.saveExchangeRates(freshRates);
        } else {
          console.log('[Init] Failed to fetch fresh rates, using cached data');
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

  // Manually refresh exchange rates
  const refreshRates = useCallback(async () => {
    console.log('[Refresh] Starting manual refresh...');
    setSyncing(true);
    
    const freshRates = await api.fetchExchangeRates();
    
    if (freshRates) {
      console.log('[Refresh] Successfully fetched fresh rates');
      storage.saveExchangeRates(freshRates);
      setState(prev => ({
        ...prev,
        exchangeRates: freshRates,
        lastSync: freshRates.timestamp
      }));
      setSyncing(false);
      return true;
    } else {
      console.log('[Refresh] API returned null, trying cached data...');
      // Try to load cached data as fallback
      const cachedRates = storage.getExchangeRates();
      if (cachedRates && cachedRates.rates) {
        console.log('[Refresh] Using cached data as fallback');
        setState(prev => ({
          ...prev,
          exchangeRates: cachedRates,
          lastSync: cachedRates.timestamp
        }));
        setSyncing(false);
        return true;
      } else {
        console.log('[Refresh] No cached data available');
      }
    }
    
    setSyncing(false);
    return false;
  }, []);

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
