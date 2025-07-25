import { useState } from 'react';
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
        <Card className="group cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-2 border-dashed border-slate-200 hover:border-blue-400">
          <CardContent className="p-6 min-h-[160px] flex flex-col items-center justify-center">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-slate-200 mb-4 group-hover:scale-110 transition-transform duration-200">
              <Plus size={24} className="text-blue-600" />
            </div>
            <span className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors duration-200">Add Currency</span>
            <span className="text-sm text-slate-600 mt-1 font-medium">Choose from 150+ currencies</span>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-md bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Select Currency
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
            <Input
              type="text"
              placeholder="Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 rounded-lg"
              autoFocus
            />
          </div>
          
          <div className="text-xs text-slate-600 bg-white/60 px-3 py-2 rounded-lg font-medium border border-slate-200">
            {filteredCurrencies.length} of {availableCurrencies.length} currencies
          </div>

          {/* Currency List */}
          <ScrollArea className="h-80 bg-white/40 rounded-lg border border-slate-200">
            {filteredCurrencies.length === 0 ? (
              <div className="p-4 text-center text-slate-600 font-medium">
                No currencies found for "{searchTerm}"
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredCurrencies.map((currency) => (
                  <Button
                    key={currency.code}
                    variant="ghost"
                    onClick={() => handleSelectCurrency(currency)}
                    className="w-full justify-start h-auto p-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-200 transition-all duration-200 rounded-lg border border-transparent group"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">{currency.flag}</span>
                      <div className="flex-grow min-w-0">
                        <div className="font-bold text-slate-800 group-hover:text-slate-900">{currency.code}</div>
                        <div className="text-sm text-slate-600 truncate group-hover:text-slate-700 font-medium">{currency.name}</div>
                      </div>
                      <div className="text-slate-600 font-bold flex-shrink-0 group-hover:text-slate-800">
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
