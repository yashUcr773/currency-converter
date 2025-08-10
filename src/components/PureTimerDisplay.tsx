import { useEffect, useRef } from 'react';
import { convertUtcToTimezone } from '../utils/timezoneUtils';

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
 * Ultra-isolated timer component using custom element approach
 * This completely bypasses React's rendering system
 */
export const PureTimerDisplay = ({ 
  timezoneValue, 
  customTime = null,
  formatOptions = { showDate: true, showSeconds: true, hour12: true },
  className = ""
}: PureTimerDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timerIdRef = useRef<number | null>(null);
  const customTimeSetAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Clear any existing timer
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
    }

    // Format functions
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

    const updateDisplay = () => {
      try {
        let currentTime: Date;

        if (customTime && customTimeSetAtRef.current) {
          // Calculate elapsed time since custom time was set
          const now = Date.now();
          const elapsedMs = now - customTimeSetAtRef.current;
          currentTime = new Date(customTime.getTime() + elapsedMs);
        } else {
          // Show live time in timezone
          const now = new Date();
          currentTime = convertUtcToTimezone(now, timezoneValue);
        }

        const dateStr = formatDate(currentTime);
        const timeStr = formatTime(currentTime);
        const displayText = dateStr ? `${dateStr} • ${timeStr}` : timeStr;

        // Only update if content has changed
        if (container.textContent !== displayText) {
          container.textContent = displayText;
        }
      } catch (error) {
        console.error(`Timer update error for ${timezoneValue}:`, error);
      }
    };

    // Set initial time tracking
    if (customTime) {
      customTimeSetAtRef.current = Date.now();
    } else {
      customTimeSetAtRef.current = null;
    }

    // Initial display update
    updateDisplay();

    // Start the timer using requestAnimationFrame for better performance
    let lastUpdate = Date.now();
    const tick = () => {
      const now = Date.now();
      
      // Only update once per second
      if (now - lastUpdate >= 1000) {
        updateDisplay();
        lastUpdate = now;
      }
      
      timerIdRef.current = requestAnimationFrame(tick);
    };

    timerIdRef.current = requestAnimationFrame(tick);

    // Cleanup function
    return () => {
      if (timerIdRef.current) {
        cancelAnimationFrame(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
  }, [timezoneValue, customTime, formatOptions.showDate, formatOptions.showSeconds, formatOptions.hour12]);

  // This component should render only once per prop change
  return <div ref={containerRef} className={className} suppressHydrationWarning />;
};
