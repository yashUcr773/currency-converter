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
        <Card className="cursor-pointer border-2 border-dashed hover:border-primary/50 transition-colors">
          <CardContent className="p-4 min-h-[120px] flex items-center justify-center">
            <Button variant="ghost" className="h-auto p-4 flex items-center gap-2 text-muted-foreground hover:text-primary">
              <Plus size={20} />
              <span className="font-medium">Add Currency</span>
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Currency</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              type="text"
              placeholder="Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          
          <div className="text-xs text-muted-foreground">
            {filteredCurrencies.length} of {availableCurrencies.length} currencies
          </div>

          {/* Currency List */}
          <ScrollArea className="h-80">
            {filteredCurrencies.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No currencies found for "{searchTerm}"
              </div>
            ) : (
              <div className="space-y-1">
                {filteredCurrencies.map((currency) => (
                  <Button
                    key={currency.code}
                    variant="ghost"
                    onClick={() => handleSelectCurrency(currency)}
                    className="w-full justify-start h-auto p-3 text-left"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-2xl flex-shrink-0">{currency.flag}</span>
                      <div className="flex-grow min-w-0">
                        <div className="font-medium">{currency.code}</div>
                        <div className="text-sm text-muted-foreground truncate">{currency.name}</div>
                      </div>
                      <div className="text-muted-foreground font-medium flex-shrink-0">
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
