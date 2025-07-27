import { useState, useEffect } from 'react';

interface LiveTimeDisplayProps {
  timezoneValue: string;
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
 */
export const LiveTimeDisplay = ({ 
  timezoneValue, 
  formatOptions = { showDate: true, showSeconds: true, hour12: true },
  className = ""
}: LiveTimeDisplayProps) => {
  const [currentTime, setCurrentTime] = useState<Date>(() => {
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
    const interval = setInterval(() => {
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
    }, 1000);

    return () => clearInterval(interval);
  }, [timezoneValue]);

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
