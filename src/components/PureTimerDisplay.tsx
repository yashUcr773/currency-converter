import { useState, useEffect, memo } from 'react';

interface PureTimerDisplayProps {
  timezoneValue: string;
  customTime?: Date | null;
  formatOptions?: {
    showDate?: boolean;
    showSeconds?: boolean;
    hour12?: boolean;
  };
  className?: string;
}

/**
 * Simplified timer component for timezone display
 */
export const PureTimerDisplay = memo(({ 
  timezoneValue, 
  customTime = null,
  formatOptions = { showDate: true, showSeconds: true, hour12: true },
  className = ""
}: PureTimerDisplayProps) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const updateDisplay = () => {
      try {
        const now = customTime || new Date();
        const timeInTimezone = new Date(now.toLocaleString('en-US', { timeZone: timezoneValue }));

        const timeOptions: Intl.DateTimeFormatOptions = {
          hour12: formatOptions.hour12,
          hour: 'numeric',
          minute: '2-digit',
          ...(formatOptions.showSeconds && { second: '2-digit' })
        };

        const timeStr = timeInTimezone.toLocaleTimeString('en-US', timeOptions);
        
        if (formatOptions.showDate) {
          const dateStr = timeInTimezone.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          });
          setDisplayText(`${dateStr} • ${timeStr}`);
        } else {
          setDisplayText(timeStr);
        }
      } catch (error) {
        console.error(`Timer error for ${timezoneValue}:`, error);
        setDisplayText('Invalid timezone');
      }
    };

    updateDisplay();
    
    if (!customTime) {
      const interval = setInterval(updateDisplay, 1000);
      return () => clearInterval(interval);
    }
  }, [timezoneValue, customTime, formatOptions.showDate, formatOptions.showSeconds, formatOptions.hour12]);

  return <div className={className}>{displayText}</div>;
});
