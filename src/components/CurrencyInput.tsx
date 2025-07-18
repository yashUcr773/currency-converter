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
  conversionRate?: number | null;
  baseCurrency?: string;
  onSetBaseCurrency?: () => void;
}

export const CurrencyInput = ({
  pinnedCurrency,
  onAmountChange,
  onUnpin,
  disabled = false,
  conversionRate,
  baseCurrency = 'USD',
  onSetBaseCurrency
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
    <Card className="group relative transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border border-slate-200">
      <CardHeader className="pb-4">
        {/* Remove button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onUnpin}
          className="absolute top-3 right-3 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:text-red-600 rounded-lg"
          aria-label={`Remove ${currency.name}`}
        >
          <X size={14} />
        </Button>

        {/* Currency header */}
        <div className="flex items-center gap-3">
          <div className="text-3xl p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-slate-200">
            {currency.flag}
          </div>
          <div className="flex-1">
            <div className="font-bold text-lg text-slate-800">{currency.code}</div>
            <div className="text-sm text-slate-600 font-medium">{currency.name}</div>
            {conversionRate !== null && currency.code !== baseCurrency && (
              <button
                onClick={onSetBaseCurrency}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-1 hover:underline transition-all duration-200 flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded-lg -mx-2"
                title={`Click to use ${currency.code} as base currency for all rates`}
              >
                <span className="text-slate-500">1 {baseCurrency} =</span>
                <span className="font-bold">{conversionRate?.toFixed(4)} {currency.code}</span>
                <span className="text-slate-400 group-hover:text-blue-500 transition-colors">🔄</span>
              </button>
            )}
            {currency.code === baseCurrency && (
              <div className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg -mx-2">
                <span>📈</span>
                <span>Base Currency (rates shown relative to this)</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Amount input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-bold text-lg z-10">
            {currency.symbol}
          </div>
          
          <Input
            type="text"
            value={inputValue}
            onChange={handleAmountChange}
            disabled={disabled}
            className="pl-12 pr-4 text-xl font-bold h-14 bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 text-slate-800 rounded-xl"
            placeholder="0.00000"
          />
        </div>
      </CardContent>
    </Card>
  );
};
