import { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import type { PinnedTimezone } from '../types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getUTCOffsetString } from '../constants-timezone';

interface TimezoneInputProps {
  pinnedTimezone: PinnedTimezone;
  onTimeChange: (time: Date) => void;
  onUnpin: () => void;
  disabled?: boolean;
  isBaseTimezone?: boolean;
  onSetBaseTimezone?: () => void;
  baseTimezoneOffset?: number; // UTC offset of base timezone in minutes
}

export const TimezoneInput = ({
  pinnedTimezone,
  onTimeChange,
  onUnpin,
  disabled = false,
  isBaseTimezone = false,
  onSetBaseTimezone,
  baseTimezoneOffset = 0,
}: TimezoneInputProps) => {
  const [inputValue, setInputValue] = useState('');

  // Calculate timezone offset from UTC (in hours)
  const getTimezoneOffset = (timezoneName: string): number => {
    try {
      const now = new Date();
      // Get the timezone offset by comparing with UTC
      const utcTime = new Date(now.toLocaleString("en-US", {timeZone: "UTC"}));
      const targetTime = new Date(now.toLocaleString("en-US", {timeZone: timezoneName}));
      return (targetTime.getTime() - utcTime.getTime()) / (1000 * 60 * 60);
    } catch (error) {
      console.error(`Invalid timezone: ${timezoneName}`, error);
      return 0; // Fallback to UTC
    }
  };

  // Calculate difference from base timezone
  const getDifferenceFromBase = (): string => {
    if (isBaseTimezone) return '';
    
    const currentOffset = getTimezoneOffset(pinnedTimezone.timezone.value);
    const baseOffset = baseTimezoneOffset / 60; // Convert minutes to hours
    const difference = currentOffset - baseOffset;
    
    if (difference === 0) return 'Same as base';
    const sign = difference > 0 ? '+' : '-';
    const hours = Math.abs(difference);
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes === 0) {
      return `${sign}${wholeHours}h from base`;
    } else {
      return `${sign}${wholeHours}h ${minutes}m from base`;
    }
  };

  // Calculate difference from UTC
  const getDifferenceFromUTC = (): string => {
    const offset = getTimezoneOffset(pinnedTimezone.timezone.value);
    if (offset === 0) return 'UTC';
    
    const sign = offset > 0 ? '+' : '-';
    const hours = Math.abs(offset);
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes === 0) {
      return `UTC${sign}${wholeHours}`;
    } else {
      return `UTC${sign}${wholeHours}:${minutes.toString().padStart(2, '0')}`;
    }
  };

  // Format time for display
  const formatTimeForDisplay = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Update input value when timezone time changes
  useEffect(() => {
    if (pinnedTimezone.time) {
      setInputValue(formatTimeForDisplay(pinnedTimezone.time));
    }
  }, [pinnedTimezone.time]);

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    // Parse time input (HH:MM format)
    const timeMatch = value.match(/^(\d{1,2}):(\d{2})$/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        const today = new Date();
        const newTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
        onTimeChange(newTime);
      }
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const utcOffsetString = getUTCOffsetString(pinnedTimezone.timezone.utcOffset);

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
          aria-label={`Remove ${pinnedTimezone.timezone.label}`}
        >
          <X size={12} />
        </Button>

        {/* Timezone header */}
        <div className="flex items-start gap-2 sm:gap-3 pr-8">
          {/* Flag container */}
          <div className="flex-shrink-0">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg sm:rounded-xl border border-slate-300/50 shadow-sm group-hover:shadow-md transition-all duration-300">
              <span className="text-base sm:text-lg">{pinnedTimezone.timezone.flag}</span>
            </div>
          </div>
          
          {/* Timezone info */}
          <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h3 className="font-bold text-xs sm:text-sm text-slate-800 tracking-tight truncate">
                {pinnedTimezone.timezone.label}
              </h3>
              {isBaseTimezone && (
                <div className="inline-flex items-center gap-0.5 bg-emerald-100 border border-emerald-200 px-1 py-0.5 sm:px-1.5 rounded-sm sm:rounded-md">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-emerald-700">Base</span>
                </div>
              )}
            </div>
            
            <p className="text-xs text-slate-600 font-medium truncate leading-tight">
              {pinnedTimezone.timezone.country}
            </p>
          </div>
        </div>
        
        {/* UTC offset and date info */}
        <div className="mt-2 sm:mt-3">
          <button
            onClick={onSetBaseTimezone}
            className="group/rate inline-flex items-center gap-1 text-xs font-medium bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 px-2 py-1 rounded-md sm:rounded-lg transition-all duration-200 hover:shadow-sm hover:scale-105 touch-manipulation"
            title={`Click to use ${pinnedTimezone.timezone.label} as base timezone for time input`}
          >
            <span className="text-slate-500 text-xs">UTC</span>
            <span className="text-blue-600 text-xs">→</span>
            <span className="font-semibold text-blue-700 text-xs">{utcOffsetString}</span>
            <span className="text-slate-400 group-hover/rate:text-blue-500 transition-colors text-xs">�</span>
          </button>
        </div>

        {/* Timezone difference indicators */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {/* UTC difference */}
          <div className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-md">
            <span className="text-xs font-medium text-slate-600">{getDifferenceFromUTC()}</span>
          </div>
          
          {/* Base timezone difference */}
          {!isBaseTimezone && (
            <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
              <span className="text-xs font-medium text-amber-700">{getDifferenceFromBase()}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 p-2.5 pt-1 sm:p-3 sm:pt-1 flex-1 flex flex-col justify-end">
        {/* Time input */}
        <div className="relative">
          {/* Clock icon */}
          <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 z-10">
            <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded-md sm:rounded-lg shadow-sm">
              <Clock className="text-slate-700 w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </div>
          
          <Input
            type="time"
            value={inputValue}
            onChange={handleTimeChange}
            disabled={disabled}
            className="pl-10 pr-2.5 sm:pl-12 sm:pr-3 text-sm sm:text-base font-bold h-10 sm:h-12 bg-gradient-to-r from-slate-50/80 to-white border border-slate-200/80 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 hover:border-slate-300 transition-all duration-300 text-slate-800 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md focus:shadow-lg backdrop-blur-sm"
          />
        </div>

        {/* Current live time display */}
        {pinnedTimezone.time && (
          <div className="mt-2 text-center">
            <div className="text-xs text-slate-500 font-medium">
              {formatDate(pinnedTimezone.time)} • {pinnedTimezone.time.toLocaleTimeString('en-US', {
                hour12: true,
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
