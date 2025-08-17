import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, ChevronDown, X } from 'lucide-react';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  required?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  required = false,
  className = "",
  label,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  // Parse value to get initial state
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hours: 9, minutes: 0, period: 'AM' };
    
    const [h, m] = timeStr.split(':').map(Number);
    const hours12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const period = h >= 12 ? 'PM' : 'AM';
    
    return {
      hours: hours12,
      minutes: m || 0,
      period
    };
  };

  const [selectedTime, setSelectedTime] = useState(() => parseTime(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedTime(parseTime(value));
    setInputValue(value ? formatDisplayTime(value) : '');
  }, [value]);

  // Convert to 24-hour format for storage
  const to24Hour = (hours12: number, period: string): number => {
    if (period === 'AM') {
      return hours12 === 12 ? 0 : hours12;
    } else {
      return hours12 === 12 ? 12 : hours12 + 12;
    }
  };

  // Convert to display format (12-hour)
  const formatDisplayTime = (timeStr: string): string => {
    if (!timeStr) return '';
    
    const [h, m] = timeStr.split(':').map(Number);
    const hours12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const period = h >= 12 ? 'PM' : 'AM';
    
    return `${hours12}:${m.toString().padStart(2, '0')} ${period}`;
  };

  // Format time for storage (24-hour)
  const formatTime = (hours: number, minutes: number, period: string): string => {
    const hours24 = to24Hour(hours, period);
    return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const validateAndParseInput = (input: string): boolean => {
    const trimmed = input.trim().toLowerCase();
    
    // 24-hour format: HH:MM or H:MM
    if (/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(trimmed)) {
      const [h, m] = trimmed.split(':').map(Number);
      const hours12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const period = h >= 12 ? 'PM' : 'AM';
      
      setSelectedTime({ hours: hours12, minutes: m, period });
      onChange(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      return true;
    }
    
    // 12-hour format with AM/PM
    const ampmMatch = trimmed.match(/^([1-9]|1[0-2]):([0-5][0-9])\s*(am|pm)$/);
    if (ampmMatch) {
      const hours = parseInt(ampmMatch[1]);
      const minutes = parseInt(ampmMatch[2]);
      const period = ampmMatch[3].toUpperCase();
      
      setSelectedTime({ hours, minutes, period });
      const formatted = formatTime(hours, minutes, period);
      onChange(formatted);
      return true;
    }
    
    // Simple hour format: H am/pm or H:MM am/pm
    const simpleMatch = trimmed.match(/^([1-9]|1[0-2])(?::([0-5][0-9]))?\s*(am|pm)$/);
    if (simpleMatch) {
      const hours = parseInt(simpleMatch[1]);
      const minutes = parseInt(simpleMatch[2] || '0');
      const period = simpleMatch[3].toUpperCase();
      
      setSelectedTime({ hours, minutes, period });
      const formatted = formatTime(hours, minutes, period);
      onChange(formatted);
      return true;
    }
    
    return false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setInputValue(input);
  };

  const handleInputBlur = () => {
    if (inputValue && validateAndParseInput(inputValue)) {
      setInputValue(formatDisplayTime(value));
    } else if (inputValue && inputValue !== formatDisplayTime(value)) {
      // Reset to previous valid value if invalid
      setInputValue(formatDisplayTime(value));
    }
  };

  const handleTimeSelect = (hours: number, minutes: number, period: string) => {
    setSelectedTime({ hours, minutes, period });
    const formatted = formatTime(hours, minutes, period);
    onChange(formatted);
    setInputValue(formatDisplayTime(formatted));
    setIsOpen(false);
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ['AM', 'PM'];

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={`w-full justify-between h-10 px-3 text-left font-normal ${
              error ? 'border-red-500 focus:border-red-500' : ''
            } ${!value ? 'text-gray-400' : ''}`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className={!value ? 'text-gray-400' : 'text-gray-900'}>
                {value ? formatDisplayTime(value) : 'Select time'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Set Time
              </div>
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
            
            {/* Manual Input Section */}
            <div className="space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
              <label className="text-xs font-medium text-gray-600">
                Type time (e.g., 2:30 PM or 14:30)
              </label>
              <Input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
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

            {/* Dropdown Selectors */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-gray-600">
                Or select from dropdowns
              </label>
              
              <div className="grid grid-cols-3 gap-3">
                {/* Hours */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600">Hour</label>
                  <select
                    value={selectedTime.hours}
                    onChange={(e) => handleTimeSelect(
                      parseInt(e.target.value),
                      selectedTime.minutes,
                      selectedTime.period
                    )}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {hours.map(hour => (
                      <option key={hour} value={hour}>{hour}</option>
                    ))}
                  </select>
                </div>

                {/* Minutes */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600">Min</label>
                  <select
                    value={selectedTime.minutes}
                    onChange={(e) => handleTimeSelect(
                      selectedTime.hours,
                      parseInt(e.target.value),
                      selectedTime.period
                    )}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {minutes.map(minute => (
                      <option key={minute} value={minute}>
                        {minute.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* AM/PM */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600">Period</label>
                  <select
                    value={selectedTime.period}
                    onChange={(e) => handleTimeSelect(
                      selectedTime.hours,
                      selectedTime.minutes,
                      e.target.value
                    )}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {periods.map(period => (
                      <option key={period} value={period}>{period}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date();
                  const hours12 = now.getHours() === 0 ? 12 : now.getHours() > 12 ? now.getHours() - 12 : now.getHours();
                  const period = now.getHours() >= 12 ? 'PM' : 'AM';
                  const minutes = now.getMinutes(); // Use exact minutes, no rounding
                  
                  handleTimeSelect(hours12, minutes, period);
                }}
                className="w-full text-xs"
              >
                Now
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {error && (
        <div className="text-red-600 text-sm flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
};
