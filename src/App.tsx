import { useState, useEffect, lazy, Suspense } from 'react';
import { useCurrencyConverter } from './hooks/useCurrencyConverter';
import { useTranslation } from 'react-i18next';
import { CurrencyInput } from './components/CurrencyInput';
import { CurrencySelector } from './components/CurrencySelector';
import { CombinedHeader } from './components/CombinedHeader';
import { LoadingSpinner } from './components/LoadingSpinner';
import { RefreshWarningModal } from './components/RefreshWarningModal';
import { DonateButton } from './components/DonateButton';
import { SEO, StructuredData } from './components/SEO';
import { MiniCalculator } from './components/MiniCalculator';
import { NumberSystemToggle } from './components/NumberSystemToggle';
import { usePWA } from './hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { saveActiveTab, getActiveTab, type TabType } from './utils/tabStorage';
import { storageManager } from './utils/storageManager';
import type { NumberSystem } from './utils/numberSystem';
import './App.css';

// Import debug utilities in development
if (process.env.NODE_ENV === 'development') {
  import('../dev-tools/storageDebug');
}

// Lazy load non-critical components
const AboutButton = lazy(() => import('./components/AboutPage').then(module => ({ default: module.AboutButton })));
const PrivacyButton = lazy(() => import('./components/PrivacyButton').then(module => ({ default: module.PrivacyButton })));
const TimezoneConverter = lazy(() => import('./components/TimezoneConverter').then(module => ({ default: module.TimezoneConverter })));
const UnitConverter = lazy(() => import('./components/UnitConverter').then(module => ({ default: module.UnitConverter })));
const DurationTimeCalculator = lazy(() => import('./components/DurationTimeCalculator'));
const ItineraryManager = lazy(() => import('./components/ItineraryManager').then(module => ({ default: module.ItineraryManager })));

function App() {
  const { t } = useTranslation();
  const [pwaStatus] = usePWA();
  const [activeTab, setActiveTab] = useState<TabType>(() => getActiveTab());
  const [numberSystem, setNumberSystemState] = useState<NumberSystem>('international');
  const [migrationComplete, setMigrationComplete] = useState(false);

  // Initialize storage and migrate legacy data
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        // Always run migration on page load to ensure cleanup
        storageManager.migrateFromLegacyStorage();
        
        // Also run aggressive cleanup to remove any remaining legacy keys
        storageManager.cleanupLegacyKeys();
        
        setMigrationComplete(true);
        
        // Log current storage state in development
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Storage migration completed');
          console.log('📊 Current storage state:', storageManager.getStorageInfo());
        }
      } catch (error) {
        console.error('Failed to initialize storage:', error);
        setMigrationComplete(true); // Continue even if migration fails
      }
    };

    initializeStorage();
  }, []);

  // Load number system preference from centralized storage
  useEffect(() => {
    if (!migrationComplete) return;
    
    const preferences = storageManager.getPreferences();
    const saved = preferences?.numberSystem;
    if (saved === 'eastern') {
      setNumberSystemState('indian');
    } else if (saved === 'western') {
      setNumberSystemState('international');
    }
  }, [migrationComplete]);

  // Save number system preference to centralized storage
  const setNumberSystem = (system: NumberSystem) => {
    setNumberSystemState(system);
    storageManager.updatePreferences({ 
      numberSystem: system === 'indian' ? 'eastern' : 'western' 
    });
    window.dispatchEvent(new CustomEvent('numberSystemChanged', { detail: system }));
  };

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    saveActiveTab(activeTab);
  }, [activeTab]);
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

  if (loading && activeTab === 'currency') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-sm mx-auto">
          <CardContent className="p-6 sm:p-8 text-center">
            <LoadingSpinner size={40} className="sm:w-12 sm:h-12 mb-3 sm:mb-4 mx-auto" />
            <h2 className="text-lg sm:text-xl font-semibold mb-2">{t('app.loading') as string}</h2>
            <p className="text-muted-foreground text-sm sm:text-base">{t('app.loadingSubtitle') as string}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!exchangeRates && activeTab === 'currency') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-sm mx-auto">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="text-destructive mb-3 sm:mb-4">
              <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">{t('app.noRatesAvailable') as string}</h2>
            <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
              {t('app.noRatesMessage') as string}
            </p>
            {pwaStatus.isOnline && (
              <Button
                onClick={() => refreshRates(false)}
                disabled={syncing}
              >
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
      {/* SEO and structured data */}
      <SEO />
      <StructuredData />
      
      {/* Refresh Warning Modal */}
      <RefreshWarningModal />
      
      {/* Combined Header */}
      <CombinedHeader
        isOnline={pwaStatus.isOnline}
        lastSync={lastSync}
        areRatesExpired={areRatesExpired()}
        syncing={syncing}
        onRefresh={refreshRates}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-12">
        {activeTab === 'currency' ? (
          <>
            {/* Combined Currency Info & Tools Island */}
            {exchangeRates && (
              <div className="mb-4 sm:mb-6 lg:mb-8 text-center">
                <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 lg:gap-6 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 bg-card/80 backdrop-blur-sm rounded-lg sm:rounded-xl border border-border shadow-lg max-w-full">
                  {/* Base Currency Info */}
                  <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2">
                    <span className="text-muted-foreground font-medium text-xs sm:text-sm lg:text-base">
                      {t('app.ratesRelativeTo') as string}
                    </span>
                    <span className="font-bold text-sm sm:text-base lg:text-lg text-primary">{baseCurrency}</span>
                    <span className="text-muted-foreground text-xs hidden lg:block">
                      {t('app.tapRateToChangeBase') as string}
                    </span>
                  </div>
                  
                  {/* Separator */}
                  <div className="w-full sm:w-px h-px sm:h-6 bg-border"></div>
                  
                  {/* Currency Tools */}
                  <div className="flex items-center gap-2">
                    <NumberSystemToggle 
                      system={numberSystem}
                      onToggle={setNumberSystem}
                    />
                    <div className="w-px h-6 bg-border"></div>
                    <MiniCalculator 
                      pinnedCurrencies={pinnedCurrencies}
                      onResult={(value) => {
                        // Handle calculator result if needed
                        console.log('Calculator result:', value);
                      }}
                    />
                  </div>
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
          </>
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
        ): (
          <Suspense fallback={<LoadingSpinner />}>  
            <ItineraryManager />
          </Suspense>
        )}

        {/* Footer Info */}
        <div className="mt-8 sm:mt-12 lg:mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 lg:gap-3 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-card/80 backdrop-blur-sm rounded-full border border-border shadow-lg">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-muted-foreground text-xs sm:text-sm font-medium">
                {activeTab === 'currency' ? t('app.liveRatesFrom') as string : 
                 activeTab === 'timezone' ? 'Real-time timezone data' : 
                 activeTab === 'units' ? 'Real-time unit conversion' :
                 activeTab === 'calculators' ? 'Smart calculation tools' :
                 'Your travel planner'}
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <DonateButton />
            <Suspense fallback={<LoadingSpinner />}>
              <AboutButton />
            </Suspense>
            <Suspense fallback={<LoadingSpinner />}>
              <PrivacyButton />
            </Suspense>
          </div>
          
          <p className="mt-2 sm:mt-4 text-muted-foreground text-xs px-4">
            {activeTab === 'currency' ? t('app.statusInfo') as string : 
             activeTab === 'timezone' ? 'Select a timezone card as base and enter time to convert' : 
             activeTab === 'units' ? 'Enter a value in any unit to see conversions across all other units' :
             activeTab === 'calculators' ? 'Use the tabs above to access different calculation tools for time, duration, age, and working days' :
             'Add activities, set dates and times, and organize your complete travel schedule'}
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
