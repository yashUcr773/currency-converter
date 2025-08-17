import { useState, useEffect, useCallback } from 'react';
import type { Timezone, PinnedTimezone, TimezoneAppState } from '../types';
import { POPULAR_TIMEZONES, DEFAULT_PINNED_TIMEZONES, getTimezoneInfo } from '../constants-timezone';
import { setTimezoneData, getTimezoneData } from '../utils/timezoneCache';
import { saveRecentCountry } from '../utils/countryStorage';
import { logger } from '../utils/env';
import { createTimeInTimezone, convertUtcToTimezone } from '../utils/timezoneUtils';

const TIMEZONE_STORAGE_KEY = 'ratevault-timezone-data';

interface StoredTimezoneData {
  pinnedTimezones: string[];
  baseTimezone: string;
}

export const useTimezoneConverter = () => {
  const [state, setState] = useState<TimezoneAppState>(() => {
    // Initialize with defaults, but they will be overridden by loaded data
    const defaultTimezones: PinnedTimezone[] = DEFAULT_PINNED_TIMEZONES.map(value => {
      const timezone = POPULAR_TIMEZONES.find(tz => tz.value === value) || POPULAR_TIMEZONES[0];
      return {
        timezone,
        time: null
      };
    });

    return {
      pinnedTimezones: defaultTimezones,
      baseTimezone: 'America/New_York'
    };
  });

  const [isLoaded, setIsLoaded] = useState(false);
  // Removed: const [currentTime, setCurrentTime] = useState(new Date());

  // Removed: Update current time every second - this was causing global re-renders
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  // Initialize app state from localStorage/cache
  useEffect(() => {
    const initializeApp = async () => {
      try {
        logger.log('[TimezoneConverter] Loading saved data...');
        const storedData = await getTimezoneData(TIMEZONE_STORAGE_KEY) as StoredTimezoneData | null;
        logger.log('[TimezoneConverter] Stored data:', storedData);

        if (storedData && storedData.pinnedTimezones) {
          // Initialize pinned timezones from saved data
          const pinnedTimezones: PinnedTimezone[] = storedData.pinnedTimezones.map((value: string) => {
            const timezoneInfo = getTimezoneInfo(value);
            logger.log(`[TimezoneConverter] Loading timezone: ${value}`, timezoneInfo);
            return {
              timezone: timezoneInfo || POPULAR_TIMEZONES.find(tz => tz.value === value) || POPULAR_TIMEZONES[0],
              time: null // Will be calculated based on base timezone
            };
          });

          logger.log('[TimezoneConverter] Setting loaded timezones:', pinnedTimezones.map(pt => pt.timezone.value));
          setState({
            pinnedTimezones,
            baseTimezone: storedData.baseTimezone || 'America/New_York'
          });
        } else {
          logger.log('[TimezoneConverter] No saved data found, using defaults');
        }
        
        setIsLoaded(true);
      } catch (error) {
        logger.error('Error loading timezone data:', error);
        setIsLoaded(true); // Still mark as loaded even if failed
      }
    };

    initializeApp();
  }, []);

  // Save state to localStorage/cache whenever it changes (but only after initial load)
  useEffect(() => {
    if (!isLoaded) return; // Don't save during initial load
    
    const saveData = async () => {
      try {
        const dataToSave: StoredTimezoneData = {
          pinnedTimezones: state.pinnedTimezones.map(pt => pt.timezone.value),
          baseTimezone: state.baseTimezone
        };
        logger.log('[TimezoneConverter] Saving data:', dataToSave);
        await setTimezoneData(TIMEZONE_STORAGE_KEY, dataToSave);
        logger.log('[TimezoneConverter] Data saved successfully');
      } catch (error) {
        logger.error('Error saving timezone data:', error);
      }
    };

    saveData();
  }, [state, isLoaded]);

  // Update all timezone times when base timezone changes (removed currentTime dependency)
  useEffect(() => {
    // Note: Individual timer displays now handle their own updates via direct DOM manipulation
    // This effect is kept for when the base timezone changes only
    setState(prev => ({
      ...prev,
      pinnedTimezones: prev.pinnedTimezones.map(pinnedTimezone => {
        // Skip updating if this timezone has a custom set time
        if (pinnedTimezone.isCustomTime) {
          return pinnedTimezone;
        }
        
        // Let individual timer components handle live time updates
        // This state update is only for base timezone changes
        return pinnedTimezone;
      })
    }));
  }, [state.baseTimezone]); // Removed currentTime dependency

  // Set time in a specific timezone and update all others
  const setTimeInTimezone = useCallback((timezoneValue: string, hour: number, minute: number, ampm: 'AM' | 'PM') => {
    try {
      // 1. Convert 12-hour to 24-hour format
      let hour24 = hour;
      if (ampm === 'AM' && hour === 12) hour24 = 0;
      else if (ampm === 'PM' && hour !== 12) hour24 = hour + 12;

      logger.log(`Setting time in ${timezoneValue}: ${hour}:${minute.toString().padStart(2, '0')} ${ampm} (${hour24}:${minute.toString().padStart(2, '0')})`);

      // 2. Get today's date
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const day = today.getDate();

      // 3. Create UTC time that represents the desired local time in the source timezone
      const utcTime = createTimeInTimezone(timezoneValue, year, month, day, hour24, minute);
      
      logger.log(`UTC time for ${hour24}:${minute.toString().padStart(2, '0')} in ${timezoneValue}: ${utcTime.toISOString()}`);

      // 4. Update all timezone cards
      setState(prev => ({
        ...prev,
        baseTimezone: timezoneValue,
        pinnedTimezones: prev.pinnedTimezones.map(pinnedTimezone => {
          // For all timezones (including the source), convert from UTC to their local time
          try {
            const targetLocalTime = convertUtcToTimezone(utcTime, pinnedTimezone.timezone.value);
            
            logger.log(`Converted time for ${pinnedTimezone.timezone.value}: ${targetLocalTime.toLocaleString()}`);
            
            return {
              ...pinnedTimezone,
              time: targetLocalTime,
              isCustomTime: true
            };
          } catch (conversionError) {
            logger.error(`Error converting time for ${pinnedTimezone.timezone.value}:`, conversionError);
            return pinnedTimezone;
          }
        })
      }));
    } catch (error) {
      logger.error('Error in setTimeInTimezone:', error);
    }
  }, []);

  // Reset all timezones to current time
  const resetToCurrentTime = useCallback(() => {
    const now = new Date(); // Get current time at the moment of reset
    setState(prev => ({
      ...prev,
      pinnedTimezones: prev.pinnedTimezones.map(pinnedTimezone => {
        // Calculate current time in this timezone
        let timeInTimezone: Date;
        try {
          timeInTimezone = new Date(now.toLocaleString('en-US', { 
            timeZone: pinnedTimezone.timezone.value 
          }));
        } catch (error) {
          logger.error(`Invalid timezone in reset: ${pinnedTimezone.timezone.value}`, error);
          // Fallback to current time
          timeInTimezone = new Date(now);
        }
        
        return {
          ...pinnedTimezone,
          time: timeInTimezone,
          isCustomTime: false // Mark as live time
        };
      })
    }));
  }, []); // No dependencies needed

  // Add a timezone to pinned list
  const pinTimezone = useCallback((timezone: Timezone) => {
    const now = new Date(); // Get current time when pinning
    setState(prev => {
      // Check if already pinned
      if (prev.pinnedTimezones.some(pt => pt.timezone.value === timezone.value)) {
        return prev;
      }

      let timeInTimezone: Date;
      try {
        timeInTimezone = new Date(now.toLocaleString('en-US', { timeZone: timezone.value }));
      } catch (error) {
        logger.error(`Invalid timezone for pinning: ${timezone.value}`, error);
        // Fallback to current time
        timeInTimezone = new Date(now);
      }

      const newPinned: PinnedTimezone = {
        timezone,
        time: timeInTimezone,
        isCustomTime: false // New timezones start with current time
      };

      // Save country to recent countries for persistence
      const countryTimezoneCount = POPULAR_TIMEZONES.filter(tz => tz.country === timezone.country).length;
      saveRecentCountry(timezone.country, timezone.flag, countryTimezoneCount);

      return {
        ...prev,
        pinnedTimezones: [...prev.pinnedTimezones, newPinned]
      };
    });
  }, []); // No dependencies needed

  // Remove a timezone from pinned list
  const unpinTimezone = useCallback((timezoneValue: string) => {
    setState(prev => ({
      ...prev,
      pinnedTimezones: prev.pinnedTimezones.filter(pt => pt.timezone.value !== timezoneValue)
    }));
  }, []);

  // Set base timezone for time input
  const setBaseTimezone = useCallback((timezoneValue: string) => {
    setState(prev => ({
      ...prev,
      baseTimezone: timezoneValue
    }));
  }, []);

  // Get available timezones for selection
  const getAvailableTimezones = useCallback(() => {
    const pinnedValues = state.pinnedTimezones.map(pt => pt.timezone.value);
    return POPULAR_TIMEZONES.filter(timezone => !pinnedValues.includes(timezone.value));
  }, [state.pinnedTimezones]);

  // Convert time from one timezone to another
  const convertTime = useCallback((time: Date, fromTimezone: string, toTimezone: string): Date => {
    try {
      // Get time in the 'from' timezone
      const timeInFromTz = new Date(time.toLocaleString('en-US', { timeZone: fromTimezone }));
      const timeInLocalTz = new Date(time.toLocaleString('en-US'));
      
      // Calculate the offset
      const offset = time.getTime() - (timeInFromTz.getTime() - timeInLocalTz.getTime());
      const utcTime = new Date(offset);
      
      // Convert to target timezone
      return new Date(utcTime.toLocaleString('en-US', { timeZone: toTimezone }));
    } catch (error) {
      logger.error(`Error converting time from ${fromTimezone} to ${toTimezone}:`, error);
      // Fallback to original time
      return new Date(time);
    }
  }, []);

  return {
    ...state,
    // currentTime removed - individual timer components handle their own time updates
    setTimeInTimezone,
    resetToCurrentTime,
    pinTimezone,
    unpinTimezone,
    setBaseTimezone,
    getAvailableTimezones,
    convertTime
  };
};
