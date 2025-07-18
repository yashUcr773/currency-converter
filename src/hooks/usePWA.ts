import { useState, useEffect } from 'react';

export interface PWAStatus {
  isOnline: boolean;
  isInstalled: boolean;
  canInstall: boolean;
  updateAvailable: boolean;
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
  const [cacheStatus, setCacheStatus] = useState<PWAStatus['cacheStatus']>();

  useEffect(() => {
    // Check if app is installed
    const checkInstalled = () => {
      setIsInstalled(
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true
      );
    };

    checkInstalled();

    // Online/offline status with enhanced detection
    const handleOnline = () => {
      console.log('[PWA] Browser online event fired');
      // Verify with actual connectivity test
      checkOnlineStatus();
    };
    
    const handleOffline = () => {
      console.log('[PWA] Browser offline event fired');
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
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      deferredPrompt = null;
      setCanInstall(false);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

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
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearInterval(pollInterval);
    };
  }, []);

  const installApp = async (): Promise<void> => {
    if (!deferredPrompt) return;

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

  const getCacheStatus = async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration?.active) {
          const messageChannel = new MessageChannel();
          
          messageChannel.port1.onmessage = (event) => {
            setCacheStatus(event.data);
          };
          
          registration.active.postMessage(
            { type: 'GET_CACHE_STATUS' },
            [messageChannel.port2]
          );
        }
      } catch (error) {
        console.error('Get cache status failed:', error);
      }
    }
  };

  const status: PWAStatus = {
    isOnline,
    isInstalled,
    canInstall,
    updateAvailable,
    cacheStatus,
  };

  const actions: PWAActions = {
    installApp,
    updateApp,
    clearCache,
    refreshData,
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
