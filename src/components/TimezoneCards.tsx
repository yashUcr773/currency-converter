import { memo } from 'react';
import { TimezoneInput } from './TimezoneInput';
import { getTimezoneInfo } from '../constants-timezone-comprehensive';
import type { PinnedTimezone } from '../types';

interface TimezoneCardsProps {
  pinnedTimezones: PinnedTimezone[];
  baseTimezone: string;
  onTimeChange: (timezoneValue: string) => void;
  onUnpin: (timezoneValue: string) => void;
  onSetBaseTimezone: (timezoneValue: string) => void;
}

/**
 * Isolated component that renders timezone cards
 * Wrapped with React.memo to prevent re-renders when parent components change
 */
const TimezoneCards = memo(({
  pinnedTimezones,
  baseTimezone,
  onTimeChange,
  onUnpin,
  onSetBaseTimezone
}: TimezoneCardsProps) => {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {pinnedTimezones.map((pinnedTimezone) => {
        const baseTimezoneInfo = getTimezoneInfo(baseTimezone);
        const baseTimezoneOffset = baseTimezoneInfo?.utcOffset || 0;
        
        return (
          <div key={pinnedTimezone.timezone.id} className="w-full">
            <TimezoneInput
              pinnedTimezone={pinnedTimezone}
              onTimeChange={() => onTimeChange(pinnedTimezone.timezone.value)}
              onUnpin={() => onUnpin(pinnedTimezone.timezone.value)}
              isBaseTimezone={pinnedTimezone.timezone.value === baseTimezone}
              onSetBaseTimezone={() => onSetBaseTimezone(pinnedTimezone.timezone.value)}
              baseTimezoneOffset={baseTimezoneOffset}
            />
          </div>
        );
      })}
    </div>
  );
});

TimezoneCards.displayName = 'TimezoneCards';

export { TimezoneCards };
