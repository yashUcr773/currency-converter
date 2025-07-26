import { Globe, Hash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import type { NumberSystem } from '../utils/numberSystem';

interface NumberSystemToggleProps {
  system: NumberSystem;
  onToggle: (system: NumberSystem) => void;
}

export const NumberSystemToggle = ({ system, onToggle }: NumberSystemToggleProps) => {
  const { t } = useTranslation();
  
  const handleToggle = () => {
    onToggle(system === 'international' ? 'indian' : 'international');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className="flex items-center gap-1 px-2 py-1 text-xs"
      title={t('numberSystemToggle.switchTo', {
        system: system === 'international' ? t('settings.indian') : t('settings.international')
      })}
    >
      {system === 'international' ? (
        <>
          <Globe className="w-3 h-3" />
          <span className="hidden sm:inline">{t('numberSystemToggle.intl')}</span>
        </>
      ) : (
        <>
          <Hash className="w-3 h-3" />
          <span className="hidden sm:inline">{t('numberSystemToggle.in')}</span>
        </>
      )}
    </Button>
  );
};
