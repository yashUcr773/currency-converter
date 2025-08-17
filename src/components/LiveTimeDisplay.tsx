import { useState, useEffect, useRef } from 'react';

interface LiveTimeDisplayProps {
  timezoneValue: string;
  /** Custom time to display instead of current time */
  customTime?: Date | null;
  formatOptions?: {
    showDate?: boolean;
    showSeconds?: boolean;
    hour12?: boolean;
  };
  className?: string;
}

/**
 * Isolated component that handles its own timer and re-renders
 * This prevents parent components from re-rendering every second
 * If customTime is provided, it shows that time with seconds continuing to tick
 */
export const LiveTimeDisplay = ({ 
  timezoneValue, 
  customTime = null,
  formatOptions = { showDate: true, showSeconds: true, hour12: true },
  className = ""
}: LiveTimeDisplayProps) => {
  const customTimeSetAt = useRef<number | null>(null);

  const [currentTime, setCurrentTime] = useState<Date>(() => {
    // If custom time is provided, use it and record when it was set
    if (customTime) {
      customTimeSetAt.current = Date.now();
      return customTime;
    }
    
    try {
      const now = new Date();
      return new Date(now.toLocaleString('en-US', { 
        timeZone: timezoneValue 
      }));
    } catch (error) {
      console.error(`Invalid timezone: ${timezoneValue}`, error);
      return new Date();
    }
  });

  useEffect(() => {
    // When customTime changes, update the reference time
    if (customTime) {
      customTimeSetAt.current = Date.now();
      setCurrentTime(customTime);
    } else {
      customTimeSetAt.current = null;
    }
  }, [customTime]);

  useEffect(() => {
    // Always run the timer
    const interval = setInterval(() => {
      if (customTime && customTimeSetAt.current) {
        // Calculate elapsed time since custom time was set
        const now = Date.now();
        const elapsedMs = now - customTimeSetAt.current;
        const updatedTime = new Date(customTime.getTime() + elapsedMs);
        setCurrentTime(updatedTime);
      } else {
        // Show live time in timezone
        try {
          const now = new Date();
          const timeInTimezone = new Date(now.toLocaleString('en-US', { 
            timeZone: timezoneValue 
          }));
          setCurrentTime(timeInTimezone);
        } catch (error) {
          console.error(`Error updating time for timezone ${timezoneValue}:`, error);
          setCurrentTime(new Date());
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timezoneValue, customTime]);

  const formatDate = (date: Date): string => {
    if (!formatOptions.showDate) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      hour12: formatOptions.hour12 ?? true,
      hour: 'numeric',
      minute: '2-digit'
    };

    if (formatOptions.showSeconds) {
      options.second = '2-digit';
    }

    return date.toLocaleTimeString('en-US', options);
  };

  return (
    <div className={className}>
      {formatOptions.showDate && formatDate(currentTime) && (
        <>
          {formatDate(currentTime)} • 
        </>
      )}
      {formatTime(currentTime)}
    </div>
  );
};
