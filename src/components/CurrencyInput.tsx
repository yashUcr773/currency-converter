import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { PinnedCurrency } from '../types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatForDisplay } from '../utils/formatNumber';

interface CurrencyInputProps {
  pinnedCurrency: PinnedCurrency;
  onAmountChange: (amount: number) => void;
  onUnpin: () => void;
  disabled?: boolean;
}

export const CurrencyInput = ({
  pinnedCurrency,
  onAmountChange,
  onUnpin,
  disabled = false
}: CurrencyInputProps) => {
  const [inputValue, setInputValue] = useState('');

  // Update local input value when amount changes externally
  useEffect(() => {
    if (pinnedCurrency.amount === 0) {
      setInputValue('');
    } else {
      // Always show formatted display with commas
      setInputValue(formatForDisplay(pinnedCurrency.amount));
    }
  }, [pinnedCurrency.amount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Remove all non-digit characters except decimal point
    const cleanValue = rawValue.replace(/[^\d.]/g, '');
    
    // Parse the clean value
    const numericValue = cleanValue === '' ? 0 : parseFloat(cleanValue);
    
    // Format the display value with commas
    const formattedValue = cleanValue === '' ? '' : formatForDisplay(numericValue);
    
    setInputValue(formattedValue);
    
    if (!isNaN(numericValue)) {
      onAmountChange(numericValue);
    }
  };

  const { currency } = pinnedCurrency;

  return (
    <Card className="relative transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        {/* Remove button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onUnpin}
          className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Remove ${currency.name}`}
        >
          <X size={16} />
        </Button>

        {/* Currency header */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currency.flag}</span>
          <div>
            <div className="font-semibold text-foreground">{currency.code}</div>
            <div className="text-sm text-muted-foreground">{currency.name}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Amount input */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium z-10">
            {currency.symbol}
          </span>
          
          <Input
            type="text"
            value={inputValue}
            onChange={handleAmountChange}
            disabled={disabled}
            className="pl-8 text-lg font-medium h-12"
            placeholder="0.00000"
          />
        </div>
      </CardContent>
    </Card>
  );
};
