import { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';

interface TimezoneTimeInputProps {
  timezoneValue: string;
  setTime?: Date | null; // The custom set time, null means show current time
  onTimeChange: (timeString: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Static input component for timezone time - doesn't re-render on timer
 * Only updates when user types or timezone changes
 */
export const TimezoneTimeInput = ({ 
  timezoneValue, 
  setTime = null,
  onTimeChange, 
  disabled = false,
  placeholder = "Enter time..."
}: TimezoneTimeInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isCustomTime, setIsCustomTime] = useState(false);

  const formatTimeForDisplay = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentTimeForTimezone = useCallback((): string => {
    try {
      const now = new Date();
      const timeInTimezone = new Date(now.toLocaleString('en-US', { 
        timeZone: timezoneValue 
      }));
      return formatTimeForDisplay(timeInTimezone);
    } catch (error) {
      console.error(`Error getting current time for ${timezoneValue}:`, error);
      return formatTimeForDisplay(new Date());
    }
  }, [timezoneValue]);

  const getDisplayTime = useCallback((): string => {
    if (setTime) {
      // Show the converted set time in this timezone
      try {
        const timeInThisZone = new Date(setTime.toLocaleString('en-US', { 
          timeZone: timezoneValue 
        }));
        return formatTimeForDisplay(timeInThisZone);
      } catch (error) {
        console.error(`Error converting set time to ${timezoneValue}:`, error);
        return formatTimeForDisplay(setTime);
      }
    } else {
      // Show current time in this timezone
      return getCurrentTimeForTimezone();
    }
  }, [setTime, timezoneValue, getCurrentTimeForTimezone]);

  // Update display when timezone or setTime changes
  useEffect(() => {
    if (!isCustomTime) {
      setInputValue(getDisplayTime());
    }
  }, [getDisplayTime, isCustomTime]);

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setIsCustomTime(true); // User is entering custom time

    // Parse time input (HH:MM format)
    const timeMatch = value.match(/^(\d{1,2}):(\d{2})$/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        onTimeChange(value); // Pass the time string to parent
      }
    }
  };

  const handleFocus = () => {
    // Show current value as editable
    if (!isCustomTime) {
      setInputValue(getDisplayTime());
    }
  };

  const handleBlur = () => {
    // If user didn't enter a valid custom time, revert to display time
    const timeMatch = inputValue.match(/^(\d{1,2}):(\d{2})$/);
    if (!timeMatch) {
      setIsCustomTime(false);
      setInputValue(getDisplayTime());
    }
  };

  return (
    <div className="relative">
      <Clock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 z-10" />
      <Input
        type="text"
        value={inputValue}
        onChange={handleTimeChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className="pl-10 pr-2.5 sm:pl-12 sm:pr-3 text-sm sm:text-base font-bold h-10 sm:h-12 bg-gradient-to-r from-slate-50/80 to-white border border-slate-200/80 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 hover:border-slate-300 transition-all duration-300 text-slate-800 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md focus:shadow-lg backdrop-blur-sm"
      />
    </div>
  );
};
