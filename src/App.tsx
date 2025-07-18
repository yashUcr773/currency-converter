import { useCurrencyConverter } from './hooks/useCurrencyConverter';
import { CurrencyInput } from './components/CurrencyInput';
import { CurrencySelector } from './components/CurrencySelector';
import { StatusBar } from './components/StatusBar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import './App.css';

function App() {
  const {
    pinnedCurrencies,
    exchangeRates,
    isOnline,
    lastSync,
    loading,
    syncing,
    updateCurrencyAmount,
    pinCurrency,
    unpinCurrency,
    refreshRates,
    getAvailableCurrencies,
    areRatesExpired
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
            {isOnline && (
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Currency Converter</h1>
            <p className="text-muted-foreground mt-2">
              Convert currencies with real-time rates • Pin your favorites
            </p>
          </div>
        </div>
        
        {/* Status Bar */}
        <StatusBar
          isOnline={isOnline}
          lastSync={lastSync}
          areRatesExpired={areRatesExpired()}
          syncing={syncing}
          onRefresh={refreshRates}
        />
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Pinned Currencies */}
          {pinnedCurrencies.map((pinnedCurrency) => (
            <CurrencyInput
              key={pinnedCurrency.currency.code}
              pinnedCurrency={pinnedCurrency}
              onAmountChange={(amount: number) => updateCurrencyAmount(pinnedCurrency.currency.code, amount)}
              onUnpin={() => unpinCurrency(pinnedCurrency.currency.code)}
              disabled={!exchangeRates}
            />
          ))}

          {/* Currency Selector */}
          <CurrencySelector
            availableCurrencies={getAvailableCurrencies()}
            onSelectCurrency={pinCurrency}
          />
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-muted-foreground text-sm space-y-1">
          <p>Exchange rates provided by ExchangeRate-API</p>
          <p>
            Rates are cached locally and updated automatically when online
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
