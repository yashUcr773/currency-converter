import { WifiOff, Download, RefreshCw, Trash2 } from 'lucide-react';
import { usePWA, formatCacheSize } from '../hooks/usePWA';

export function PWAStatus() {
  const [status, actions] = usePWA();

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {/* Install App Button */}
      {status.canInstall && !status.isInstalled && (
        <button
          onClick={actions.installApp}
          className="flex items-center gap-1 px-3 py-1 text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
          title="Install this app for quick access"
        >
          <Download className="w-3 h-3" />
          <span>Install App</span>
        </button>
      )}

      {/* Alternative install hint for when browser doesn't show install prompt */}
      {!status.canInstall && !status.isInstalled && (
        <div 
          className="flex items-center gap-1 px-2 py-1 text-gray-500 text-xs cursor-help"
          title="This app can be installed! Look for 'Install' or 'Add to Home Screen' in your browser menu."
        >
          <Download className="w-3 h-3" />
          <span>Installable</span>
        </div>
      )}

      {/* Update Available */}
      {status.updateAvailable && (
        <button
          onClick={actions.updateApp}
          className="flex items-center gap-1 px-3 py-1 text-orange-600 bg-orange-100 hover:bg-orange-200 rounded-full transition-colors dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Update Available</span>
        </button>
      )}

      {/* Cache Management */}
      {status.cacheStatus && Object.keys(status.cacheStatus).length > 0 && (
        <div className="flex items-center gap-1">
          <button
            onClick={actions.refreshData}
            className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-blue-600 rounded transition-colors dark:text-gray-400 dark:hover:text-blue-400"
            title="Refresh Data"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
          
          <button
            onClick={actions.clearCache}
            className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-red-600 rounded transition-colors dark:text-gray-400 dark:hover:text-red-400"
            title="Clear Cache"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          
          <span className="text-xs text-gray-500 dark:text-gray-400">
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
          <span>Installed</span>
        </div>
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
