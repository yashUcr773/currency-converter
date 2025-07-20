import { useCurrencyConverter } from './hooks/useCurrencyConverter';
import { CurrencyInput } from './components/CurrencyInput';
import { CurrencySelector } from './components/CurrencySelector';
import { StatusBar } from './components/StatusBar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { PWAStatus, OfflineNotice } from './components/PWAStatus';
import { SEO, StructuredData } from './components/SEO';
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-sm mx-auto">
          <CardContent className="p-6 sm:p-8 text-center">
            <LoadingSpinner size={40} className="sm:w-12 sm:h-12 mb-3 sm:mb-4 mx-auto" />
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Loading Currency Converter</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Fetching latest exchange rates</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!exchangeRates) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-sm mx-auto">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="text-destructive mb-3 sm:mb-4">
              <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">No Exchange Rates Available</h2>
            <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
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
      {/* SEO and structured data */}
      <SEO />
      <StructuredData />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3 lg:mb-4">
              <div className="p-1.5 sm:p-2 lg:p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg sm:rounded-xl shadow-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Currency Converter
              </h1>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm lg:text-base xl:text-lg font-medium px-2 sm:px-4">
              Real-time currency conversion • Pin your favorites
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
        <div className="px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 bg-white/60 backdrop-blur-sm border-t border-slate-200">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <PWAStatus pinnedCurrencies={pinnedCurrencies} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-12">
        {/* Offline Notice */}
        <OfflineNotice />
        
        {/* Base Currency Indicator */}
        {exchangeRates && (
          <div className="mb-4 sm:mb-6 lg:mb-8 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 lg:gap-3 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-200 shadow-lg max-w-full">
              <span className="text-slate-600 font-medium text-xs sm:text-sm lg:text-base">Rates relative to:</span>
              <span className="font-bold text-sm sm:text-base lg:text-lg text-blue-600">{baseCurrency}</span>
              <span className="text-slate-400 text-xs hidden sm:block">• Tap rate to change base</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
          {/* Pinned Currencies */}
          {pinnedCurrencies.map((pinnedCurrency) => (
            <div key={pinnedCurrency.currency.code} className="min-h-[140px] sm:min-h-[160px]">
              <CurrencyInput
                pinnedCurrency={pinnedCurrency}
                onAmountChange={(amount: number) => updateCurrencyAmount(pinnedCurrency.currency.code, amount)}
                onUnpin={() => unpinCurrency(pinnedCurrency.currency.code)}
                disabled={!exchangeRates}
                conversionRate={getConversionRate(pinnedCurrency.currency.code)}
                baseCurrency={baseCurrency}
                onSetBaseCurrency={() => setBaseCurrency(pinnedCurrency.currency.code)}
              />
            </div>
          ))}

          {/* Currency Selector */}
          <div className="min-h-[140px] sm:min-h-[160px]">
            <CurrencySelector
              availableCurrencies={getAvailableCurrencies()}
              onSelectCurrency={pinCurrency}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 sm:mt-12 lg:mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 lg:gap-3 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-lg">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-slate-600 text-xs sm:text-sm font-medium">
                Live rates from ExchangeRate-API
              </span>
            </div>
          </div>
          <p className="mt-2 sm:mt-4 text-slate-500 text-xs px-4">
            Cached locally • Auto-updates • 5-decimal precision
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
