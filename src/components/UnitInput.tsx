import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { PinnedUnit } from '../hooks/useUnitConverter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UnitConverter } from '../utils/unitConverter';

interface UnitInputProps {
  pinnedUnit: PinnedUnit;
  onValueChange: (value: number) => void;
  onUnpin: () => void;
  disabled?: boolean;
}

export const UnitInput = ({
  pinnedUnit,
  onValueChange,
  onUnpin,
  disabled = false
}: UnitInputProps) => {
  const [inputValue, setInputValue] = useState('');

  // Update local input value when value changes externally
  useEffect(() => {
    if (pinnedUnit.value === 0) {
      setInputValue('');
    } else {
      setInputValue(UnitConverter.formatValue(pinnedUnit.value));
    }
  }, [pinnedUnit.value]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Allow empty input
    if (rawValue === '') {
      setInputValue('');
      onValueChange(0);
      return;
    }
    
    // Remove all non-digit characters except decimal point and minus sign
    const cleanValue = rawValue.replace(/[^\d.-]/g, '');
    
    // Parse the clean value
    const numericValue = cleanValue === '' ? 0 : parseFloat(cleanValue);
    
    setInputValue(cleanValue);
    
    if (!isNaN(numericValue)) {
      onValueChange(numericValue);
    }
  };

  const { unit, categoryId } = pinnedUnit;
  const category = UnitConverter.getCategory(categoryId);

  return (
    <Card className="group relative overflow-hidden bg-card/95 backdrop-blur-md border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 touch-manipulation h-full flex flex-col rounded-xl">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background/30 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardHeader className="relative z-10 p-2.5 pb-1.5 sm:p-3 sm:pb-2 flex-shrink-0">
        {/* Remove button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onUnpin}
          className="absolute -top-2 right-4 h-6 w-6 opacity-90 hover:opacity-100 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive rounded-full bg-background/90 shadow-sm hover:shadow-md hover:scale-105 touch-manipulation z-20"
          aria-label={`Remove ${unit.name}`}
        >
          <X size={12} />
        </Button>

        {/* Unit header */}
        <div className="flex items-start gap-2 sm:gap-3 pr-8">
          {/* Icon container */}
          <div className="flex-shrink-0">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg sm:rounded-xl border border-slate-300/50 shadow-sm group-hover:shadow-md transition-all duration-300">
              <span className="text-base sm:text-lg">{category?.icon || '📐'}</span>
            </div>
          </div>
          
          {/* Unit info */}
          <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h3 className="font-bold text-xs sm:text-sm text-foreground tracking-tight truncate">
                {unit.symbol}
              </h3>
            </div>
            
            <p className="text-xs text-muted-foreground font-medium truncate leading-tight">
              {unit.name}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 p-2.5 pt-1 sm:p-3 sm:pt-1 flex-1 flex flex-col justify-end">
        {/* Value input */}
        <div className="relative">
          {/* Unit symbol */}
          <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 z-10">
            <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
              {unit.symbol}
            </span>
          </div>
          
          <Input
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={handleValueChange}
            disabled={disabled}
            className="pl-8 sm:pl-10 pr-3 sm:pr-4 text-base sm:text-lg font-bold h-10 sm:h-12 bg-background/80 border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-200 text-foreground rounded-lg sm:rounded-xl touch-manipulation"
            placeholder="0"
          />
        </div>
      </CardContent>
    </Card>
  );
};
