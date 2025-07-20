import { WifiOff, Download, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePWA, formatCacheSize } from '../hooks/usePWA';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UpdatePrompt } from './UpdatePrompt';

export function PWAStatus() {
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
          title="Install this app for quick access"
        >
          <Download className="w-3 h-3" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
        </button>
      )}

      {/* Alternative install hint for when browser doesn't show install prompt */}
      {!status.canInstall && !status.isInstalled && (
        <div 
          className="flex items-center gap-1 px-2 py-1 text-gray-500 text-xs cursor-help"
          title="This app can be installed! Look for 'Install' or 'Add to Home Screen' in your browser menu."
        >
          <Download className="w-3 h-3" />
          <span className="hidden sm:inline">Installable</span>
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
          <span className="hidden sm:inline">Update Available</span>
          <span className="sm:hidden">Update</span>
        </button>
      )}

      {/* Cache Management */}
      {status.cacheStatus && Object.keys(status.cacheStatus).length > 0 && (
        <div className="flex items-center gap-1">
          <button
            onClick={actions.refreshData}
            className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-blue-600 rounded transition-colors dark:text-gray-400 dark:hover:text-blue-400 touch-manipulation"
            title="Refresh Data"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline text-xs">Refresh</span>
          </button>
          
          <button
            onClick={handleClearCache}
            className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-red-600 rounded transition-colors dark:text-gray-400 dark:hover:text-red-400 touch-manipulation"
            title="Clear Cache"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline text-xs">Clear</span>
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
          <span className="hidden sm:inline">Installed</span>
          <span className="sm:hidden">✓</span>
        </div>
      )}

      {/* Development Test Button */}
      {isDevelopment && (
        <button
          onClick={testUpdatePrompt}
          className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 transition-colors"
          title="Test Update Prompt (Dev Only)"
        >
          Test Update
        </button>
      )}

      {/* Debug button for testing */}
      <button
        onClick={() => {
          console.log('[PWA Status Debug]');
          console.log('Navigator online:', navigator.onLine);
          console.log('PWA hook online:', status.isOnline);
          const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
          console.log('Network type:', connection?.effectiveType || 'unknown');
          
          // Trigger manual connectivity test
          console.log('Triggering manual connectivity test...');
          actions.refreshData();
        }}
        className="px-2 py-1 text-xs text-gray-500 hover:text-blue-600 rounded transition-colors"
        title="Debug Online Status & Test Connectivity"
      >
        🐛
      </button>

      {/* Manual connectivity test button */}
      <button
        onClick={async () => {
          console.log('[Manual Test] Testing real internet connectivity...');
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const response = await fetch('/manifest.json?t=' + Date.now(), {
              method: 'HEAD',
              cache: 'no-cache',
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            console.log('[Manual Test] Connectivity test result:', response.ok ? 'CONNECTED' : 'FAILED');
            alert(`Connectivity Test: ${response.ok ? '✅ Connected' : '❌ Failed'}`);
          } catch (error) {
            console.log('[Manual Test] Connectivity test failed:', error);
            alert('❌ No Internet Connection');
          }
        }}
        className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 rounded transition-colors"
        title="Test Real Internet Connectivity"
      >
        🌐
      </button>

      {/* Clear Cache Confirmation Dialog */}
      <Dialog open={showClearCacheDialog} onOpenChange={setShowClearCacheDialog}>
        <DialogContent className="max-w-sm mx-4 bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
              Clear Cache While Offline?
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-sm text-slate-700 leading-relaxed">
              <p className="mb-3">
                You're currently <strong>offline</strong>. Clearing the cache will remove all stored data including:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-xs text-slate-600">
                <li>Cached exchange rates</li>
                <li>Offline functionality</li>
                <li>Previously loaded currency data</li>
              </ul>
              <p className="mt-3 text-amber-700 font-medium">
                ⚠️ The app may not work properly without an internet connection after clearing the cache.
              </p>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowClearCacheDialog(false)}
                className="text-xs px-3 py-2"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmClearCache}
                className="text-xs px-3 py-2"
              >
                Clear Anyway
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Prompt */}
      <UpdatePrompt
        show={showUpdatePrompt}
        onUpdate={handleUpdateApp}
        onDismiss={handleDismissUpdate}
        hasCachedData={status.hasCachedData}
      />
    </div>
  );
}

export function OfflineNotice() {
  const [status] = usePWA();

  if (status.isOnline) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 dark:bg-amber-900/10 dark:border-amber-800">
      <div className="flex items-center gap-3">
        <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        <div>
          <h3 className="font-medium text-amber-800 dark:text-amber-200">You're currently offline</h3>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Using cached exchange rates. Connect to the internet for the latest rates.
          </p>
        </div>
      </div>
    </div>
  );
}
