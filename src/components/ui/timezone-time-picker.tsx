import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, ChevronDown, X } from 'lucide-react';
import { convertUtcToTimezone } from '../../utils/timezoneUtils';

export interface TimezoneTimePickerProps {
  /** The timezone value (e.g., 'America/New_York') */
  timezoneValue: string;
  /** Custom set time. If null, shows current time for the timezone */
  setTime?: Date | null;
  /** Callback when time changes */
  onTimeChange: (hour: number, minute: number, ampm: 'AM' | 'PM') => void;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** CSS class name for styling */
  className?: string;
  /** Optional label for the picker */
  label?: string;
  /** Whether to show manual input field */
  showManualInput?: boolean;
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost';
  /** Button size */
  size?: 'sm' | 'default' | 'lg';
}

interface TimeState {
  hour: number;
  minute: number;
  ampm: 'AM' | 'PM';
}

/**
 * Reusable timezone-aware time picker component
 * Supports both dropdown selection and manual input
 * Can show current time or a custom set time
 */
export const TimezoneTimePicker: React.FC<TimezoneTimePickerProps> = ({
  timezoneValue,
  setTime = null,
  onTimeChange,
  disabled = false,
  className = '',
  label,
  showManualInput = true,
  variant = 'outline',
  size = 'default'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isCustomTimeMode, setIsCustomTimeMode] = useState(false);
  const [hasUserSetTime, setHasUserSetTime] = useState(false);

  // Get initial time for the timezone
  const getInitialTime = useCallback((): TimeState => {
    try {
      const now = new Date();
      const displayTime = new Date(now.toLocaleString('en-US', { 
        timeZone: timezoneValue 
      }));
      const hours = displayTime.getHours();
      const minutes = displayTime.getMinutes();
      const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const ampm: 'AM' | 'PM' = hours >= 12 ? 'PM' : 'AM';
      return { hour: hour12, minute: minutes, ampm };
    } catch (error) {
      console.error(`Error getting initial time for ${timezoneValue}:`, error);
      return { hour: 12, minute: 0, ampm: 'AM' };
    }
  }, [timezoneValue]);

  const [selectedTime, setSelectedTime] = useState<TimeState>(getInitialTime);

  // Get current display time
  const getCurrentDisplayTime = useCallback((): Date => {
    if (setTime) {
      // If setTime is already a timezone-converted time, use it directly
      return setTime;
    } else {
      // Get current time in this timezone
      try {
        const now = new Date();
        return convertUtcToTimezone(now, timezoneValue);
      } catch (error) {
        console.error(`Error getting current time for ${timezoneValue}:`, error);
        return new Date();
      }
    }
  }, [setTime, timezoneValue]);

  // Format time for display
  const formatTimeForDisplay = (date: Date): { timeString: string; dateString: string; isNextDay: boolean; isPrevDay: boolean } => {
    const timeString = date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit'
    });

    const dateString = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    // Check if it's a different day from current local time
    const now = new Date();
    const localDay = now.getDate();
    const timezoneDay = date.getDate();
    const isNextDay = timezoneDay > localDay;
    const isPrevDay = timezoneDay < localDay;

    return { timeString, dateString, isNextDay, isPrevDay };
  };

  // Update selected time when setTime or timezone changes
  useEffect(() => {
    if (!isUserInteracting) {
      if (setTime) {
        // Convert setTime to display format
        const displayTime = getCurrentDisplayTime();
        const hours = displayTime.getHours();
        const minutes = displayTime.getMinutes();
        const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        const ampm: 'AM' | 'PM' = hours >= 12 ? 'PM' : 'AM';
        
        setSelectedTime({ hour: hour12, minute: minutes, ampm });
        setIsCustomTimeMode(true);
      } else if (!hasUserSetTime) {
        // Update from current time only if user hasn't set custom time
        setSelectedTime(getInitialTime());
      }
    }
  }, [setTime, timezoneValue, isUserInteracting, hasUserSetTime, getInitialTime, getCurrentDisplayTime]);

  // Reset custom time mode when setTime becomes null
  useEffect(() => {
    if (setTime === null) {
      setIsCustomTimeMode(false);
      setHasUserSetTime(false);
    }
  }, [setTime]);

  // Auto-update current time when not in custom mode
  useEffect(() => {
    if (!isCustomTimeMode && !hasUserSetTime && !isUserInteracting) {
      const interval = setInterval(() => {
        setSelectedTime(getInitialTime());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isCustomTimeMode, hasUserSetTime, isUserInteracting, getInitialTime]);

  // Utility functions for time conversion (kept for potential future use)
  // const to24Hour = (hours12: number, period: string): number => {
  //   if (period === 'AM') {
  //     return hours12 === 12 ? 0 : hours12;
  //   } else {
  //     return hours12 === 12 ? 12 : hours12 + 12;
  //   }
  // };

  const validateAndParseInput = (input: string): boolean => {
    const trimmed = input.trim().toLowerCase();
    
    // 24-hour format: HH:MM or H:MM
    if (/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(trimmed)) {
      const [h, m] = trimmed.split(':').map(Number);
      const hours12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const period = h >= 12 ? 'PM' : 'AM';
      
      setSelectedTime({ hour: hours12, minute: m, ampm: period });
      return true;
    }
    
    // 12-hour format with AM/PM
    const ampmMatch = trimmed.match(/^([1-9]|1[0-2]):([0-5][0-9])\s*(am|pm)$/);
    if (ampmMatch) {
      const hours = parseInt(ampmMatch[1]);
      const minutes = parseInt(ampmMatch[2]);
      const period = ampmMatch[3].toUpperCase() as 'AM' | 'PM';
      
      setSelectedTime({ hour: hours, minute: minutes, ampm: period });
      return true;
    }
    
    return false;
  };

  const handleTimeSet = () => {
    setHasUserSetTime(true);
    setIsCustomTimeMode(true);
    
    // The onTimeChange callback expects the hour/minute/ampm to represent
    // the time in the specific timezone, which is exactly what we have
    onTimeChange(selectedTime.hour, selectedTime.minute, selectedTime.ampm);
    
    setIsOpen(false);
    setTimeout(() => setIsUserInteracting(false), 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsUserInteracting(true);
    
    // Try to parse and update dropdowns in real-time
    if (validateAndParseInput(value)) {
      // validateAndParseInput already updates selectedTime, so dropdowns will sync
      // Don't call handleTimeSet() immediately - let user finish typing
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (validateAndParseInput(inputValue)) {
        handleTimeSet();
      }
    }
  };

  const handleDropdownChange = (field: 'hour' | 'minute' | 'ampm', value: number | string) => {
    setIsUserInteracting(true);
    
    // Update selectedTime state
    const newSelectedTime = { ...selectedTime };
    if (field === 'hour') newSelectedTime.hour = value as number;
    if (field === 'minute') newSelectedTime.minute = value as number;
    if (field === 'ampm') newSelectedTime.ampm = value as 'AM' | 'PM';
    
    setSelectedTime(newSelectedTime);
    
    // Sync input field to match dropdown selection
    const timeString = `${newSelectedTime.hour}:${newSelectedTime.minute.toString().padStart(2, '0')} ${newSelectedTime.ampm}`;
    setInputValue(timeString);
  };

  const handleInputBlur = () => {
    setIsUserInteracting(false);
    
    // If the input has valid content, set the time
    if (inputValue && validateAndParseInput(inputValue)) {
      handleTimeSet();
    } else {
      // Clear invalid input
      setInputValue('');
    }
  };

  const displayTime = getCurrentDisplayTime();
  const { timeString, isNextDay, isPrevDay } = formatTimeForDisplay(displayTime);

  // Generate options
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant={variant}
            size={size}
            disabled={disabled}
            className={`w-full justify-between text-left font-normal ${
              !selectedTime ? 'text-muted-foreground' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium">{timeString}</span>
              {(isNextDay || isPrevDay) && (
                <span className="text-xs text-slate-400">
                  {isNextDay ? '+1' : '-1'}
                </span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-slate-700">Set Time</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Manual Input */}
            {showManualInput && (
              <div className="space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
                <label className="text-xs font-medium text-gray-600">
                  Type time (e.g., 2:30 PM or 14:30)
                </label>
                <Input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  onBlur={handleInputBlur}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleInputBlur();
                    }
                  }}
                  placeholder="9:00 AM or 21:00"
                  className="text-sm"
                />
              </div>
            )}
            
            {/* Dropdown Selectors */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-gray-600">
                Or select from dropdowns
              </label>
              
              <div className="grid grid-cols-3 gap-3">
                {/* Hour Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600">Hour</label>
                  <select
                    value={selectedTime.hour}
                    onChange={(e) => {
                      handleDropdownChange('hour', Number(e.target.value));
                    }}
                    onFocus={() => setIsUserInteracting(true)}
                    className="w-full p-2 border border-slate-200 rounded-md text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  >
                    {hours.map(hour => (
                      <option key={hour} value={hour}>{hour}</option>
                    ))}
                  </select>
                </div>

                {/* Minute Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600">Minute</label>
                  <select
                    value={selectedTime.minute}
                    onChange={(e) => {
                      handleDropdownChange('minute', Number(e.target.value));
                    }}
                    onFocus={() => setIsUserInteracting(true)}
                    className="w-full p-2 border border-slate-200 rounded-md text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  >
                    {minutes.map(minute => (
                      <option key={minute} value={minute}>
                        {minute.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* AM/PM Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600">Period</label>
                  <select
                    value={selectedTime.ampm}
                    onChange={(e) => {
                      handleDropdownChange('ampm', e.target.value);
                    }}
                    onFocus={() => setIsUserInteracting(true)}
                    className="w-full p-2 border border-slate-200 rounded-md text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={handleTimeSet}
                className="flex-1 h-9 text-sm"
              >
                Set Time
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsUserInteracting(false);
                  setIsOpen(false);
                }}
                className="flex-1 h-9 text-sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TimezoneTimePicker;
