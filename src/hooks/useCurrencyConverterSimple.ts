// Simplified Currency Converter Hook
// Replaces the overly complex useCurrencyConverter.ts

import { useState, useEffect, useCallback } from 'react';
import type { Currency, PinnedCurrency, ExchangeRates } from '../types';
import { POPULAR_CURRENCIES, DEFAULT_PINNED_CURRENCIES } from '../constants';
import { storage } from '../utils/storageSimple';
import { api } from '../utils/api';

interface CurrencyState {
  pinnedCurrencies: PinnedCurrency[];
  exchangeRates: ExchangeRates | null;
  lastSync: number;
  baseCurrency: string;
}

export const useCurrencyConverterSimple = () => {
  const [state, setState] = useState<CurrencyState>({
    pinnedCurrencies: [],
    exchangeRates: null,
    lastSync: 0,
    baseCurrency: 'USD'
  });

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Initialize app state
  useEffect(() => {
    const initializeApp = async () => {
      // Run legacy migration once
      storage.migrateFromLegacyStorage();
      
      // Load stored data
      const storedData = storage.getMainData();
      const pinnedCodes = storedData.pinnedCurrencies.length > 0 
        ? storedData.pinnedCurrencies 
        : DEFAULT_PINNED_CURRENCIES;

      // Create pinned currencies
      const pinnedCurrencies: PinnedCurrency[] = pinnedCodes.map(code => {
        const currency = POPULAR_CURRENCIES.find(c => c.code === code);
        return {
          currency: currency || { code, name: code, symbol: code },
          amount: code === 'USD' ? 100 : 0
        };
      });

      let exchangeRates = storedData.exchangeRates;

      // Always refresh rates if online
      if (navigator.onLine && (!exchangeRates || storage.areRatesExpired(exchangeRates.timestamp))) {
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
        lastSync: exchangeRates?.timestamp || 0,
        baseCurrency: 'USD'
      });

      setLoading(false);
    };

    initializeApp();
  }, []);

  // Update currency amount
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

  // Add currency
  const pinCurrency = useCallback((currency: Currency) => {
    setState(prev => {
      const isAlreadyPinned = prev.pinnedCurrencies.some(p => p.currency.code === currency.code);
      if (isAlreadyPinned) return prev;

      const newPinned: PinnedCurrency = { currency, amount: 0 };
      const updatedPinned = [...prev.pinnedCurrencies, newPinned];
      
      // Save to storage
      const codes = updatedPinned.map(p => p.currency.code);
      storage.savePinnedCurrencies(codes);

      return { ...prev, pinnedCurrencies: updatedPinned };
    });
  }, []);

  // Remove currency
  const unpinCurrency = useCallback((currencyCode: string) => {
    setState(prev => {
      const updatedPinned = prev.pinnedCurrencies.filter(p => p.currency.code !== currencyCode);
      
      // Save to storage
      const codes = updatedPinned.map(p => p.currency.code);
      storage.savePinnedCurrencies(codes);

      return { ...prev, pinnedCurrencies: updatedPinned };
    });
  }, []);

  // Simple refresh
  const refreshRates = useCallback(async () => {
    setSyncing(true);
    
    const freshRates = await api.fetchExchangeRates();
    
    if (freshRates) {
      storage.saveExchangeRates(freshRates);
      setState(prev => ({
        ...prev,
        exchangeRates: freshRates,
        lastSync: freshRates.timestamp
      }));
    }
    
    setSyncing(false);
  }, []);

  // Get available currencies
  const getAvailableCurrencies = useCallback(() => {
    const pinnedCodes = state.pinnedCurrencies.map(p => p.currency.code);
    return POPULAR_CURRENCIES.filter(currency => !pinnedCodes.includes(currency.code));
  }, [state.pinnedCurrencies]);

  // Check if rates are expired
  const areRatesExpired = useCallback(() => {
    return state.exchangeRates ? storage.areRatesExpired(state.exchangeRates.timestamp) : true;
  }, [state.exchangeRates]);

  // Get conversion rate
  const getConversionRate = useCallback((currencyCode: string) => {
    if (!state.exchangeRates || currencyCode === state.baseCurrency) {
      return null;
    }

    const { rates, base } = state.exchangeRates;
    
    if (base === 'USD') {
      if (state.baseCurrency === 'USD') {
        return rates[currencyCode] || null;
      } else {
        const baseRate = rates[state.baseCurrency];
        const targetRate = rates[currencyCode];
        if (baseRate && targetRate) {
          return targetRate / baseRate;
        }
      }
    }
    
    return null;
  }, [state.exchangeRates, state.baseCurrency]);

  // Set base currency
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
