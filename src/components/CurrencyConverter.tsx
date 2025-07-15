"use client"
import React, { useState } from "react";
import { useExchangeRates } from "@/lib/useExchangeRates";
import { Button } from "@/components/ui/button";

function round2(val: number) {
  return Math.round(val * 100) / 100;
}

export const CurrencyConverter: React.FC = () => {
  const {
    exchangeRates,
    customRates,
    setCustomRate,
    resetCustomRate,
    pinnedCurrencies,
    setPinnedCurrencies,
    isOffline,
    lastUpdated,
    refreshRates,
  } = useExchangeRates();

  const [amounts, setAmounts] = useState<Record<string, number>>(() => {
    const obj: Record<string, number> = {};
    pinnedCurrencies.forEach((c) => (obj[c] = 1));
    return obj;
  });

  const [search, setSearch] = useState("");

  if (!exchangeRates) {
    return <div className="p-4 text-center text-gray-500 animate-pulse">Loading rates...</div>;
  }

  const getRate = (currency: string) => {
    return customRates[currency] ?? exchangeRates.rates[currency] ?? 1;
  };

  const handleAmountChange = (currency: string, value: number) => {
    const base = value / getRate(currency);
    const newAmounts: Record<string, number> = {};
    pinnedCurrencies.forEach((c) => {
      newAmounts[c] = round2(base * getRate(c));
    });
    setAmounts(newAmounts);
  };

  const handlePinToggle = (currency: string) => {
    if (pinnedCurrencies.includes(currency)) {
      setPinnedCurrencies(pinnedCurrencies.filter((c) => c !== currency));
    } else {
      setPinnedCurrencies([...pinnedCurrencies, currency]);
    }
  };

  // Filter currencies by search
  const allCurrencies = Object.keys(exchangeRates.rates);
  const filteredCurrencies = search.trim()
    ? allCurrencies.filter((c) => c.toLowerCase().includes(search.trim().toLowerCase()))
    : allCurrencies;

  return (
    <div className="max-w-xl mx-auto p-8 bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-3xl shadow-2xl border border-blue-200">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-xs text-gray-500 flex items-center gap-2">
          {isOffline ? (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Offline mode</span>
          ) : (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">Online</span>
          )}
          <span className="ml-2">Last updated: <span className="font-mono">{lastUpdated ? new Date(lastUpdated).toLocaleString() : "-"}</span></span>
        </span>
        <Button variant="outline" onClick={refreshRates} disabled={isOffline} className="transition-colors duration-150 hover:bg-blue-100">
          Refresh Rates
        </Button>
      </div>
      <div className="space-y-4">
        {pinnedCurrencies.map((currency) => (
          <div key={currency} className="flex items-center gap-3 bg-white/90 rounded-xl shadow px-4 py-3 border border-gray-200 hover:border-blue-400 transition-all">
            <input
              type="number"
              className="border-2 border-blue-200 focus:border-blue-500 rounded-lg px-3 py-2 w-32 text-lg font-semibold text-blue-900 bg-blue-50 focus:bg-white outline-none transition-all"
              value={amounts[currency]}
              onChange={(e) => handleAmountChange(currency, parseFloat(e.target.value) || 0)}
            />
            <span className="font-bold w-14 text-blue-700 text-lg tracking-wide drop-shadow">{currency}</span>
            <Button variant="ghost" onClick={() => handlePinToggle(currency)} className="text-xs px-2 py-1 text-gray-500 hover:text-red-500">
              Unpin
            </Button>
            <input
              type="number"
              className={`border-2 rounded-lg px-2 py-1 w-20 text-sm font-mono bg-yellow-50 focus:bg-white outline-none transition-all ${customRates[currency] ? "border-yellow-500 text-yellow-700" : "border-gray-200 text-gray-700"}`}
              value={getRate(currency)}
              onChange={(e) => setCustomRate(currency, parseFloat(e.target.value) || 1)}
              title="Custom rate override"
            />
            {customRates[currency] && (
              <Button variant="destructive" onClick={() => resetCustomRate(currency)} className="text-xs px-2 py-1 ml-1">
                Reset
              </Button>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8">
        <label className="block mb-3 font-semibold text-blue-700 text-lg">Search & Pin/Unpin currencies:</label>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search currencies..."
          className="w-full mb-4 px-4 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 bg-white text-blue-900 text-base shadow-sm outline-none transition-all"
        />
        <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
          {filteredCurrencies.length === 0 ? (
            <span className="text-gray-400 px-2 py-1">No currencies found.</span>
          ) : (
            filteredCurrencies.map((currency) => (
              <Button
                key={currency}
                variant={pinnedCurrencies.includes(currency) ? "default" : "outline"}
                onClick={() => handlePinToggle(currency)}
                className={`text-xs px-3 py-1 rounded-full shadow-sm transition-all duration-150 ${pinnedCurrencies.includes(currency) ? "bg-blue-600 text-white" : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"}`}
              >
                {currency}
              </Button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
