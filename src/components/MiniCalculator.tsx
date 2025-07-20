import { useState, useEffect } from 'react';
import { Calculator, X, Divide, Plus, Minus, Equal, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface MiniCalculatorProps {
  onResult?: (value: number) => void;
  pinnedCurrencies?: Array<{ currency: { code: string; name: string; symbol: string } }>;
}

export const MiniCalculator = ({ onResult, pinnedCurrencies = [] }: MiniCalculatorProps) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(pinnedCurrencies[0]?.currency.code || '');

  // Update selected currency when pinned currencies change
  useEffect(() => {
    if (pinnedCurrencies.length > 0 && !pinnedCurrencies.find(p => p.currency.code === selectedCurrency)) {
      setSelectedCurrency(pinnedCurrencies[0].currency.code);
    }
  }, [pinnedCurrencies, selectedCurrency]);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(newValue.toString());
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(newValue.toString());
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
      
      // Send result to parent component if callback provided
      if (onResult) {
        onResult(newValue);
      }
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const useResult = () => {
    const value = parseFloat(display);
    if (!isNaN(value)) {
      setIsOpen(false);
      
      // Broadcast globally with selected currency code for any component to pick up
      window.dispatchEvent(new CustomEvent('calculatorResult', { 
        detail: { 
          value, 
          timestamp: Date.now(),
          formatted: display,
          targetCurrency: selectedCurrency
        } 
      }));

      // Also call onResult callback if provided
      if (onResult) {
        onResult(value);
      }
    }
  };

  const ButtonStyle = "w-full h-10 sm:h-12 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 px-2 py-1 text-xs"
          title="Open Calculator"
        >
          <Calculator className="w-3 h-3" />
          <span className="hidden sm:inline">Calc</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="w-[95vw] max-w-sm mx-auto bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-700">
            <Calculator className="w-4 h-4" />
            Mini Calculator
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Display */}
          <div className="bg-slate-100 rounded-xl p-3 text-right">
            <div className="text-xl sm:text-2xl font-mono font-bold text-slate-800 break-all">
              {display}
            </div>
            {operation && previousValue !== null && (
              <div className="text-xs text-slate-500 mt-1">
                {previousValue} {operation} ...
              </div>
            )}
          </div>

          {/* Currency Selection */}
          {pinnedCurrencies.length > 0 && (
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-sm font-medium text-slate-700 mb-2">Apply result to:</div>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {pinnedCurrencies.map((pinnedCurrency) => (
                  <option key={pinnedCurrency.currency.code} value={pinnedCurrency.currency.code}>
                    {pinnedCurrency.currency.symbol} {pinnedCurrency.currency.code} - {pinnedCurrency.currency.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Buttons Grid */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {/* Row 1 */}
            <button
              onClick={clear}
              className={`${ButtonStyle} bg-red-100 hover:bg-red-200 text-red-700 col-span-2`}
            >
              Clear
            </button>
            <button
              onClick={() => inputOperation('÷')}
              className={`${ButtonStyle} bg-blue-100 hover:bg-blue-200 text-blue-700`}
            >
              <Divide className="w-3 h-3 sm:w-4 sm:h-4 mx-auto" />
            </button>
            <button
              onClick={() => inputOperation('×')}
              className={`${ButtonStyle} bg-blue-100 hover:bg-blue-200 text-blue-700`}
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 mx-auto" />
            </button>

            {/* Row 2 */}
            <button onClick={() => inputNumber('7')} className={`${ButtonStyle} bg-gray-100 hover:bg-gray-200 text-gray-800`}>7</button>
            <button onClick={() => inputNumber('8')} className={`${ButtonStyle} bg-gray-100 hover:bg-gray-200 text-gray-800`}>8</button>
            <button onClick={() => inputNumber('9')} className={`${ButtonStyle} bg-gray-100 hover:bg-gray-200 text-gray-800`}>9</button>
            <button
              onClick={() => inputOperation('-')}
              className={`${ButtonStyle} bg-blue-100 hover:bg-blue-200 text-blue-700`}
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4 mx-auto" />
            </button>

            {/* Row 3 */}
            <button onClick={() => inputNumber('4')} className={`${ButtonStyle} bg-gray-100 hover:bg-gray-200 text-gray-800`}>4</button>
            <button onClick={() => inputNumber('5')} className={`${ButtonStyle} bg-gray-100 hover:bg-gray-200 text-gray-800`}>5</button>
            <button onClick={() => inputNumber('6')} className={`${ButtonStyle} bg-gray-100 hover:bg-gray-200 text-gray-800`}>6</button>
            <button
              onClick={() => inputOperation('+')}
              className={`${ButtonStyle} bg-blue-100 hover:bg-blue-200 text-blue-700`}
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mx-auto" />
            </button>

            {/* Row 4 */}
            <button onClick={() => inputNumber('1')} className={`${ButtonStyle} bg-gray-100 hover:bg-gray-200 text-gray-800`}>1</button>
            <button onClick={() => inputNumber('2')} className={`${ButtonStyle} bg-gray-100 hover:bg-gray-200 text-gray-800`}>2</button>
            <button onClick={() => inputNumber('3')} className={`${ButtonStyle} bg-gray-100 hover:bg-gray-200 text-gray-800`}>3</button>
            <button
              onClick={performCalculation}
              className={`${ButtonStyle} bg-green-100 hover:bg-green-200 text-green-700 row-span-2`}
            >
              <Equal className="w-3 h-3 sm:w-4 sm:h-4 mx-auto" />
            </button>

            {/* Row 5 */}
            <button onClick={() => inputNumber('0')} className={`${ButtonStyle} bg-gray-100 hover:bg-gray-200 text-gray-800 col-span-2`}>0</button>
            <button onClick={inputDecimal} className={`${ButtonStyle} bg-gray-100 hover:bg-gray-200 text-gray-800`}>.</button>
          </div>

          {/* Use Result Button */}
          <Button
            onClick={useResult}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 py-2.5 sm:py-3"
            disabled={isNaN(parseFloat(display)) || !selectedCurrency || pinnedCurrencies.length === 0}
          >
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-sm sm:text-base">
              {pinnedCurrencies.length === 0 ? (
                'Pin currencies first'
              ) : selectedCurrency ? (
                <>Apply {display} to {pinnedCurrencies.find(p => p.currency.code === selectedCurrency)?.currency.code || selectedCurrency}</>
              ) : (
                'Select a currency first'
              )}
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
