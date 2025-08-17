import { WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePWA } from '../hooks/usePWA';

export function OfflineNotice() {
  const { t } = useTranslation();
  const [status] = usePWA();

  if (status.isOnline) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <WifiOff className="w-5 h-5 text-red-700" />
        <div>
          <h3 className="font-medium text-red-700">{t('pwaStatus.offlineTitle')}</h3>
          <p className="text-sm text-red-700">
            {t('pwaStatus.offlineDesc')}
          </p>
        </div>
      </div>
    </div>
  );
}
