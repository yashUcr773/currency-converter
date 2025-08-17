import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search } from 'lucide-react';
import type { Currency } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';

interface CurrencySelectorProps {
  availableCurrencies: Currency[];
  onSelectCurrency: (currency: Currency) => void;
}

export const CurrencySelector = ({
  availableCurrencies,
  onSelectCurrency
}: CurrencySelectorProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCurrencies = availableCurrencies.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCurrency = (currency: Currency) => {
    onSelectCurrency(currency);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer overflow-hidden bg-gradient-to-br from-slate-50/90 to-white/90 backdrop-blur-md border border-dashed border-slate-300 hover:border-blue-400 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 touch-manipulation h-full flex flex-col rounded-xl">
          <CardContent className="p-3 sm:p-4 flex-1 flex flex-col items-center justify-center text-center space-y-2 sm:space-y-3">
            {/* Icon container */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm group-hover:blur-none transition-all duration-300"></div>
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-primary/10 rounded-full border border-primary/20 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                <Plus size={16} className="sm:w-5 sm:h-5 text-blue-600 group-hover:text-blue-700" />
              </div>
            </div>
            
            {/* Text content */}
            <div className="space-y-0.5 sm:space-y-1">
              <h3 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-blue-600 transition-colors duration-200">
                {t('converter.addCurrencyTitle')}
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-tight">
                {t('converter.currenciesCount')}
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-sm mx-auto bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-800 text-center">
            {t('converter.addCurrencyTitle')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
            <Input
              type="text"
              inputMode="search"
              placeholder={t('converter.searchCurrency')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-50/80 border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-200 rounded-xl h-12 text-base touch-manipulation"
              autoFocus
            />
          </div>
          
          <div className="text-xs text-slate-600 bg-blue-50/60 px-3 py-2 rounded-xl font-medium border border-blue-200/60">
            {t('converter.currencyCount', { filtered: filteredCurrencies.length, total: availableCurrencies.length })}
          </div>

          {/* Currency List */}
          <ScrollArea className="h-72 bg-slate-50/60 rounded-xl border border-slate-200">
            {filteredCurrencies.length === 0 ? (
              <div className="p-6 text-center text-slate-600 font-medium">
                {t('converter.noCurrenciesFound')} "{searchTerm}"
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredCurrencies.map((currency) => (
                  <Button
                    key={currency.code}
                    variant="ghost"
                    onClick={() => handleSelectCurrency(currency)}
                    className="w-full justify-start h-auto p-3 text-left hover:bg-primary/10 transition-all duration-200 rounded-xl border border-transparent group touch-manipulation"
                  >
                    <div className="flex items-center gap-3 w-full min-h-[52px]">
                      <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg border border-slate-300/50 shadow-sm group-hover:shadow-md transition-all duration-200 flex-shrink-0">
                        <span className="text-lg">{currency.flag}</span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="font-bold text-sm text-slate-800 group-hover:text-slate-900">{currency.code}</div>
                        <div className="text-xs text-slate-600 truncate group-hover:text-slate-700 font-medium">{currency.name}</div>
                      </div>
                      <div className="text-slate-600 font-bold flex-shrink-0 group-hover:text-slate-800 text-sm bg-slate-100 px-2 py-1 rounded-lg">
                        {currency.symbol}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
