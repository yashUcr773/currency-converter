import { useCurrencyConverter } from './hooks/useCurrencyConverter';
import { CurrencyInput } from './components/CurrencyInput';
import { CurrencySelector } from './components/CurrencySelector';
import { StatusBar } from './components/StatusBar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { PWAStatus, OfflineNotice } from './components/PWAStatus';
import { usePWA } from './hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import './App.css';

function App() {
  const [pwaStatus] = usePWA();
  const {
    pinnedCurrencies,
    exchangeRates,
    lastSync,
    loading,
    syncing,
    baseCurrency,
    updateCurrencyAmount,
    pinCurrency,
    unpinCurrency,
    refreshRates,
    getAvailableCurrencies,
    areRatesExpired,
    getConversionRate,
    setBaseCurrency
  } = useCurrencyConverter();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <LoadingSpinner size={48} className="mb-4 mx-auto" />
            <h2 className="text-xl font-semibold mb-2">Loading Currency Converter</h2>
            <p className="text-muted-foreground">Fetching latest exchange rates</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!exchangeRates) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-destructive mb-4">
              <AlertTriangle className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Exchange Rates Available</h2>
            <p className="text-muted-foreground mb-4">
              Unable to load exchange rates. Please check your internet connection and try again.
            </p>
            {pwaStatus.isOnline && (
              <Button
                onClick={refreshRates}
                disabled={syncing}
              >
                {syncing ? 'Retrying...' : 'Retry'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Currency Converter
              </h1>
            </div>
            <p className="text-slate-600 text-lg font-medium">
              Real-time currency conversion with beautiful formatting • Pin your favorites
            </p>
          </div>
        </div>
        
        {/* Status Bar */}
        <StatusBar
          isOnline={pwaStatus.isOnline}
          lastSync={lastSync}
          areRatesExpired={areRatesExpired()}
          syncing={syncing}
          onRefresh={refreshRates}
        />
        
        {/* PWA Status */}
        <div className="px-6 py-3 bg-white/60 backdrop-blur-sm border-t border-slate-200">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <PWAStatus />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Offline Notice */}
        <OfflineNotice />
        
        {/* Base Currency Indicator */}
        {exchangeRates && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-lg">
              <span className="text-slate-600 font-medium">Conversion rates shown relative to:</span>
              <span className="font-bold text-lg text-blue-600">{baseCurrency}</span>
              <span className="text-slate-400 text-sm">• Click any rate to change base currency</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* Pinned Currencies */}
          {pinnedCurrencies.map((pinnedCurrency) => (
            <CurrencyInput
              key={pinnedCurrency.currency.code}
              pinnedCurrency={pinnedCurrency}
              onAmountChange={(amount: number) => updateCurrencyAmount(pinnedCurrency.currency.code, amount)}
              onUnpin={() => unpinCurrency(pinnedCurrency.currency.code)}
              disabled={!exchangeRates}
              conversionRate={getConversionRate(pinnedCurrency.currency.code)}
              baseCurrency={baseCurrency}
              onSetBaseCurrency={() => setBaseCurrency(pinnedCurrency.currency.code)}
            />
          ))}

          {/* Currency Selector */}
          <CurrencySelector
            availableCurrencies={getAvailableCurrencies()}
            onSelectCurrency={pinCurrency}
          />
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-slate-600 text-sm font-medium">
              Live rates from ExchangeRate-API
            </span>
          </div>
          <p className="mt-4 text-slate-500 text-sm">
            Rates cached locally • Auto-updates when online • 5-decimal precision
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
