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
    <Card className="group relative transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border border-slate-200 touch-manipulation">
      <CardHeader className="pb-1.5 sm:pb-2 lg:pb-3 p-2 sm:p-3 lg:p-6">
        {/* Remove button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onUnpin}
          className="absolute top-1 sm:top-1.5 lg:top-2 right-1 sm:right-1.5 lg:right-2 h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 p-0 opacity-60 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:text-red-600 rounded-md sm:rounded-lg touch-manipulation"
          aria-label={`Remove ${currency.name}`}
        >
          <X size={10} className="sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5" />
        </Button>

        {/* Currency header */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
          <div className="text-base sm:text-lg lg:text-2xl xl:text-3xl p-1 sm:p-1.5 lg:p-2 xl:p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-md sm:rounded-lg lg:rounded-xl border border-slate-200">
            {currency.flag}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-xs sm:text-sm lg:text-base xl:text-lg text-slate-800">{currency.code}</div>
            <div className="text-xs sm:text-xs lg:text-sm text-slate-600 font-medium truncate leading-tight">{currency.name}</div>
            {conversionRate !== null && currency.code !== baseCurrency && (
              <button
                onClick={onSetBaseCurrency}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-0.5 hover:underline transition-all duration-200 flex items-center gap-0.5 sm:gap-1 hover:bg-blue-50 px-1 sm:px-1.5 lg:px-2 py-0.5 rounded-sm sm:rounded-md lg:rounded-lg -mx-1 sm:-mx-1.5 lg:-mx-2 touch-manipulation"
                title={`Click to use ${currency.code} as base currency for all rates`}
              >
                <span className="text-slate-500 text-xs">{baseCurrency}→</span>
                <span className="font-bold text-xs">{conversionRate?.toFixed(4)} {currency.code}</span>
                <span className="text-slate-400 group-hover:text-blue-500 transition-colors text-xs">🔄</span>
              </button>
            )}
            {currency.code === baseCurrency && (
              <div className="text-xs text-green-600 font-bold mt-0.5 flex items-center gap-0.5 sm:gap-1 bg-green-50 px-1 sm:px-1.5 lg:px-2 py-0.5 rounded-sm sm:rounded-md lg:rounded-lg -mx-1 sm:-mx-1.5 lg:-mx-2">
                <span className="text-xs">📈</span>
                <span className="text-xs">Base</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 sm:pt-1 lg:pt-2 p-2 sm:p-3 lg:p-6">
        {/* Amount input */}
        <div className="relative">
          <div className="absolute left-2 sm:left-2.5 lg:left-3 xl:left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-bold text-xs sm:text-sm lg:text-base xl:text-lg z-10">
            {currency.symbol}
          </div>
          
          <Input
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={handleAmountChange}
            disabled={disabled}
            className="pl-6 sm:pl-8 lg:pl-10 xl:pl-12 pr-2 sm:pr-3 lg:pr-4 text-sm sm:text-base lg:text-lg xl:text-xl font-bold h-8 sm:h-10 lg:h-12 xl:h-14 bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 text-slate-800 rounded-md sm:rounded-lg lg:rounded-xl touch-manipulation"
            placeholder="0.00000"
          />
        </div>
      </CardContent>
    </Card>
  );
};
