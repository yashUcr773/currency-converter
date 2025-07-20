import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { PinnedCurrency } from '../types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatForDisplay, onNumberSystemChange } from '../utils/formatNumber';
import type { NumberSystem } from '../utils/numberSystem';

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
  const [numberSystem, setNumberSystem] = useState<NumberSystem>('international');

  // Listen for number system changes and calculator results
  useEffect(() => {
    const unsubscribe = onNumberSystemChange((system) => {
      setNumberSystem(system);
    });
    
    const handleCalculatorResult = (event: CustomEvent<{ value: number; targetCurrency: string }>) => {
      // Apply calculator result only if this currency input matches the target currency code
      const { value, targetCurrency } = event.detail;
      if (!isNaN(value) && pinnedCurrency.currency.code === targetCurrency) {
        onAmountChange(value);
      }
    };
    
    // Get initial value
    const saved = localStorage.getItem('number-system-preference');
    if (saved === 'indian' || saved === 'international') {
      setNumberSystem(saved);
    }
    
    window.addEventListener('calculatorResult', handleCalculatorResult as EventListener);
    
    return () => {
      unsubscribe();
      window.removeEventListener('calculatorResult', handleCalculatorResult as EventListener);
    };
  }, [onAmountChange, pinnedCurrency.currency.code]);

  // Update local input value when amount or number system changes
  useEffect(() => {
    if (pinnedCurrency.amount === 0) {
      setInputValue('');
    } else {
      // Always show formatted display with commas in selected number system
      setInputValue(formatForDisplay(pinnedCurrency.amount, numberSystem));
    }
  }, [pinnedCurrency.amount, numberSystem]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Remove all non-digit characters except decimal point
    const cleanValue = rawValue.replace(/[^\d.]/g, '');
    
    // Parse the clean value
    const numericValue = cleanValue === '' ? 0 : parseFloat(cleanValue);
    
    // Format the display value with commas in the selected number system
    const formattedValue = cleanValue === '' ? '' : formatForDisplay(numericValue, numberSystem);
    
    setInputValue(formattedValue);
    
    if (!isNaN(numericValue)) {
      onAmountChange(numericValue);
    }
  };

  const { currency } = pinnedCurrency;

  return (
    <Card className="group relative overflow-hidden bg-white/95 backdrop-blur-md border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 touch-manipulation h-full flex flex-col rounded-xl">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-white/30 to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardHeader className="relative z-10 p-2.5 pb-1.5 sm:p-3 sm:pb-2 flex-shrink-0">
        {/* Remove button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onUnpin}
          className="absolute -top-2 right-4 h-6 w-6 opacity-90 hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:text-red-600 rounded-full bg-white/90 shadow-sm hover:shadow-md hover:scale-105 touch-manipulation z-20"
          aria-label={`Remove ${currency.name}`}
        >
          <X size={12} />
        </Button>

        {/* Currency header */}
        <div className="flex items-start gap-2 sm:gap-3 pr-8">
          {/* Flag container */}
          <div className="flex-shrink-0">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg sm:rounded-xl border border-slate-300/50 shadow-sm group-hover:shadow-md transition-all duration-300">
              <span className="text-base sm:text-lg">{currency.flag}</span>
            </div>
          </div>
          
          {/* Currency info */}
          <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h3 className="font-bold text-xs sm:text-sm text-slate-800 tracking-tight truncate">
                {currency.code}
              </h3>
              {currency.code === baseCurrency && (
                <div className="inline-flex items-center gap-0.5 bg-emerald-100 border border-emerald-200 px-1 py-0.5 sm:px-1.5 rounded-sm sm:rounded-md">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-emerald-700">BASE</span>
                </div>
              )}
            </div>
            
            <p className="text-xs text-slate-600 font-medium truncate leading-tight">
              {currency.name}
            </p>
          </div>
        </div>
        
        {/* Conversion rate on separate line */}
        {conversionRate !== null && currency.code !== baseCurrency && (
          <div className="mt-2 sm:mt-3">
            <button
              onClick={onSetBaseCurrency}
              className="group/rate inline-flex items-center gap-1 text-xs font-medium bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 px-2 py-1 rounded-md sm:rounded-lg transition-all duration-200 hover:shadow-sm hover:scale-105 touch-manipulation"
              title={`Click to use ${currency.code} as base currency for all rates`}
            >
              <span className="text-slate-500 text-xs">{baseCurrency}</span>
              <span className="text-blue-600 text-xs">→</span>
              <span className="font-semibold text-blue-700 text-xs">{conversionRate?.toFixed(4)}</span>
              <span className="text-slate-400 group-hover/rate:text-blue-500 transition-colors text-xs">🔄</span>
            </button>
          </div>
        )}
      </CardHeader>

      <CardContent className="relative z-10 p-2.5 pt-1 sm:p-3 sm:pt-1 flex-1 flex flex-col justify-end">
        {/* Amount input */}
        <div className="relative">
          {/* Currency symbol */}
          <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 z-10">
            <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded-md sm:rounded-lg shadow-sm">
              <span className="text-slate-700 font-bold text-xs">
                {currency.symbol}
              </span>
            </div>
          </div>
          
          <Input
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={handleAmountChange}
            disabled={disabled}
            className="pl-10 pr-2.5 sm:pl-12 sm:pr-3 text-sm sm:text-base font-bold h-10 sm:h-12 bg-gradient-to-r from-slate-50/80 to-white border border-slate-200/80 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 hover:border-slate-300 transition-all duration-300 text-slate-800 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md focus:shadow-lg backdrop-blur-sm placeholder:text-slate-400"
            placeholder="0.00"
          />
        </div>
      </CardContent>
    </Card>
  );
};
