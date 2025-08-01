import { Download, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { usePWA, formatCacheSize } from '../hooks/usePWA';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UpdatePrompt } from './UpdatePrompt';
import { MiniCalculator } from './MiniCalculator';
import { NumberSystemToggle } from './NumberSystemToggle';
import { logger } from '../utils/env';
import type { NumberSystem } from '../utils/numberSystem';
import type { PinnedCurrency } from '../types';

interface PWAStatusProps {
  pinnedCurrencies?: PinnedCurrency[];
}

export function PWAStatus({ pinnedCurrencies = [] }: PWAStatusProps) {
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
    // Could also trigger a global event here for other components to listen
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

  const handleDismissUpdate = () => {
    setShowUpdatePrompt(false);
    actions.dismissUpdate(); // Mark update as dismissed in PWA state
  };

  // Auto-show update prompt when conditions are met
  useEffect(() => {
    if (status.updateAvailable && status.hasCachedData && !status.updateDismissed && !showUpdatePrompt) {
      setShowUpdatePrompt(true);
    }
  }, [status.updateAvailable, status.hasCachedData, status.updateDismissed, showUpdatePrompt]);

  // Debug helper - add test button in development
  const isDevelopment = import.meta.env.DEV;
  const testUpdatePrompt = () => {
    if (isDevelopment) {
      setShowUpdatePrompt(true);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm">
      {/* Install App Button */}
      {status.canInstall && !status.isInstalled && (
        <button
          onClick={actions.installApp}
          className="flex items-center gap-1 px-2 sm:px-3 py-1 text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 touch-manipulation"
          title={t('pwaStatus.installTitle')}
        >
          <Download className="w-3 h-3" />
          <span className="hidden sm:inline">{t('pwaStatus.installApp')}</span>
          <span className="sm:hidden">{t('pwaStatus.install')}</span>
        </button>
      )}

      {/* Alternative install hint for when browser doesn't show install prompt */}
      {!status.canInstall && !status.isInstalled && (
        <div 
          className="flex items-center gap-1 px-2 py-1 text-gray-500 text-xs cursor-help"
          title={t('pwaStatus.installHint')}
        >
          <Download className="w-3 h-3" />
          <span className="hidden sm:inline">{t('pwaStatus.installable')}</span>
          <span className="sm:hidden">📱</span>
        </div>
      )}

      {/* Update Available */}
      {status.updateAvailable && (
        <button
          onClick={() => setShowUpdatePrompt(true)}
          className="flex items-center gap-1 px-2 sm:px-3 py-1 text-orange-600 bg-orange-100 hover:bg-orange-200 rounded-full transition-colors dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30 touch-manipulation"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="hidden sm:inline">{t('pwaStatus.updateAvailable')}</span>
          <span className="sm:hidden">{t('pwaStatus.update')}</span>
        </button>
      )}

      {/* Cache Management */}
      {status.cacheStatus && Object.keys(status.cacheStatus).length > 0 && (
        <div className="flex items-center gap-1">
          <button
            onClick={actions.refreshData}
            className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-blue-600 rounded transition-colors dark:text-gray-400 dark:hover:text-blue-400 touch-manipulation"
            title={t('pwaStatus.refresh')}
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline text-xs">{t('pwaStatus.refresh')}</span>
          </button>
          
          <button
            onClick={handleClearCache}
            className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-red-600 rounded transition-colors dark:text-gray-400 dark:hover:text-red-400 touch-manipulation"
            title={t('pwaStatus.clear')}
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline text-xs">{t('pwaStatus.clear')}</span>
          </button>
          
          <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
            {Object.values(status.cacheStatus).reduce((total, cache) => total + cache.size, 0) > 0 && 
              formatCacheSize(Object.values(status.cacheStatus).reduce((total, cache) => total + cache.size, 0))
            }
          </span>
        </div>
      )}

      {/* Installed Badge */}
      {status.isInstalled && (
        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full dark:bg-green-900/20 dark:text-green-400">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="hidden sm:inline">{t('pwaStatus.installed')}</span>
          <span className="sm:hidden">✓</span>
        </div>
      )}

      {/* Development Test Button */}
      {isDevelopment && (
        <button
          onClick={testUpdatePrompt}
          className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 transition-colors"
          title={t('pwaStatus.testUpdate')}
        >
          {t('pwaStatus.testUpdate')}
        </button>
      )}

      {/* Mini Calculator */}
      <MiniCalculator 
        pinnedCurrencies={pinnedCurrencies}
        onResult={(value) => {
          // The calculator will handle its own event dispatching
          logger.log('Calculator result received in PWAStatus:', value);
        }}
      />

      {/* Number System Toggle */}
      <NumberSystemToggle 
        system={numberSystem}
        onToggle={setNumberSystem}
      />

      {/* Manual connectivity test button */}
      <button
        onClick={async () => {
          logger.log('[Manual Test] Testing real internet connectivity...');
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const response = await fetch('/manifest.json?t=' + Date.now(), {
              method: 'HEAD',
              cache: 'no-cache',
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            logger.log('[Manual Test] Connectivity test result:', response.ok ? 'CONNECTED' : 'FAILED');
            alert(`Connectivity Test: ${response.ok ? '✅ Connected' : '❌ Failed'}`);
          } catch (error) {
            logger.log('[Manual Test] Connectivity test failed:', error);
            alert('❌ No Internet Connection');
          }
        }}
        className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 rounded transition-colors"
        title={t('common.testConnectivity')}
      >
        🌐
      </button>

      {/* Clear Cache Confirmation Dialog */}
      <Dialog open={showClearCacheDialog} onOpenChange={setShowClearCacheDialog}>
        <DialogContent className="max-w-[calc(100% - 24px)] mx-auto bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
              {t('pwaStatus.clearCacheOfflineTitle')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-sm text-slate-700 leading-relaxed">
              <p className="mb-3" dangerouslySetInnerHTML={{ __html: t('pwaStatus.clearCacheOfflineDesc') }} />
              <ul className="list-disc pl-6 space-y-1 text-xs text-slate-600">
                <li>{t('pwaStatus.clearCacheOfflineList1')}</li>
                <li>{t('pwaStatus.clearCacheOfflineList2')}</li>
                <li>{t('pwaStatus.clearCacheOfflineList3')}</li>
              </ul>
              <p className="mt-3 text-amber-700 font-medium">
                {t('pwaStatus.clearCacheOfflineWarn')}
              </p>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowClearCacheDialog(false)}
                className="text-xs px-3 py-2"
              >
                {t('pwaStatus.cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={confirmClearCache}
                className="text-xs px-3 py-2"
              >
                {t('pwaStatus.clearAnyway')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Prompt */}
      <UpdatePrompt
        show={showUpdatePrompt}
        onDismiss={handleDismissUpdate}
        hasCachedData={status.hasCachedData}
      />
    </div>
  );
}
