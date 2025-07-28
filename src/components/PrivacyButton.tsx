import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const PrivacyButton = () => {
  const { t } = useTranslation();

  return (
    <Link
      to="/privacy"
      className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-sm font-medium transition-all duration-200 rounded-lg shadow-sm hover:shadow-md group backdrop-blur-sm"
      title={t('privacy.title')}
    >
      <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
      <span>{t('settings.privacy')}</span>
    </Link>
  );
};
