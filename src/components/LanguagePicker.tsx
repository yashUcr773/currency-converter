import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supportedLanguages } from '@/i18n/config';

interface LanguagePickerProps {
  variant?: 'button' | 'compact' | 'icon';
  className?: string;
}

export const LanguagePicker: React.FC<LanguagePickerProps> = ({ 
  variant = 'button',
  className = ''
}) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [, forceUpdate] = useState(0);

  const currentLanguage = supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0];

  useEffect(() => {
    const handleLanguageChanged = () => {
      forceUpdate(prev => prev + 1);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => i18n.off('languageChanged', handleLanguageChanged);
  }, [i18n]);

  const handleLanguageChange = (languageCode: string) => {
    // Set the language and persist to localStorage
    i18n.changeLanguage(languageCode);
    localStorage.setItem('i18nextLng', languageCode);
    setIsOpen(false);
    
    // Force page reload to ensure all components update
    // This is a reliable solution for language switching
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const TriggerButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => {
    if (variant === 'icon') {
      return (
        <Button
          ref={ref}
          variant="ghost"
          size="sm"
          className={`h-9 w-9 p-0 ${className}`}
          title={t('settings.language')}
          {...props}
        >
          <Globe className="h-4 w-4" />
        </Button>
      );
    }

    if (variant === 'compact') {
      return (
        <Button
          ref={ref}
          variant="outline"
          size="sm"
          className={`gap-2 hover:bg-slate-100 ${className}`}
          {...props}
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium">{currentLanguage.code.toUpperCase()}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      );
    }

    return (
      <Button
        ref={ref}
        variant="outline"
        className={`gap-2 ${className}`}
        {...props}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
        <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
        <ChevronDown className="h-4 w-4" />
      </Button>
    );
  });

  TriggerButton.displayName = 'TriggerButton';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <TriggerButton />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="flex items-center gap-2 p-3 border-b">
          <Globe className="h-4 w-4" />
          <span className="font-medium text-sm">{t('settings.language')}</span>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {supportedLanguages.map((language) => (
            <Button
              key={language.code}
              variant="ghost"
              className="w-full justify-between h-auto p-3 rounded-none"
              onClick={() => handleLanguageChange(language.code)}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{language.nativeName}</span>
                <span className="text-xs text-muted-foreground">{language.name}</span>
              </div>
              {currentLanguage.code === language.code && (
                <Check className="h-4 w-4" />
              )}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
