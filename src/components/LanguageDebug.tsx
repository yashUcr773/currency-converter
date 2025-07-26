import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageDebug: React.FC = () => {
  const { i18n, t } = useTranslation();
  
  const testLanguageChange = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };
  
  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs space-y-1">
      <div>{t('debug.current')}: {i18n.language}</div>
      <div>{t('debug.title')}: {t('app.title')}</div>
      <button 
        onClick={testLanguageChange}
        className="bg-blue-500 px-2 py-1 rounded text-white"
      >
        {t('debug.toggleLang')}
      </button>
    </div>
  );
};
