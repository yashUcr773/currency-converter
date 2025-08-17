// Simplified App Component
// Replaces the overly complex App.tsx with better separation of concerns

import { useState, useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { CurrencyInput } from './components/CurrencyInput';
import { CurrencySelector } from './components/CurrencySelector';
import { SimpleHeader } from './components/SimpleHeader';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SEO, StructuredData } from './components/SEO';
import { MiniCalculator } from './components/MiniCalculator';
import { NumberSystemToggle } from './components/NumberSystemToggle';
import { usePWA } from './hooks/usePWA';
import { useStorageInit } from './hooks/useStorageInit';
import { useCurrencyConverterSimple } from './hooks/useCurrencyConverterSimple';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { storage } from './utils/storageSimple';
import type { TabType, ExchangeRates, PinnedCurrency, NumberSystem, Currency } from './types/index';
import './App.css';

// Lazy load components
const TimezoneConverter = lazy(() => import('./components/TimezoneConverter').then(module => ({ default: module.TimezoneConverter })));
const UnitConverter = lazy(() => import('./components/UnitConverter').then(module => ({ default: module.UnitConverter })));
const DurationTimeCalculator = lazy(() => import('./components/DurationTimeCalculator'));
const ItineraryManager = lazy(() => import('./components/ItineraryManager').then(module => ({ default: module.ItineraryManager })));

function AppSimple() {
  const { t } = useTranslation();
  const [pwaStatus] = usePWA();
  const { migrationComplete, numberSystem, setNumberSystem } = useStorageInit();
  
  // Tab management
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    return storage.getPreferences().activeTab;
  });

  // Save active tab when it changes
  useEffect(() => {
    storage.updatePreferences({ activeTab });
  }, [activeTab]);

  // Currency converter hook
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
  } = useCurrencyConverterSimple();

  // Don't render until migration is complete
  if (!migrationComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  // Loading state for currency tab
  if (loading && activeTab === 'currency') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-sm mx-auto">
          <CardContent className="p-8 text-center">
            <LoadingSpinner size={40} className="mb-4 mx-auto" />
            <h2 className="text-xl font-semibold mb-2">{t('app.loading') as string}</h2>
            <p className="text-muted-foreground">{t('app.loadingSubtitle') as string}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state for currency tab
  if (!exchangeRates && activeTab === 'currency') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-sm mx-auto">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t('app.noRatesAvailable') as string}</h2>
            <p className="text-muted-foreground mb-4">
              {t('app.noRatesMessage') as string}
            </p>
            {pwaStatus.isOnline && (
              <Button onClick={() => refreshRates()} disabled={syncing}>
                {syncing ? t('app.retrying') as string : t('app.retry') as string}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO />
      <StructuredData />
      
      <SimpleHeader
        isOnline={pwaStatus.isOnline}
        lastSync={lastSync}
        areRatesExpired={areRatesExpired()}
        syncing={syncing}
        onRefresh={refreshRates}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'currency' ? (
          <CurrencyTab
            exchangeRates={exchangeRates}
            baseCurrency={baseCurrency}
            pinnedCurrencies={pinnedCurrencies}
            numberSystem={numberSystem}
            setNumberSystem={setNumberSystem}
            updateCurrencyAmount={updateCurrencyAmount}
            unpinCurrency={unpinCurrency}
            getConversionRate={getConversionRate}
            setBaseCurrency={setBaseCurrency}
            getAvailableCurrencies={getAvailableCurrencies}
            pinCurrency={pinCurrency}
          />
        ) : activeTab === 'timezone' ? (
          <Suspense fallback={<LoadingSpinner />}>
            <TimezoneConverter />
          </Suspense>
        ) : activeTab === 'units' ? (
          <Suspense fallback={<LoadingSpinner />}>
            <UnitConverter />
          </Suspense>
        ) : activeTab === 'calculators' ? (
          <Suspense fallback={<LoadingSpinner />}>
            <DurationTimeCalculator />
          </Suspense>
        ) : (
          <Suspense fallback={<LoadingSpinner />}>
            <ItineraryManager />
          </Suspense>
        )}
      </main>
    </div>
  );
}

// Currency Tab Component (extracted for clarity)
interface CurrencyTabProps {
  exchangeRates: ExchangeRates | null;
  baseCurrency: string;
  pinnedCurrencies: PinnedCurrency[];
  numberSystem: NumberSystem;
  setNumberSystem: (system: NumberSystem) => void;
  updateCurrencyAmount: (code: string, amount: number) => void;
  unpinCurrency: (code: string) => void;
  getConversionRate: (code: string) => number | null;
  setBaseCurrency: (code: string) => void;
  getAvailableCurrencies: () => Currency[];
  pinCurrency: (currency: Currency) => void;
}

const CurrencyTab = ({
  exchangeRates,
  baseCurrency,
  pinnedCurrencies,
  numberSystem,
  setNumberSystem,
  updateCurrencyAmount,
  unpinCurrency,
  getConversionRate,
  setBaseCurrency,
  getAvailableCurrencies,
  pinCurrency
}: CurrencyTabProps) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Currency Tools Header */}
      {exchangeRates && (
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-4 bg-card/80 backdrop-blur-sm rounded-xl border border-border shadow-lg">
            {/* Base Currency Info */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium text-sm">
                {t('app.ratesRelativeTo') as string}
              </span>
              <span className="font-bold text-lg text-primary">{baseCurrency}</span>
            </div>
            
            <div className="w-px h-6 bg-border"></div>
            
            {/* Tools */}
            <div className="flex items-center gap-2">
              <NumberSystemToggle 
                system={numberSystem}
                onToggle={setNumberSystem}
              />
              <div className="w-px h-6 bg-border"></div>
              <MiniCalculator 
                pinnedCurrencies={pinnedCurrencies}
                onResult={(value) => console.log('Calculator result:', value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Currency Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Pinned Currencies */}
        {pinnedCurrencies.map((pinnedCurrency) => (
          <div key={pinnedCurrency.currency.code} className="min-h-[160px]">
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
        <div className="min-h-[160px]">
          <CurrencySelector
            availableCurrencies={getAvailableCurrencies()}
            onSelectCurrency={pinCurrency}
          />
        </div>
      </div>
    </>
  );
};

export default AppSimple;
