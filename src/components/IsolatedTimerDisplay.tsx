import { useEffect, useRef, memo } from 'react';
import { convertUtcToTimezone } from '../utils/timezoneUtils';

interface IsolatedTimerDisplayProps {
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
 * Completely isolated timer component that uses direct DOM manipulation
 * This component will NEVER cause React re-renders after initial mount
 * Uses direct DOM updates for maximum performance isolation
 */
const IsolatedTimerDisplay = memo(({ 
  timezoneValue, 
  customTime = null,
  formatOptions = { showDate: true, showSeconds: true, hour12: true },
  className = ""
}: IsolatedTimerDisplayProps) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const customTimeSetAt = useRef<number | null>(null);
  const displayRef = useRef<HTMLDivElement>(null);

  // Initialize display on mount and when props change
  useEffect(() => {
    // Format functions - defined inside useEffect to avoid dependency issues
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

    const updateDisplay = (date: Date) => {
      if (!displayRef.current) return;
      
      const dateStr = formatDate(date);
      const timeStr = formatTime(date);
      
      const displayText = dateStr ? `${dateStr} • ${timeStr}` : timeStr;
      
      // Direct DOM manipulation - bypasses React entirely
      if (displayRef.current.textContent !== displayText) {
        displayRef.current.textContent = displayText;
      }
    };

    // Set initial time
    let initialTime: Date;
    
    if (customTime) {
      customTimeSetAt.current = Date.now();
      initialTime = customTime;
    } else {
      customTimeSetAt.current = null;
      try {
        const now = new Date();
        initialTime = convertUtcToTimezone(now, timezoneValue);
      } catch (error) {
        console.error(`Invalid timezone: ${timezoneValue}`, error);
        initialTime = new Date();
      }
    }
    
    // Set initial display
    updateDisplay(initialTime);
    
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Start new timer with direct DOM updates
    timerRef.current = setInterval(() => {
      let currentTime: Date;
      
      if (customTime && customTimeSetAt.current) {
        // Calculate elapsed time since custom time was set
        const now = Date.now();
        const elapsedMs = now - customTimeSetAt.current;
        currentTime = new Date(customTime.getTime() + elapsedMs);
      } else {
        // Show live time in timezone
        try {
          const now = new Date();
          currentTime = convertUtcToTimezone(now, timezoneValue);
        } catch (error) {
          console.error(`Error updating time for timezone ${timezoneValue}:`, error);
          currentTime = new Date();
        }
      }
      
      // Direct DOM update - NO React re-render triggered
      updateDisplay(currentTime);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timezoneValue, customTime, formatOptions.showDate, formatOptions.showSeconds, formatOptions.hour12]);

  // This component renders ONCE and never re-renders after that
  return (
    <div ref={displayRef} className={className}>
      {/* Initial content will be set by updateDisplay */}
    </div>
  );
});

IsolatedTimerDisplay.displayName = 'IsolatedTimerDisplay';

export { IsolatedTimerDisplay };
