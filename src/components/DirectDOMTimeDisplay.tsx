import { useEffect, useRef, memo } from 'react';

interface DirectDOMTimeDisplayProps {
  timezoneValue: string;
  className?: string;
}

/**
 * Time display that directly manipulates DOM to avoid ANY React re-renders
 * Uses useRef and direct DOM manipulation - completely isolated from React's render cycle
 */
export const DirectDOMTimeDisplay = memo(({ timezoneValue, className = "" }: DirectDOMTimeDisplayProps) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateTime = () => {
      if (!spanRef.current) return;
      
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
        
        // Direct DOM manipulation - no React re-render
        spanRef.current.textContent = `${dateStr} • ${timeStr}`;
      } catch (error) {
        console.error(`Error updating time for ${timezoneValue}:`, error);
        if (spanRef.current) {
          spanRef.current.textContent = 'Invalid timezone';
        }
      }
    };

    // Initial update
    updateTime();

    // Set up interval with direct DOM updates
    intervalRef.current = setInterval(updateTime, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timezoneValue]);

  // Component never re-renders after initial mount
  return <span ref={spanRef} className={className}></span>;
});

DirectDOMTimeDisplay.displayName = 'DirectDOMTimeDisplay';
