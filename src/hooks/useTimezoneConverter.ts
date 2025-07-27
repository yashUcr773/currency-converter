import { useState, useEffect, useCallback } from 'react';
import type { Timezone, PinnedTimezone, TimezoneAppState } from '../types';
import { POPULAR_TIMEZONES, DEFAULT_PINNED_TIMEZONES, getTimezoneInfo } from '../constants-timezone';
import { setTimezoneData, getTimezoneData } from '../utils/timezoneCache';
import { saveRecentCountry } from '../utils/countryStorage';

const TIMEZONE_STORAGE_KEY = 'timezone-converter-data';

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
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Initialize app state from localStorage/cache
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('[TimezoneConverter] Loading saved data...');
        const storedData = await getTimezoneData(TIMEZONE_STORAGE_KEY) as StoredTimezoneData | null;
        console.log('[TimezoneConverter] Stored data:', storedData);

        if (storedData && storedData.pinnedTimezones) {
          // Initialize pinned timezones from saved data
          const pinnedTimezones: PinnedTimezone[] = storedData.pinnedTimezones.map((value: string) => {
            const timezoneInfo = getTimezoneInfo(value);
            console.log(`[TimezoneConverter] Loading timezone: ${value}`, timezoneInfo);
            return {
              timezone: timezoneInfo || POPULAR_TIMEZONES.find(tz => tz.value === value) || POPULAR_TIMEZONES[0],
              time: null // Will be calculated based on base timezone
            };
          });

          console.log('[TimezoneConverter] Setting loaded timezones:', pinnedTimezones.map(pt => pt.timezone.value));
          setState({
            pinnedTimezones,
            baseTimezone: storedData.baseTimezone || 'America/New_York'
          });
        } else {
          console.log('[TimezoneConverter] No saved data found, using defaults');
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading timezone data:', error);
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
        console.log('[TimezoneConverter] Saving data:', dataToSave);
        await setTimezoneData(TIMEZONE_STORAGE_KEY, dataToSave);
        console.log('[TimezoneConverter] Data saved successfully');
      } catch (error) {
        console.error('Error saving timezone data:', error);
      }
    };

    saveData();
  }, [state, isLoaded]);

  // Update all timezone times when current time or base timezone changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      pinnedTimezones: prev.pinnedTimezones.map(pinnedTimezone => {
        // Calculate time in this timezone
        let timeInTimezone: Date;
        try {
          timeInTimezone = new Date(currentTime.toLocaleString('en-US', { 
            timeZone: pinnedTimezone.timezone.value 
          }));
        } catch (error) {
          console.error(`Invalid timezone in update: ${pinnedTimezone.timezone.value}`, error);
          // Fallback to current time
          timeInTimezone = new Date(currentTime);
        }
        
        return {
          ...pinnedTimezone,
          time: timeInTimezone
        };
      })
    }));
  }, [currentTime, state.baseTimezone]);

  // Set time in a specific timezone and update all others
  const setTimeInTimezone = useCallback((timezoneValue: string, time: Date) => {
    try {
      // Convert the input time to UTC
      const inputTimeString = time.toLocaleTimeString('en-US', { hour12: false });
      const [hours, minutes, seconds] = inputTimeString.split(':').map(Number);
      
      // Create a date object in the target timezone
      const today = new Date();
      const targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, seconds || 0);
      
      // Get the time as if it were in the target timezone
      const targetTimeInLocal = new Date(targetDate.toLocaleString('en-US', { timeZone: timezoneValue }));
      const localTime = new Date(targetDate.toLocaleString('en-US'));
      const offset = targetDate.getTime() - (targetTimeInLocal.getTime() - localTime.getTime());
      const adjustedTime = new Date(offset);

      // Update current time to reflect this new time
      setCurrentTime(adjustedTime);

      // Set as base timezone
      setState(prev => ({
        ...prev,
        baseTimezone: timezoneValue
      }));
    } catch (error) {
      console.error(`Error setting time in timezone ${timezoneValue}:`, error);
      // Fallback: just set as base timezone without time conversion
      setState(prev => ({
        ...prev,
        baseTimezone: timezoneValue
      }));
    }
  }, []);

  // Add a timezone to pinned list
  const pinTimezone = useCallback((timezone: Timezone) => {
    setState(prev => {
      const isAlreadyPinned = prev.pinnedTimezones.some(pt => pt.timezone.value === timezone.value);
      if (isAlreadyPinned) return prev;

      let timeInTimezone: Date;
      try {
        timeInTimezone = new Date(currentTime.toLocaleString('en-US', { timeZone: timezone.value }));
      } catch (error) {
        console.error(`Invalid timezone for pinning: ${timezone.value}`, error);
        // Fallback to current time
        timeInTimezone = new Date(currentTime);
      }

      const newPinned: PinnedTimezone = {
        timezone,
        time: timeInTimezone
      };

      // Save country to recent countries for persistence
      const countryTimezoneCount = POPULAR_TIMEZONES.filter(tz => tz.country === timezone.country).length;
      saveRecentCountry(timezone.country, timezone.flag, countryTimezoneCount);

      return {
        ...prev,
        pinnedTimezones: [...prev.pinnedTimezones, newPinned]
      };
    });
  }, [currentTime]);

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
      console.error(`Error converting time from ${fromTimezone} to ${toTimezone}:`, error);
      // Fallback to original time
      return new Date(time);
    }
  }, []);

  return {
    ...state,
    currentTime,
    setTimeInTimezone,
    pinTimezone,
    unpinTimezone,
    setBaseTimezone,
    getAvailableTimezones,
    convertTime
  };
};
