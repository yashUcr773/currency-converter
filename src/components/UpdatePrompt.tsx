import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, AlertCircle, Database, Wifi, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { usePWA, formatCacheSize } from '../hooks/usePWA';
import { clearCacheAndReload } from '../utils/clearCacheAndReload';

interface UpdatePromptProps {
  show: boolean;
  onDismiss: () => void;
  hasCachedData: boolean;
}

export function UpdatePrompt({ show, onDismiss, hasCachedData }: UpdatePromptProps) {
  const { t } = useTranslation();
  const [status] = usePWA();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleClearCacheAndReload = async () => {
    setIsUpdating(true);
    try {
      await clearCacheAndReload();
    } catch (error) {
      console.error('Failed to clear cache and reload:', error);
      // Fallback to regular reload
      window.location.reload();
    }
  };

  const handleUseExistingVersion = () => {
    onDismiss();
  };

  const totalCacheSize = status.cacheStatus ?
    Object.values(status.cacheStatus).reduce((total, cache) => total + cache.size, 0) : 0;

  return (
    <Dialog open={show} onOpenChange={onDismiss}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            {t('updatePrompt.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-info/10 rounded-lg border border-info/20">
            <AlertCircle className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-info mb-1">
                {t('updatePrompt.newVersionReady')}
              </p>
              <p className="text-info/80">
                {t('updatePrompt.updateDetails')}
              </p>
            </div>
          </div>

          {hasCachedData && (
            <div className="flex items-start gap-3 p-3 bg-warning/10 rounded-lg border border-warning/30">
              <Database className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-warning mb-1">
                  {t('updatePrompt.dataCachedTitle')}
                </p>
                <div className="text-warning/80 space-y-1">
                  <p>{t('updatePrompt.dataCachedDesc1')}</p>
                  {totalCacheSize > 0 && (
                    <p>{t('updatePrompt.cacheSize', { size: formatCacheSize(totalCacheSize) })}</p>
                  )}
                  <p>{t('updatePrompt.dataCachedDesc2')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Internet access warning */}
          <div className="flex items-start gap-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
            <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-warning mb-1">
                {t('updatePrompt.internetRequired')}
              </p>
              <p className="text-warning/80">
                {t('updatePrompt.internetWarning')}
              </p>
              {!status.isOnline && (
                <div className="flex items-center gap-1 mt-2">
                  <Wifi className="w-4 h-4 text-warning" />
                  <span className="font-medium text-warning">{t('updatePrompt.currentlyOffline')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleClearCacheAndReload}
              disabled={isUpdating}
              className="w-full bg-primary hover:bg-primary-dark text-primary-foreground"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {t('updatePrompt.clearingAndReloading')}
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('updatePrompt.clearCacheAndReload')}
                </>
              )}
            </Button>
            <Button
              onClick={handleUseExistingVersion}
              variant="outline"
              disabled={isUpdating}
              className="w-full"
            >
              {t('updatePrompt.useExistingVersion')}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground bg-muted p-2 rounded border border-border">
            <p className="font-medium mb-1">{t('updatePrompt.whatHappensOnUpdate')}</p>
            <ul className="space-y-0.5 text-muted-foreground">
              <li>{t('updatePrompt.clearAllCaches')}</li>
              <li>{t('updatePrompt.reloadWithNewVersion')}</li>
              <li>{t('updatePrompt.fetchFreshData')}</li>
              <li>{t('updatePrompt.preferencesPreserved')}</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
