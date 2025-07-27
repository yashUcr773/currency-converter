import { useState, useEffect, memo } from 'react';

interface IsolatedTimeDisplayProps {
  timezoneValue: string;
  className?: string;
}

/**
 * Completely isolated time display with its own React fiber
 * Uses a portal-like approach to prevent any parent re-renders
 */
export const IsolatedTimeDisplay = memo(({ timezoneValue, className = "" }: IsolatedTimeDisplayProps) => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    // Function to update time string
    const updateTime = () => {
      try {
        const now = new Date();
        const timeInTimezone = new Date(now.toLocaleString('en-US', { 
          timeZone: timezoneValue 
        }));
        
        const dateStr = timeInTimezone.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
        
        const timeStr = timeInTimezone.toLocaleTimeString('en-US', {
          hour12: true,
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit'
        });
        
        setTimeString(`${dateStr} • ${timeStr}`);
      } catch (error) {
        console.error(`Error updating time for ${timezoneValue}:`, error);
        setTimeString('Invalid timezone');
      }
    };

    // Initial update
    updateTime();

    // Set up interval - this component will re-render but won't affect parents
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [timezoneValue]);

  return <span className={className}>{timeString}</span>;
});

IsolatedTimeDisplay.displayName = 'IsolatedTimeDisplay';
