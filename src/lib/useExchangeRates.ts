"use client"
import { useEffect, useState } from "react";

const EXCHANGE_RATES_KEY = "exchangeRates";
const CUSTOM_RATES_KEY = "customRates";
const PINNED_CURRENCIES_KEY = "pinnedCurrencies";
const API_URL = "https://open.er-api.com/v6/latest/USD";

export type Rates = Record<string, number>;
export type ExchangeRates = {
  rates: Rates;
  timestamp: number;
};

function getLocalRates(): ExchangeRates | null {
  const data = localStorage?.getItem(EXCHANGE_RATES_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function setLocalRates(rates: ExchangeRates) {
  localStorage.setItem(EXCHANGE_RATES_KEY, JSON.stringify(rates));
}

function getCustomRates(): Rates {
  const data = localStorage.getItem(CUSTOM_RATES_KEY);
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function setCustomRates(rates: Rates) {
  localStorage.setItem(CUSTOM_RATES_KEY, JSON.stringify(rates));
}

function getPinnedCurrencies(): string[] {
  const data = localStorage.getItem(PINNED_CURRENCIES_KEY);
  if (!data) return ["USD", "EUR", "INR"];
  try {
    return JSON.parse(data);
  } catch {
    return ["USD", "EUR", "INR"];
  }
}

function setPinnedCurrencies(currencies: string[]) {
  localStorage.setItem(PINNED_CURRENCIES_KEY, JSON.stringify(currencies));
}

export function useExchangeRates() {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [customRates, setCustomRatesState] = useState<Rates>({});
  const [pinnedCurrencies, setPinnedCurrenciesState] = useState<string[]>(["USD", "EUR", "INR"]);
  const [isOffline, setIsOffline] = useState(typeof window !== "undefined" ? !navigator.onLine : false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  // Hydrate state from localStorage after mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    setExchangeRates(getLocalRates());
    setCustomRatesState(getCustomRates());
    setPinnedCurrenciesState(getPinnedCurrencies());
  }, []);

  useEffect(() => {
    function handleOnline() {
      setIsOffline(false);
    }
    function handleOffline() {
      setIsOffline(true);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    async function fetchRates() {
      if (!navigator.onLine) return;
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (data && data.rates) {
          const rates: ExchangeRates = {
            rates: data.rates,
            timestamp: Date.now(),
          };
          setExchangeRates(rates);
          setLocalRates(rates);
          setLastUpdated(rates.timestamp);
        }
      } catch {
        // fallback to localStorage
      }
    }
    // If no rates or rates older than 24h, fetch
    const now = Date.now();
    if (exchangeRates && exchangeRates.timestamp) {
      setLastUpdated(exchangeRates.timestamp);
    }
    if (!exchangeRates || now - (exchangeRates.timestamp || 0) > 24 * 60 * 60 * 1000) {
      fetchRates();
    }
  }, [exchangeRates]);

  // Sync custom rates and pinned currencies with localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    setCustomRates(customRates);
  }, [customRates]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setPinnedCurrencies(pinnedCurrencies);
  }, [pinnedCurrencies]);

  return {
    exchangeRates,
    customRates,
    setCustomRates: setCustomRatesState,
    pinnedCurrencies,
    setPinnedCurrencies: setPinnedCurrenciesState,
    isOffline,
    lastUpdated,
    refreshRates: async () => {
      if (!navigator.onLine) return;
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (data && data.rates) {
          const rates: ExchangeRates = {
            rates: data.rates,
            timestamp: Date.now(),
          };
          setExchangeRates(rates);
          setLocalRates(rates);
          setLastUpdated(rates.timestamp);
        }
      } catch {}
    },
    resetCustomRate: (currency: string) => {
      const newRates = { ...customRates };
      delete newRates[currency];
      setCustomRatesState(newRates);
    },
    setCustomRate: (currency: string, rate: number) => {
      setCustomRatesState({ ...customRates, [currency]: rate });
    },
  };
}
