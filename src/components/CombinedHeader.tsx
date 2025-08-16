import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertTriangle, 
  Download, 
  Trash2,
  DollarSign,
  Clock,
  Calculator,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { usePWA } from '../hooks/usePWA';
import { UpdatePrompt } from './UpdatePrompt';
import { LanguagePicker } from './LanguagePicker';
import { AuthHeader } from './AuthHeader';
import { CloudSyncIndicator } from './CloudSyncStatus';
import type { TabType } from '../utils/tabStorage';

interface CombinedHeaderProps {
  // Status bar props
  isOnline: boolean;
  lastSync: number;
  areRatesExpired: boolean;
  syncing: boolean;
  onRefresh: (showModal?: boolean) => void;
  
  // Header props
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const CombinedHeader = ({
  isOnline,
  lastSync,
  areRatesExpired,
  syncing,
  onRefresh,
  activeTab,
  onTabChange
}: CombinedHeaderProps) => {
  const { t } = useTranslation();
  const [status, actions] = usePWA();
  const [showClearCacheDialog, setShowClearCacheDialog] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  const handleClearCache = () => {
    if (!status.isOnline) {
      setShowClearCacheDialog(true);  
    } else {
      actions.clearCache();
    }
  };

  const confirmClearCache = () => {
    actions.clearCache();
    setShowClearCacheDialog(false);
  };

  const handleDismissUpdate = () => {
    setShowUpdatePrompt(false);
    actions.dismissUpdate();
  };

  // Auto-show update prompt when conditions are met
  useEffect(() => {
    if (status.updateAvailable && !status.updateDismissed && !showUpdatePrompt) {
      setShowUpdatePrompt(true);
    }
  }, [status.updateAvailable, status.updateDismissed, showUpdatePrompt]);

  const formatLastSync = (timestamp: number) => {
    if (!timestamp) return t('statusBar.never');
    
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return t('statusBar.hoursMinutesAgo', { hours, minutes });
    } else if (minutes > 0) {
      return t('statusBar.minutesAgo', { minutes });
    } else {
      return t('statusBar.justNow');
    }
  };

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-50 text-red-700 border-red-200';
    if (areRatesExpired) return 'bg-orange-50 text-orange-700 border-orange-200';
    return 'bg-green-50 text-green-700 border-green-200';
  };

  const getStatusText = () => {
    if (!isOnline) return t('statusBar.offlineMode');
    if (areRatesExpired) return t('statusBar.ratesExpired');
    return t('statusBar.online');
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff size={16} />;
    if (areRatesExpired) return <AlertTriangle size={16} />;
    return <Wifi size={16} />;
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'currency': return t('app.title') as string;
      case 'timezone': return 'Timezone Converter';
      case 'units': return 'Unit Converter';
      case 'calculators': return 'Duration & Time Calculator';
      case 'itinerary': return 'Travel Itinerary';
      default: return t('app.title') as string;
    }
  };

  const getTabSubtitle = () => {
    switch (activeTab) {
      case 'currency': return t('app.subtitle') as string;
      case 'timezone': return 'Real-time timezone conversion across the globe';
      case 'units': return 'Convert between different units of measurement';
      case 'calculators': return 'Calculate time differences, add durations, and analyze dates';
      case 'itinerary': return 'Plan and organize your complete trip itinerary';
      default: return t('app.subtitle') as string;
    }
  };

  return (
    <>
      <header className="bg-card/80 backdrop-blur-sm shadow-lg border-b border-border">
        {/* Top Bar: Brand/Navigation */}
        <div className="bg-background/90 backdrop-blur-sm border-b border-border/50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2">
            <div className="flex items-center justify-between">
              {/* Logo/Brand */}
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                title="RateVault - Home"
              >
                <div className="p-1.5 sm:p-2 bg-primary rounded-lg shadow-sm">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span className="text-lg sm:text-xl font-bold text-primary">
                  RateVault
                </span>
              </button>

              {/* Auth Controls */}
              <AuthHeader />
            </div>
          </div>
        </div>

        {/* Status Bar: System Status + Tools */}
        <div className="bg-muted/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2">
            <div className="flex items-center justify-between gap-2">
              
              {/* Left: System Status */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {/* Connection Status */}
                <div className={cn(
                  'flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-medium shadow-sm',
                  getStatusColor()
                )}>
                  {getStatusIcon()}
                  <span className="hidden sm:inline">{getStatusText()}</span>
                </div>

                {/* Cloud Sync Indicator */}
                <CloudSyncIndicator />

                {/* Last Sync */}
                <span className="text-xs text-muted-foreground font-medium hidden md:inline">
                  {t('statusBar.updated')} {formatLastSync(lastSync)}
                </span>

                {/* Refresh Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRefresh(true)}
                  disabled={syncing}
                  className={cn(
                    "h-auto px-2 py-1 text-xs flex items-center gap-1 transition-all duration-200 rounded-md",
                    isOnline 
                      ? "hover:bg-blue-50 hover:text-blue-700 text-slate-600"
                      : "hover:bg-orange-50 hover:text-orange-700 text-slate-500"
                  )}
                  title={isOnline ? t('statusBar.refreshTitle') : t('statusBar.tryRefreshTitle')}
                >
                  <RefreshCw 
                    size={12} 
                    className={syncing ? 'animate-spin' : ''} 
                  />
                  <span className="hidden lg:inline">{syncing ? t('statusBar.syncing') : t('statusBar.refresh')}</span>
                </Button>
              </div>

              {/* Right: Tools & PWA Controls */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* PWA Controls */}
                {status.canInstall && !status.isInstalled && (
                  <button
                    onClick={actions.installApp}
                    className="flex items-center justify-center p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    title={t('pwaStatus.installTitle')}
                  >
                    <Download className="w-3 h-3" />
                  </button>
                )}

                {status.updateAvailable && (
                  <button
                    onClick={() => setShowUpdatePrompt(true)}
                    className="flex items-center justify-center p-1.5 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors"
                    title={t('pwaStatus.updateAvailable')}
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                )}

                {status.cacheStatus && Object.keys(status.cacheStatus).length > 0 && (
                  <button
                    onClick={handleClearCache}
                    className="flex items-center justify-center p-1.5 text-slate-600 hover:text-red-600 rounded-md transition-colors"
                    title={t('pwaStatus.clear')}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}

                {status.isInstalled && (
                  <div className="flex items-center justify-center p-1.5 bg-green-50 rounded-md" title={t('pwaStatus.installed')}>
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  </div>
                )}

                {/* Utility Tools */}
                <LanguagePicker variant="compact" />
              </div>
            </div>
          </div>
        </div>

        {/* Offline Notice - Shows when offline */}
        {!isOnline && (
          <div className="bg-red-50/90 backdrop-blur-sm border-b border-red-200/60">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3">
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full border border-red-200">
                  <WifiOff className="w-4 h-4 text-red-700" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-red-700 mb-0.5">{t('pwaStatus.offlineTitle')}</p>
                  <p className="text-xs text-red-600 leading-tight max-w-md">
                    {t('pwaStatus.offlineDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page Title Section */}
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-8">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-2">
              {getTabTitle()}
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm lg:text-base font-medium px-2 sm:px-4">
              {getTabSubtitle()}
            </p>
          </div>

          {/* Tab Navigation - Separate Section */}
          <div className="mt-4 sm:mt-6 flex justify-center">
            <div className="inline-flex bg-card/80 backdrop-blur-sm rounded-lg border border-border shadow-sm p-1">
              <button
                onClick={() => onTabChange('currency')}
                className={cn(
                  "flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  activeTab === 'currency'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-primary hover:bg-accent'
                )}
              >
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Currency</span>
              </button>
              <button
                onClick={() => onTabChange('timezone')}
                className={cn(
                  "flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  activeTab === 'timezone'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-primary hover:bg-accent'
                )}
              >
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Timezone</span>
              </button>
              <button
                onClick={() => onTabChange('units')}
                className={cn(
                  "flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  activeTab === 'units'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-primary hover:bg-accent'
                )}
              >
                <Calculator className="w-4 h-4" />
                <span className="hidden sm:inline">Units</span>
              </button>
              <button
                onClick={() => onTabChange('calculators')}
                className={cn(
                  "flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  activeTab === 'calculators'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-primary hover:bg-accent'
                )}
              >
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Duration</span>
              </button>
              <button
                onClick={() => onTabChange('itinerary')}
                className={cn(
                  "flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  activeTab === 'itinerary'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-primary hover:bg-accent'
                )}
              >
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">Itinerary</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Update Prompt Dialog */}
      {showUpdatePrompt && (
        <UpdatePrompt
          show={showUpdatePrompt}
          onDismiss={handleDismissUpdate}
          hasCachedData={status.hasCachedData}
        />
      )}

      {/* Clear Cache Confirmation Dialog */}
      <Dialog open={showClearCacheDialog} onOpenChange={setShowClearCacheDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-orange-700">
              {t('pwaStatus.clearCacheOfflineTitle')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              {t('pwaStatus.clearCacheOfflineMessage')}
            </p>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowClearCacheDialog(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button 
                onClick={confirmClearCache}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {t('pwaStatus.clearAnyway')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
