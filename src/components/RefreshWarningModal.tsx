import { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Add global type declaration for development helpers
declare global {
  interface Window {
    testRefreshModal?: () => void;
  }
}

export function RefreshWarningModal() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [isHardRefreshing, setIsHardRefreshing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Detect refresh keyboard shortcuts (F5, Ctrl+R, Cmd+R)
      const isRefreshKey = (
        event.key === 'F5' ||
        (event.ctrlKey && event.key === 'r') ||
        (event.ctrlKey && event.key === 'R') ||
        (event.metaKey && event.key === 'r') || // Mac Cmd+R
        (event.metaKey && event.key === 'R')
      );

      if (isRefreshKey) {
        console.log('[RefreshWarning] Keyboard refresh detected:', event.key);
        event.preventDefault();
        event.stopPropagation();
        
        // Show modal immediately
        if (!showModal) {
          setShowModal(true);
        }
      }
    };

    // Add event listeners with high priority
    document.addEventListener('keydown', handleKeyDown, { capture: true, passive: false });
    
    // Development testing function
    if (process.env.NODE_ENV === 'development') {
      window.testRefreshModal = () => {
        console.log('[RefreshWarning] Manual test trigger');
        setShowModal(true);
      };
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [showModal]);

  const handleHardRefresh = async () => {
    console.log('[RefreshWarning] Hard refresh requested');
    setIsHardRefreshing(true);
    
    try {
      // Clear service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(registration => registration.unregister()));
      }
      
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Clear only sessionStorage (keep localStorage for user preferences)
      sessionStorage.clear();
      
      // Force hard refresh
      window.location.reload();
    } catch (error) {
      console.error('Error during hard refresh:', error);
      window.location.reload();
    }
  };

  const handleStayHere = () => {
    console.log('[RefreshWarning] User chose to stay here');
    setShowModal(false);
  };

  // Handle modal close via dialog's onOpenChange
  const handleModalClose = (open: boolean) => {
    console.log('[RefreshWarning] Modal open state changed:', open);
    setShowModal(open);
  };

  if (!showModal) return null;

  return (
    <Dialog open={showModal} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-md mx-auto bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-2xl">
        <DialogHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-800 text-center">
            {t('refreshWarning.title', 'Page Refresh Detected')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-center">
          <div className="space-y-2">
            <p className="text-slate-600 font-medium">
              {t('refreshWarning.message', 'Refreshing won\'t update your data!')}
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              {t('refreshWarning.explanation', 'RateVault runs on cached data for offline support. A regular refresh won\'t fetch new exchange rates or update the app.')}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700 font-medium">
              {t('refreshWarning.tip', 'Tip: Use the refresh button in the status bar to update exchange rates')}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              onClick={handleHardRefresh}
              disabled={isHardRefreshing}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isHardRefreshing ? 'animate-spin' : ''}`} />
              {isHardRefreshing 
                ? t('refreshWarning.hardRefreshing', 'Hard Refreshing...') 
                : t('refreshWarning.hardRefresh', 'Hard Refresh (Clear Cache)')
              }
            </Button>

            <Button
              onClick={handleStayHere}
              variant="outline"
              className="w-full"
            >
              {t('refreshWarning.stayHere', 'Stay Here')}
            </Button>
          </div>

          <p className="text-xs text-slate-400 pt-2">
            {t('refreshWarning.note', 'This message will only show once per session')}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
