import React, { useState, useEffect, memo } from 'react';
import { TimeContext } from './TimeContextTypes';

/**
 * Global time provider that manages a single timer for all timezone displays
 * This prevents individual components from having their own timers
 */
export const TimeProvider = memo(({ children }: { children: React.ReactNode }) => {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    // Single global timer that forces a re-render every second
    const interval = setInterval(() => {
      forceUpdate(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getCurrentTime = (timezone: string): Date => {
    try {
      const now = new Date();
      return new Date(now.toLocaleString('en-US', { 
        timeZone: timezone 
      }));
    } catch (error) {
      console.error(`Invalid timezone: ${timezone}`, error);
      return new Date();
    }
  };

  return (
    <TimeContext.Provider value={{ getCurrentTime }}>
      {children}
    </TimeContext.Provider>
  );
});

TimeProvider.displayName = 'TimeProvider';
