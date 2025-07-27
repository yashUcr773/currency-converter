import { useState, useEffect, useCallback } from 'react';
import { logger } from '../utils/env';

export interface PWAStatus {
  isOnline: boolean;
  isInstalled: boolean;
  canInstall: boolean;
  updateAvailable: boolean;
  hasCachedData: boolean;
  cacheStatus?: {
    [cacheName: string]: {
      count: number;
      size: number;
    };
  };
}

export interface PWAActions {
  installApp: () => Promise<void>;
  updateApp: () => Promise<void>;
  clearCache: () => Promise<void>;
  refreshData: () => Promise<void>;
  checkForCachedData: () => boolean;
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<{ outcome: 'accepted' | 'dismissed' }>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export function usePWA(): [PWAStatus, PWAActions] {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [hasCachedData, setHasCachedData] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<PWAStatus['cacheStatus']>();

  // Check for cached data in localStorage
  const checkForLocalStorageData = (): boolean => {
    try {
      // Check for RateVault data in localStorage
      const storageKeys = ['ratevault-data', 'pinnedCurrencies', 'exchangeRates'];
      return storageKeys.some(key => {
        const data = localStorage.getItem(key);
        return data && data !== 'null' && data !== '{}' && data !== '[]';
      });
    } catch {
      return false;
    }
  };

  const getCacheStatus = useCallback(async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration?.active) {
          const messageChannel = new MessageChannel();
          
          messageChannel.port1.onmessage = (event) => {
            setCacheStatus(event.data);
            // Check if we have cached data
            const cacheData = event.data as PWAStatus['cacheStatus'];
            const totalCacheSize = cacheData ? 
              Object.values(cacheData).reduce((total: number, cache) => total + cache.size, 0) : 0;
            setHasCachedData(totalCacheSize > 0 || checkForLocalStorageData());
          };
          
          registration.active.postMessage(
            { type: 'GET_CACHE_STATUS' },
            [messageChannel.port2]
          );
        }
      } catch (error) {
        logger.error('Get cache status failed:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Check if app is installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
      
      setIsInstalled(isStandalone);
      
      // If app is installed, we can't show install button
      if (isStandalone) {
        setCanInstall(false);
      }
      
      logger.log('[PWA] Install status check:', {
        isStandalone,
        displayMode: window.matchMedia('(display-mode: standalone)').matches,
        iosStandalone: (window.navigator as Navigator & { standalone?: boolean }).standalone
      });
    };

    checkInstalled();
    
    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addListener(checkInstalled);

    // Online/offline status with enhanced detection
    const handleOnline = () => {
      logger.log('[PWA] Browser online event fired');
      // Verify with actual connectivity test
      checkOnlineStatus();
    };
    
    const handleOffline = () => {
      logger.log('[PWA] Browser offline event fired');
      setIsOnline(false);
    };

    // Backup online status check with actual connectivity test
    const checkOnlineStatus = async () => {
      const navigatorOnline = navigator.onLine;
      
      // If navigator says offline, trust it
      if (!navigatorOnline) {
        setIsOnline(prev => {
          if (prev !== false) {
            console.log('[PWA] Navigator reports offline');
          }
          return false;
        });
        return;
      }

      // If navigator says online, verify with actual network request
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        // Try to fetch a small resource with cache-busting
        const response = await fetch('/manifest.json?t=' + Date.now(), {
          method: 'HEAD',
          cache: 'no-cache',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const actuallyOnline = response.ok;
        
        setIsOnline(prev => {
          if (prev !== actuallyOnline) {
            console.log('[PWA] Real connectivity test:', actuallyOnline ? 'ONLINE' : 'OFFLINE');
          }
          return actuallyOnline;
        });
      } catch (error) {
        // Network request failed = actually offline
        setIsOnline(prev => {
          if (prev !== false) {
            console.log('[PWA] Connectivity test failed, actually offline:', error instanceof Error ? error.message : 'Unknown error');
          }
          return false;
        });
      }
    };

    console.log('[PWA] Setting up online/offline listeners, current status:', navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial connectivity check
    checkOnlineStatus();
    
    // Poll every 10 seconds with real connectivity test
    const pollInterval = setInterval(checkOnlineStatus, 10000);

    // PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('[PWA] beforeinstallprompt event fired');
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      console.log('[PWA] appinstalled event fired');
      deferredPrompt = null;
      setCanInstall(false);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Fallback: if no beforeinstallprompt after 3 seconds and not installed, allow manual install
    const fallbackTimer = setTimeout(() => {
      // Check current state when timer fires
      const currentIsInstalled = window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
      
      if (!currentIsInstalled && !deferredPrompt && 'serviceWorker' in navigator) {
        console.log('[PWA] No beforeinstallprompt event detected, enabling fallback install');
        setCanInstall(true);
      }
    }, 3000);

    // Service worker update detection
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        const { type } = event.data;
        
        switch (type) {
          case 'UPDATE_AVAILABLE':
            setUpdateAvailable(true);
            break;
          case 'DATA_SYNCED':
            console.log('Fresh data synced in background');
            // Optionally trigger a data refresh in the app
            break;
        }
      });

      // Get initial cache status
      getCacheStatus();
      
      // Initial check for cached data
      setHasCachedData(checkForLocalStorageData());
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeListener(checkInstalled);
      clearInterval(pollInterval);
      clearTimeout(fallbackTimer);
    };
  }, [getCacheStatus]);

  const installApp = async (): Promise<void> => {
    // If we have a deferred prompt, use it
    if (deferredPrompt) {
      try {
        const result = await deferredPrompt.prompt();
        console.log('Install prompt result:', result);
        
        if (result.outcome === 'accepted') {
          setCanInstall(false);
          setIsInstalled(true);
        }
        
        deferredPrompt = null;
      } catch (error) {
        console.error('Install failed:', error);
      }
      return;
    }

    // Fallback: Show instructions for manual install
    const userAgent = navigator.userAgent.toLowerCase();
    let instructions = '';
    
    if (userAgent.includes('chrome') || userAgent.includes('edge')) {
      instructions = 'Click the address bar, then click "Install" or the download icon.';
    } else if (userAgent.includes('firefox')) {
      instructions = 'Firefox: Add to Home Screen is available in the address bar menu (three dots).';
    } else if (userAgent.includes('safari')) {
      instructions = 'Safari: Tap the Share button and select "Add to Home Screen".';
    } else {
      instructions = 'Look for "Add to Home Screen" or "Install" in your browser menu.';
    }
    
    alert(`To install this app:\n\n${instructions}\n\nThis will create a shortcut that opens the app without browser controls.`);
  };

  const updateApp = async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration?.waiting) {
          // Tell the waiting service worker to skip waiting
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // Wait for the new service worker to take control
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
          });
        }
      } catch (error) {
        console.error('Update failed:', error);
      }
    }
  };

  const clearCache = async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration?.active) {
          const messageChannel = new MessageChannel();
          
          return new Promise((resolve) => {
            messageChannel.port1.onmessage = (event) => {
              if (event.data.success) {
                setCacheStatus({});
                resolve();
              }
            };
            
            if (registration.active) {
              registration.active.postMessage(
                { type: 'CLEAR_CACHE' },
                [messageChannel.port2]
              );
            }
          });
        }
      } catch (error) {
        console.error('Clear cache failed:', error);
      }
    }
  };

  const refreshData = async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        // Background sync is not available in all browsers, so we'll skip this for now
        // You can manually refresh data or implement a different strategy
        console.log('Data refresh requested', registration);
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    }
  };

  const checkForCachedData = (): boolean => {
    // Check for cached data in localStorage and service worker cache
    const localStorageData = checkForLocalStorageData();
    const serviceWorkerCache = cacheStatus ? 
      Object.values(cacheStatus).reduce((total, cache) => total + cache.size, 0) > 0 : false;
    
    return localStorageData || serviceWorkerCache;
  };

  const status: PWAStatus = {
    isOnline,
    isInstalled,
    canInstall,
    updateAvailable,
    hasCachedData,
    cacheStatus,
  };

  const actions: PWAActions = {
    installApp,
    updateApp,
    clearCache,
    refreshData,
    checkForCachedData,
  };

  return [status, actions];
}

// Helper function to format cache size
export function formatCacheSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to check if app can be installed
export function canInstallPWA(): boolean {
  return 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window;
}
