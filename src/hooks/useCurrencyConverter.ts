import { useState, useEffect, useCallback } from 'react';
import type { Currency, PinnedCurrency, AppState } from '../types';
import { POPULAR_CURRENCIES, DEFAULT_PINNED_CURRENCIES } from '../constants';
import { storage } from '../utils/storage';
import { api } from '../utils/api';

export const useCurrencyConverter = () => {
  const [state, setState] = useState<AppState>({
    pinnedCurrencies: [],
    exchangeRates: null,
    isOnline: navigator.onLine,
    lastSync: 0
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
      if (api.isOnline() && (!exchangeRates || storage.areRatesExpired(exchangeRates.timestamp))) {
        setSyncing(true);
        const freshRates = await api.fetchExchangeRates();
        if (freshRates) {
          exchangeRates = freshRates;
          storage.saveExchangeRates(freshRates);
        }
        setSyncing(false);
      }

      setState({
        pinnedCurrencies,
        exchangeRates,
        isOnline: api.isOnline(),
        lastSync: exchangeRates?.timestamp || 0
      });

      setLoading(false);
    };

    initializeApp();
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
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
    if (!api.isOnline()) return false;

    setSyncing(true);
    const freshRates = await api.fetchExchangeRates();
    
    if (freshRates) {
      storage.saveExchangeRates(freshRates);
      setState(prev => ({
        ...prev,
        exchangeRates: freshRates,
        lastSync: freshRates.timestamp
      }));
      setSyncing(false);
      return true;
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

  return {
    ...state,
    loading,
    syncing,
    updateCurrencyAmount,
    pinCurrency,
    unpinCurrency,
    refreshRates,
    getAvailableCurrencies,
    areRatesExpired
  };
};
