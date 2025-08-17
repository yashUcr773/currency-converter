import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar, Clock, ChevronDown, X, CalendarDays } from 'lucide-react';

interface DateTimePickerProps {
  value: string; // datetime-local format (YYYY-MM-DDTHH:MM)
  onChange: (datetime: string) => void;
  required?: boolean;
  className?: string;
  label?: string;
  error?: string;
  showTimeOnly?: boolean; // If true, only show time picker
  showDateOnly?: boolean; // If true, only show date picker
  placeholder?: string;
}

// Convert to display format
const formatDisplayDateTimeExternal = (datetimeStr: string, showTimeOnly = false, showDateOnly = false): string => {
  if (!datetimeStr) return '';
  
  try {
    const date = new Date(datetimeStr);
    if (showTimeOnly) {
      const hours12 = date.getHours() === 0 ? 12 : date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
      const period = date.getHours() >= 12 ? 'PM' : 'AM';
      return `${hours12}:${date.getMinutes().toString().padStart(2, '0')} ${period}`;
    } else if (showDateOnly) {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } else {
      const hours12 = date.getHours() === 0 ? 12 : date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
      const period = date.getHours() >= 12 ? 'PM' : 'AM';
      return `${date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })} ${hours12}:${date.getMinutes().toString().padStart(2, '0')} ${period}`;
    }
  } catch {
    return '';
  }
};

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  required = false,
  className = "",
  label,
  error,
  showTimeOnly = false,
  showDateOnly = false,
  placeholder
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  // Parse datetime-local value into date and time components
  const parseDateTime = (datetimeStr: string) => {
    if (!datetimeStr) {
      const now = new Date();
      return {
        date: now.toISOString().split('T')[0],
        hours: 9,
        minutes: 0,
        period: 'AM' as const
      };
    }
    
    const [datePart, timePart] = datetimeStr.split('T');
    const [h, m] = (timePart || '09:00').split(':').map(Number);
    const hours12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const period = h >= 12 ? 'PM' : 'AM';
    
    return {
      date: datePart || new Date().toISOString().split('T')[0],
      hours: hours12,
      minutes: m || 0,
      period
    };
  };

  const [selectedDateTime, setSelectedDateTime] = useState(() => parseDateTime(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const parsed = parseDateTime(value);
    setSelectedDateTime(parsed);
    setInputValue(value ? formatDisplayDateTimeExternal(value, showTimeOnly, showDateOnly) : '');
  }, [value, showTimeOnly, showDateOnly]);

  // Convert to 24-hour format for storage
  const to24Hour = (hours12: number, period: string): number => {
    if (period === 'AM') {
      return hours12 === 12 ? 0 : hours12;
    } else {
      return hours12 === 12 ? 12 : hours12 + 12;
    }
  };

  // Convert to display format
  const formatDisplayDateTime = (datetimeStr: string): string => {
    return formatDisplayDateTimeExternal(datetimeStr, showTimeOnly, showDateOnly);
  };

  // Format datetime for storage (datetime-local format)
  const formatDateTime = (date: string, hours: number, minutes: number, period: string): string => {
    const hours24 = to24Hour(hours, period);
    return `${date}T${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const validateAndParseInput = (input: string): boolean => {
    const trimmed = input.trim().toLowerCase();
    
    try {
      if (showTimeOnly) {
        // Parse time only
        let timeMatch = trimmed.match(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/);
        if (timeMatch) {
          const [h, m] = trimmed.split(':').map(Number);
          const hours12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
          const period = h >= 12 ? 'PM' : 'AM';
          
          setSelectedDateTime(prev => ({ ...prev, hours: hours12, minutes: m, period }));
          const formatted = formatDateTime(selectedDateTime.date, hours12, m, period);
          onChange(formatted);
          return true;
        }
        
        // 12-hour format with AM/PM
        timeMatch = trimmed.match(/^([1-9]|1[0-2]):([0-5][0-9])\s*(am|pm)$/);
        if (timeMatch) {
          const hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const period = timeMatch[3].toUpperCase();
          
          setSelectedDateTime(prev => ({ ...prev, hours, minutes, period }));
          const formatted = formatDateTime(selectedDateTime.date, hours, minutes, period);
          onChange(formatted);
          return true;
        }
      } else if (showDateOnly) {
        // Parse date only
        if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
          setSelectedDateTime(prev => ({ ...prev, date: trimmed }));
          const formatted = formatDateTime(trimmed, selectedDateTime.hours, selectedDateTime.minutes, selectedDateTime.period);
          onChange(formatted);
          return true;
        }
      } else {
        // Parse full datetime
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed)) {
          const [datePart, timePart] = trimmed.split('T');
          const [h, m] = timePart.split(':').map(Number);
          const hours12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
          const period = h >= 12 ? 'PM' : 'AM';
          
          setSelectedDateTime({ date: datePart, hours: hours12, minutes: m, period });
          onChange(trimmed);
          return true;
        }
      }
    } catch {
      return false;
    }
    
    return false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setInputValue(input);
  };

  const handleInputBlur = () => {
    if (inputValue && validateAndParseInput(inputValue)) {
      setInputValue(formatDisplayDateTime(value));
    } else if (inputValue && inputValue !== formatDisplayDateTime(value)) {
      // Reset to previous valid value if invalid
      setInputValue(formatDisplayDateTime(value));
    }
  };

  const handleDateTimeSelect = (date: string, hours: number, minutes: number, period: string) => {
    setSelectedDateTime({ date, hours, minutes, period });
    const formatted = formatDateTime(date, hours, minutes, period);
    onChange(formatted);
    setInputValue(formatDisplayDateTime(formatted));
    setIsOpen(false);
  };

  const handleQuickSelect = (type: 'now' | 'today' | 'tomorrow' | 'nextWeek') => {
    const now = new Date();
    const targetDate = new Date(now);
    
    switch (type) {
      case 'now':
        // Current date and time
        break;
      case 'today':
        targetDate.setHours(0, 0, 0, 0);
        break;
      case 'tomorrow':
        targetDate.setDate(now.getDate() + 1);
        if (showDateOnly) targetDate.setHours(0, 0, 0, 0);
        break;
      case 'nextWeek':
        targetDate.setDate(now.getDate() + 7);
        if (showDateOnly) targetDate.setHours(0, 0, 0, 0);
        break;
    }

    const date = targetDate.toISOString().split('T')[0];
    const hours12 = targetDate.getHours() === 0 ? 12 : targetDate.getHours() > 12 ? targetDate.getHours() - 12 : targetDate.getHours();
    const period = targetDate.getHours() >= 12 ? 'PM' : 'AM';
    const minutes = targetDate.getMinutes();

    handleDateTimeSelect(date, hours12, minutes, period);
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ['AM', 'PM'];

  const getPlaceholderText = () => {
    if (placeholder) return placeholder;
    if (showTimeOnly) return 'Select time';
    if (showDateOnly) return 'Select date';
    return 'Select date & time';
  };

  const getIcon = () => {
    if (showTimeOnly) return Clock;
    if (showDateOnly) return Calendar;
    return CalendarDays;
  };

  const IconComponent = getIcon();

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
              <IconComponent className="w-4 h-4 text-gray-400" />
              <span className={!value ? 'text-gray-400' : 'text-gray-900'}>
                {value ? formatDisplayDateTime(value) : getPlaceholderText()}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-96 p-0" align="start">
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                {showTimeOnly ? 'Set Time' : showDateOnly ? 'Set Date' : 'Set Date & Time'}
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
                {showTimeOnly 
                  ? 'Type time (e.g., 2:30 PM or 14:30)' 
                  : showDateOnly 
                    ? 'Type date (YYYY-MM-DD)'
                    : 'Type datetime (YYYY-MM-DDTHH:MM)'}
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
                placeholder={showTimeOnly ? "9:00 AM or 21:00" : showDateOnly ? "2025-08-09" : "2025-08-09T09:00"}
                className="text-sm"
              />
            </div>

            {!showTimeOnly && (
              <>
                {/* Date Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-medium text-gray-600">Date</label>
                  <Input
                    type="date"
                    value={selectedDateTime.date}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setSelectedDateTime(prev => ({ ...prev, date: newDate }));
                      if (showDateOnly) {
                        handleDateTimeSelect(newDate, selectedDateTime.hours, selectedDateTime.minutes, selectedDateTime.period);
                      }
                    }}
                    className="text-sm"
                  />
                </div>
              </>
            )}

            {!showDateOnly && (
              <>
                {/* Time Dropdown Selectors */}
                <div className="space-y-3">
                  <label className="text-xs font-medium text-gray-600">Time</label>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {/* Hours */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-600">Hour</label>
                      <select
                        value={selectedDateTime.hours}
                        onChange={(e) => {
                          const hours = parseInt(e.target.value);
                          setSelectedDateTime(prev => ({ ...prev, hours }));
                          if (!showTimeOnly) {
                            handleDateTimeSelect(selectedDateTime.date, hours, selectedDateTime.minutes, selectedDateTime.period);
                          }
                        }}
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
                        value={selectedDateTime.minutes}
                        onChange={(e) => {
                          const minutes = parseInt(e.target.value);
                          setSelectedDateTime(prev => ({ ...prev, minutes }));
                          if (!showTimeOnly) {
                            handleDateTimeSelect(selectedDateTime.date, selectedDateTime.hours, minutes, selectedDateTime.period);
                          }
                        }}
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
                        value={selectedDateTime.period}
                        onChange={(e) => {
                          const period = e.target.value;
                          setSelectedDateTime(prev => ({ ...prev, period }));
                          if (!showTimeOnly) {
                            handleDateTimeSelect(selectedDateTime.date, selectedDateTime.hours, selectedDateTime.minutes, period);
                          }
                        }}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {periods.map(period => (
                          <option key={period} value={period}>{period}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t">
              {showTimeOnly ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSelect('now')}
                    className="text-xs"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    Now
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (showTimeOnly) {
                        handleDateTimeSelect(selectedDateTime.date, selectedDateTime.hours, selectedDateTime.minutes, selectedDateTime.period);
                      }
                    }}
                    className="text-xs"
                  >
                    Set
                  </Button>
                </>
              ) : showDateOnly ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSelect('today')}
                    className="text-xs"
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    Today
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSelect('tomorrow')}
                    className="text-xs"
                  >
                    Tomorrow
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSelect('now')}
                    className="text-xs"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    Now
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSelect('today')}
                    className="text-xs"
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    Today 00:00
                  </Button>
                </>
              )}
            </div>

            {/* Additional Quick Presets for full datetime mode */}
            {!showTimeOnly && !showDateOnly && (
              <div className="grid grid-cols-3 gap-1 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(9, 0, 0, 0);
                    const date = tomorrow.toISOString().split('T')[0];
                    handleDateTimeSelect(date, 9, 0, 'AM');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Tomorrow 9AM
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    nextWeek.setHours(9, 0, 0, 0);
                    const date = nextWeek.toISOString().split('T')[0];
                    handleDateTimeSelect(date, 9, 0, 'AM');
                  }}
                  className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  Next Week
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const endOfWeek = new Date();
                    endOfWeek.setDate(endOfWeek.getDate() + (5 - endOfWeek.getDay()));
                    endOfWeek.setHours(17, 0, 0, 0);
                    const date = endOfWeek.toISOString().split('T')[0];
                    handleDateTimeSelect(date, 5, 0, 'PM');
                  }}
                  className="text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  End of Week
                </Button>
              </div>
            )}
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

// Specialized Date-only picker
export const DatePicker: React.FC<Omit<DateTimePickerProps, 'showTimeOnly' | 'showDateOnly'>> = (props) => {
  return <DateTimePicker {...props} showDateOnly />;
};

// Specialized Time-only picker  
export const TimePicker: React.FC<Omit<DateTimePickerProps, 'showTimeOnly' | 'showDateOnly'>> = (props) => {
  return <DateTimePicker {...props} showTimeOnly />;
};
