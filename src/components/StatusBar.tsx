import { Wifi, WifiOff, RefreshCw, AlertTriangle, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { usePWA } from '../hooks/usePWA';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UpdatePrompt } from './UpdatePrompt';
import { MiniCalculator } from './MiniCalculator';
import { NumberSystemToggle } from './NumberSystemToggle';
import { LanguagePicker } from './LanguagePicker';
import { logger } from '../utils/env';
import type { NumberSystem } from '../utils/numberSystem';
import type { PinnedCurrency } from '../types';

interface StatusBarProps {
  isOnline: boolean;
  lastSync: number;
  areRatesExpired: boolean;
  syncing: boolean;
  onRefresh: () => void;
  pinnedCurrencies?: PinnedCurrency[];
}

export const StatusBar = ({
  isOnline,
  lastSync,
  areRatesExpired,
  syncing,
  onRefresh,
  pinnedCurrencies = []
}: StatusBarProps) => {
  const { t } = useTranslation();
  const [status, actions] = usePWA();
  const [showClearCacheDialog, setShowClearCacheDialog] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [numberSystem, setNumberSystemState] = useState<NumberSystem>('international');

  // Load number system preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('number-system-preference');
    if (saved === 'indian' || saved === 'international') {
      setNumberSystemState(saved);
    }
  }, []);

  // Save number system preference to localStorage
  const setNumberSystem = (system: NumberSystem) => {
    setNumberSystemState(system);
    localStorage.setItem('number-system-preference', system);
    window.dispatchEvent(new CustomEvent('numberSystemChanged', { detail: system }));
  };

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

  const handleUpdateApp = async () => {
    setShowUpdatePrompt(false);
    await actions.updateApp();
  };

  const handleDismissUpdate = () => {
    setShowUpdatePrompt(false);
  };

  // Auto-show update prompt when conditions are met
  useEffect(() => {
    if (status.updateAvailable && status.hasCachedData && !showUpdatePrompt) {
      setShowUpdatePrompt(true);
    }
  }, [status.updateAvailable, status.hasCachedData, showUpdatePrompt]);

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

  return (
    <>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-4 p-3 lg:p-4 bg-white/80 backdrop-blur-sm border-t border-slate-200">
        {/* Left Side: Connection Status & Last Sync */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          {/* Status indicator */}
          <div className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold shadow-sm',
            getStatusColor()
          )}>
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>

          {/* Last sync info */}
          <span className="text-xs sm:text-sm text-slate-600 font-medium">
            <span className="hidden sm:inline">{t('statusBar.lastUpdated')} </span>
            <span className="sm:hidden">{t('statusBar.updated')} </span>
            <span className="text-slate-500">{formatLastSync(lastSync)}</span>
          </span>
        </div>

        {/* Right Side: Actions & Tools */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Refresh Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={syncing}
            className={cn(
              "h-auto px-2 sm:px-3 py-1.5 text-xs flex items-center gap-1.5 transition-all duration-200 rounded-lg border border-transparent font-medium touch-manipulation",
              isOnline 
                ? "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-slate-600"
                : "hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 text-slate-500"
            )}
            title={isOnline ? t('statusBar.refreshTitle') : t('statusBar.tryRefreshTitle')}
          >
            <RefreshCw 
              size={14} 
              className={syncing ? 'animate-spin' : ''} 
            />
            <span className="hidden sm:inline">{syncing ? t('statusBar.syncing') : isOnline ? t('statusBar.refresh') : t('statusBar.tryRefresh')}</span>
          </Button>

          {/* Install App Button */}
          {status.canInstall && !status.isInstalled && (
            <button
              onClick={actions.installApp}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors text-xs font-medium touch-manipulation"
              title={t('pwaStatus.installTitle')}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('pwaStatus.installApp')}</span>
            </button>
          )}

          {/* Update Available */}
          {status.updateAvailable && (
            <button
              onClick={() => setShowUpdatePrompt(true)}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-orange-600 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors text-xs font-medium touch-manipulation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('pwaStatus.updateAvailable')}</span>
            </button>
          )}

          {/* Cache Management - Only show if cache exists */}
          {status.cacheStatus && Object.keys(status.cacheStatus).length > 0 && (
            <button
              onClick={handleClearCache}
              className="flex items-center gap-1.5 px-2 py-1.5 text-slate-600 hover:text-red-600 rounded-lg transition-colors text-xs touch-manipulation"
              title={t('pwaStatus.clear')}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{t('pwaStatus.clear')}</span>
            </button>
          )}

          {/* Installed Badge */}
          {status.isInstalled && (
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="hidden sm:inline">{t('pwaStatus.installed')}</span>
            </div>
          )}

          {/* Number System Toggle */}
          <NumberSystemToggle 
            system={numberSystem}
            onToggle={setNumberSystem}
          />

          {/* Mini Calculator */}
          <MiniCalculator 
            pinnedCurrencies={pinnedCurrencies}
            onResult={(value) => {
              logger.log('Calculator result received:', value);
            }}
          />

          {/* Language Picker */}
          <LanguagePicker variant="compact" />
        </div>
      </div>

      {/* Update Prompt Dialog */}
      {showUpdatePrompt && (
        <UpdatePrompt
          show={showUpdatePrompt}
          onUpdate={handleUpdateApp}
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
