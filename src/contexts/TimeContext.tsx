import React, { memo } from 'react';
import { TimeContext } from './TimeContextTypes';

/**
 * Global time provider - now optimized to avoid global re-renders
 * Individual timer components handle their own updates via direct DOM manipulation
 */
export const TimeProvider = memo(({ children }: { children: React.ReactNode }) => {
  // Removed: const [, forceUpdate] = useState(0);

  // Removed: Single global timer that forces a re-render every second
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     forceUpdate(prev => prev + 1);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

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
