import { useState, useEffect } from 'react';
import { useCurrencyConverter } from './hooks/useCurrencyConverter';
import { useTranslation } from 'react-i18next';
import { CurrencyInput } from './components/CurrencyInput';
import { CurrencySelector } from './components/CurrencySelector';
import { StatusBar } from './components/StatusBar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { OfflineNotice } from './components/OfflineNotice';
import { RefreshWarningModal } from './components/RefreshWarningModal';
import { DonateButton } from './components/DonateButton';
import { AboutButton } from './components/AboutPage';
import { SEO, StructuredData } from './components/SEO';
import { TimezoneConverter } from './components/TimezoneConverter';
import { PersistenceIndicator } from './components/PersistenceIndicator';
import { usePWA } from './hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, DollarSign, Clock } from 'lucide-react';
import { saveActiveTab, getActiveTab, type TabType } from './utils/tabStorage';
import './App.css';

function App() {
  const { t } = useTranslation();
  const [pwaStatus] = usePWA();
  const [activeTab, setActiveTab] = useState<TabType>(() => getActiveTab());
  const [showPersistenceIndicator, setShowPersistenceIndicator] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialLoad) {
      saveActiveTab(activeTab);
      setShowPersistenceIndicator(true);
    } else {
      setIsInitialLoad(false);
    }
  }, [activeTab, isInitialLoad]);
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
            <h2 className="text-lg sm:text-xl font-semibold mb-2">{t('app.loading')}</h2>
            <p className="text-muted-foreground text-sm sm:text-base">{t('app.loadingSubtitle')}</p>
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
            <h2 className="text-lg sm:text-xl font-semibold mb-2">{t('app.noRatesAvailable')}</h2>
            <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
              {t('app.noRatesMessage')}
            </p>
            {pwaStatus.isOnline && (
              <Button
                onClick={refreshRates}
                disabled={syncing}
              >
                {syncing ? t('app.retrying') : t('app.retry')}
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
      
      {/* Refresh Warning Modal */}
      <RefreshWarningModal />
      
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
              {activeTab === 'currency' ? t('app.title') : 'Timezone Converter'}
            </h1>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm lg:text-base xl:text-lg font-medium px-2 sm:px-4">
            {activeTab === 'currency' ? t('app.subtitle') : 'Real-time timezone conversion across the globe'}
          </p>

          {/* Tab Navigation */}
          <div className="mt-4 sm:mt-6 flex justify-center">
            <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 shadow-sm p-1">
              <button
                onClick={() => setActiveTab('currency')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'currency'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Currency</span>
              </button>
              <button
                onClick={() => setActiveTab('timezone')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'timezone'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Timezone</span>
              </button>
            </div>
          </div>
          </div>
        </div>
        
        {/* Combined Status Bar */}
        <StatusBar
          isOnline={pwaStatus.isOnline}
          lastSync={lastSync}
          areRatesExpired={areRatesExpired()}
          syncing={syncing}
          onRefresh={refreshRates}
          pinnedCurrencies={pinnedCurrencies}
        />
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-12">
        {/* Offline Notice */}
        <OfflineNotice />
        
        {activeTab === 'currency' ? (
          <>
            {/* Base Currency Indicator */}
            {exchangeRates && (
              <div className="mb-4 sm:mb-6 lg:mb-8 text-center">
                <div className="inline-flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 lg:gap-3 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-200 shadow-lg max-w-full">
                  <span className="text-slate-600 font-medium text-xs sm:text-sm lg:text-base">
                    {t('app.ratesRelativeTo')}
                  </span>
                  <span className="font-bold text-sm sm:text-base lg:text-lg text-blue-600">{baseCurrency}</span>
                  <span className="text-slate-400 text-xs hidden sm:block">
                    {t('app.tapRateToChangeBase')}
                  </span>
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
        ) : (
          <TimezoneConverter />
        )}

        {/* Footer Info */}
        <div className="mt-8 sm:mt-12 lg:mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 lg:gap-3 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-lg">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-slate-600 text-xs sm:text-sm font-medium">
                {activeTab === 'currency' ? t('app.liveRatesFrom') : 'Real-time timezone data'}
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <DonateButton />
            <AboutButton />
          </div>
          
          <p className="mt-2 sm:mt-4 text-slate-500 text-xs px-4">
            {activeTab === 'currency' ? t('app.statusInfo') : 'Select a timezone card as base and enter time to convert'}
          </p>
        </div>
      </main>

      {/* Persistence Indicator */}
      <PersistenceIndicator isActive={showPersistenceIndicator} />
    </div>
  );
}

export default App;
