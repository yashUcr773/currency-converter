import React, { createContext, memo } from 'react';

interface TimeContextValue {
  getCurrentTime: (timezone: string) => Date;
}

const TimeContext = createContext<TimeContextValue | null>(null);

/**
 * Global time provider - now optimized to avoid global re-renders
 * Individual timer components handle their own updates via direct DOM manipulation
 */
export const TimeProvider = memo(({ children }: { children: React.ReactNode }) => {
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

export { TimeContext };
