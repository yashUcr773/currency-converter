import { useState, useEffect } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TimezoneTimeDropdownProps {
  timezoneValue: string;
  setTime?: Date | null; // The custom set time, null means show current time
  onTimeChange: (hour: number, minute: number, ampm: 'AM' | 'PM') => void;
  disabled?: boolean;
}

/**
 * Dropdown time selector with 12-hour format and AM/PM
 * Shows current time by default, allows setting custom time
 */
export const TimezoneTimeDropdown = ({ 
  timezoneValue, 
  setTime = null,
  onTimeChange, 
  disabled = false
}: TimezoneTimeDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Initialize with current time
  const getInitialTime = () => {
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
      return { hour: 12, minute: 0, ampm: 'AM' as const };
    }
  };
  
  const initialTime = getInitialTime();
  const [selectedHour, setSelectedHour] = useState(initialTime.hour);
  const [selectedMinute, setSelectedMinute] = useState(initialTime.minute);
  const [selectedAmPm, setSelectedAmPm] = useState<'AM' | 'PM'>(initialTime.ampm);
  const [isCustomTimeMode, setIsCustomTimeMode] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [hasUserSetTime, setHasUserSetTime] = useState(false);
  const [lastUserSelection, setLastUserSelection] = useState<{hour: number, minute: number, ampm: 'AM' | 'PM'} | null>(null);

  // Keep dropdown selections in sync with current time when in live mode
  useEffect(() => {
    if (!isCustomTimeMode && !hasUserSetTime && !isUserInteracting) {
      const timer = setInterval(() => {
        try {
          const now = new Date();
          const displayTime = new Date(now.toLocaleString('en-US', { 
            timeZone: timezoneValue 
          }));
          const hours = displayTime.getHours();
          const minutes = displayTime.getMinutes();
          const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
          const ampm: 'AM' | 'PM' = hours >= 12 ? 'PM' : 'AM';
          
          setSelectedHour(hour12);
          setSelectedMinute(minutes);
          setSelectedAmPm(ampm);
        } catch (error) {
          console.error(`Error updating live time for ${timezoneValue}:`, error);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [timezoneValue, isCustomTimeMode, hasUserSetTime, isUserInteracting]);

  // Only update display when props change, not on timer
  const getCurrentDisplayTime = (): Date => {
    if (setTime) {
      // For custom set times, return the setTime directly 
      // (it should already be the correct time for this timezone from the conversion)
      return setTime;
    } else {
      // Show current time in this timezone
      try {
        const now = new Date();
        const timeInTimezone = new Date(now.toLocaleString('en-US', { 
          timeZone: timezoneValue 
        }));
        return timeInTimezone;
      } catch (error) {
        console.error(`Error getting current time for ${timezoneValue}:`, error);
        return new Date();
      }
    }
  };

  const formatTimeForDisplay = (date: Date): { timeString: string; dateString: string; isNextDay: boolean; isPrevDay: boolean } => {
    const timeString = date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit'
    });

    const today = new Date();
    const dateString = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    // Normalize dates to compare just the date part (not time)
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const displayDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const isNextDay = displayDateOnly.getTime() > todayDateOnly.getTime();
    const isPrevDay = displayDateOnly.getTime() < todayDateOnly.getTime();

    return { timeString, dateString, isNextDay, isPrevDay };
  };

  // Update selected values only when setTime or timezone changes
  useEffect(() => {
    // Don't update if user is currently interacting with dropdowns
    if (isUserInteracting) return;
    
    if (setTime) {
      // We have a custom set time - convert it to display format
      const displayTime = new Date(setTime.toLocaleString('en-US', { 
        timeZone: timezoneValue 
      }));
      const hours = displayTime.getHours();
      const minutes = displayTime.getMinutes();
      const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      // Check if this matches the user's last selection - if so, don't update
      if (hasUserSetTime && lastUserSelection && 
          lastUserSelection.hour === hour12 && 
          lastUserSelection.minute === minutes && 
          lastUserSelection.ampm === ampm) {
        return; // Don't update if it matches user's selection
      }
      
      setSelectedHour(hour12);
      setSelectedMinute(minutes);
      setSelectedAmPm(ampm);
      setIsCustomTimeMode(true);
    } else if (!isCustomTimeMode && setTime === null && !hasUserSetTime) {
      // Only update from current time if we're explicitly reset to null AND user hasn't set time
      try {
        const now = new Date();
        const displayTime = new Date(now.toLocaleString('en-US', { 
          timeZone: timezoneValue 
        }));
        const hours = displayTime.getHours();
        const minutes = displayTime.getMinutes();
        
        setSelectedHour(hours === 0 ? 12 : hours > 12 ? hours - 12 : hours);
        setSelectedMinute(minutes);
        setSelectedAmPm(hours >= 12 ? 'PM' : 'AM');
      } catch (error) {
        console.error(`Error getting current time for ${timezoneValue}:`, error);
      }
    }
  }, [setTime, timezoneValue, isCustomTimeMode, isUserInteracting, hasUserSetTime, lastUserSelection]); // Remove getCurrentTimeForTimezone dependency

  // Reset custom time mode when setTime becomes null
  useEffect(() => {
    if (setTime === null) {
      setIsCustomTimeMode(false);
      setHasUserSetTime(false); // Reset user set flag when reset to current time
      setLastUserSelection(null); // Clear user's selection
    }
  }, [setTime]);

  const handleTimeSet = () => {
    setHasUserSetTime(true); // Mark that user has set a custom time
    setLastUserSelection({ hour: selectedHour, minute: selectedMinute, ampm: selectedAmPm }); // Save user's selection
    setIsCustomTimeMode(true);
    onTimeChange(selectedHour, selectedMinute, selectedAmPm);
    setIsOpen(false);
    // Don't reset interaction state immediately - let the prop update first
    setTimeout(() => setIsUserInteracting(false), 100);
  };

  const displayTime = getCurrentDisplayTime();
  const { timeString, dateString, isNextDay, isPrevDay } = formatTimeForDisplay(displayTime);

  // For dropdown selections, always use the state variables which are kept in sync
  const getDropdownTime = (): {hour: number, minute: number, ampm: 'AM' | 'PM'} => {
    return { hour: selectedHour, minute: selectedMinute, ampm: selectedAmPm };
  };

  const dropdownTime = getDropdownTime();

  // Generate hours (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  // Generate minutes (00, 15, 30, 45)
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <Popover open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        setIsUserInteracting(false); // Reset interaction when closing
      }
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="w-full justify-between h-10 sm:h-12 px-3 sm:px-4 bg-gradient-to-r from-slate-50/80 to-white border border-slate-200/80 hover:border-slate-300 transition-all duration-300 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <div className="flex flex-col items-start">
              <span className="text-sm sm:text-base font-bold text-slate-800">
                {timeString}
              </span>
              {(isNextDay || isPrevDay) && (
                <span className="text-xs text-slate-500">
                  {isPrevDay && "Yesterday, "}
                  {isNextDay && "Tomorrow, "}
                  {dateString}
                </span>
              )}
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-slate-700">Set Time</h4>
          
          <div className="grid grid-cols-3 gap-3">
            {/* Hour Selector */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-2 block">Hour</label>
              <select
                value={dropdownTime.hour}
                onChange={(e) => {
                  setIsUserInteracting(true);
                  setSelectedHour(Number(e.target.value));
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
            <div>
              <label className="text-xs font-medium text-slate-600 mb-2 block">Minute</label>
              <select
                value={dropdownTime.minute}
                onChange={(e) => {
                  setIsUserInteracting(true);
                  setSelectedMinute(Number(e.target.value));
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
            <div>
              <label className="text-xs font-medium text-slate-600 mb-2 block">Period</label>
              <select
                value={dropdownTime.ampm}
                onChange={(e) => {
                  setIsUserInteracting(true);
                  setSelectedAmPm(e.target.value as 'AM' | 'PM');
                }}
                onFocus={() => setIsUserInteracting(true)}
                className="w-full p-2 border border-slate-200 rounded-md text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

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
  );
};
