import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, AlertCircle, Database, Wifi } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { usePWA, formatCacheSize } from '../hooks/usePWA';

interface UpdatePromptProps {
  show: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
  hasCachedData: boolean;
}

export function UpdatePrompt({ show, onUpdate, onDismiss, hasCachedData }: UpdatePromptProps) {
  const { t } = useTranslation();
  const [status] = usePWA();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdate();
    } finally {
      setIsUpdating(false);
    }
  };

  const totalCacheSize = status.cacheStatus ?
    Object.values(status.cacheStatus).reduce((total, cache) => total + cache.size, 0) : 0;

  return (
    <Dialog open={show} onOpenChange={onDismiss}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            {t('updatePrompt.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">
                {t('updatePrompt.newVersionReady')}
              </p>
              <p className="text-blue-700">
                {t('updatePrompt.updateDetails')}
              </p>
            </div>
          </div>

          {hasCachedData && (
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <Database className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-900 mb-1">
                  {t('updatePrompt.dataCachedTitle')}
                </p>
                <div className="text-amber-700 space-y-1">
                  <p>{t('updatePrompt.dataCachedDesc1')}</p>
                  {totalCacheSize > 0 && (
                    <p>{t('updatePrompt.cacheSize', { size: formatCacheSize(totalCacheSize) })}</p>
                  )}
                  <p>{t('updatePrompt.dataCachedDesc2')}</p>
                  {!status.isOnline && (
                    <div className="flex items-center gap-1 mt-2">
                      <Wifi className="w-4 h-4 text-amber-600" />
                      <span className="font-medium">{t('updatePrompt.offlineNotice')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {t('updatePrompt.updating')}
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('updatePrompt.updateNow')}
                </>
              )}
            </Button>
            <Button
              onClick={onDismiss}
              variant="outline"
              disabled={isUpdating}
              className="flex-1"
            >
              {t('updatePrompt.updateLater')}
            </Button>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
            <p className="font-medium mb-1">{t('updatePrompt.whatHappens')}</p>
            <ul className="space-y-0.5 text-gray-600">
              <li>{t('updatePrompt.reload')}</li>
              <li>{t('updatePrompt.dataSafe')}</li>
              <li>{t('updatePrompt.freshRates')}</li>
              <li>{t('updatePrompt.allPreserved')}</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
