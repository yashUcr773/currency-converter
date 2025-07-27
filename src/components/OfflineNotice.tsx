import { WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePWA } from '../hooks/usePWA';

export function OfflineNotice() {
  const { t } = useTranslation();
  const [status] = usePWA();

  if (status.isOnline) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 dark:bg-amber-900/10 dark:border-amber-800">
      <div className="flex items-center gap-3">
        <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        <div>
          <h3 className="font-medium text-amber-800 dark:text-amber-200">{t('pwaStatus.offlineTitle')}</h3>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {t('pwaStatus.offlineDesc')}
          </p>
        </div>
      </div>
    </div>
  );
}
