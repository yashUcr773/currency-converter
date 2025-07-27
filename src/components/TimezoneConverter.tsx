import { useTimezoneConverter } from '../hooks/useTimezoneConverter';
import { TimezoneInput } from './TimezoneInput';
import { TimezoneSelector } from './TimezoneSelector';
import { Globe } from 'lucide-react';
import { getTimezoneInfo } from '../constants-timezone-comprehensive';

export const TimezoneConverter = () => {
  const {
    pinnedTimezones,
    baseTimezone,
    setTimeInTimezone,
    pinTimezone,
    unpinTimezone,
    setBaseTimezone,
    getAvailableTimezones
  } = useTimezoneConverter();

  if (pinnedTimezones.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header for empty state */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">
              No timezones added yet
            </span>
          </div>
        </div>

        {/* Single timezone selector card in center */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <div className="max-w-sm mx-auto md:mx-0 w-full">
            <TimezoneSelector
              availableTimezones={getAvailableTimezones()}
              onSelectTimezone={pinTimezone}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
      {/* Header Info */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm">
          <Globe className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-slate-700">
            {pinnedTimezones.length} timezone{pinnedTimezones.length !== 1 ? 's' : ''} • Live updates
          </span>
        </div>
      </div>

      {/* Timezone Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {pinnedTimezones.map((pinnedTimezone) => {
          // Get base timezone offset for difference calculation
          const baseTimezoneInfo = getTimezoneInfo(baseTimezone);
          const baseTimezoneOffset = baseTimezoneInfo?.utcOffset || 0;
          
          return (
            <div key={pinnedTimezone.timezone.id} className="w-full">
              <TimezoneInput
                pinnedTimezone={pinnedTimezone}
                onTimeChange={(time: Date) => setTimeInTimezone(pinnedTimezone.timezone.value, time)}
                onUnpin={() => unpinTimezone(pinnedTimezone.timezone.value)}
                isBaseTimezone={pinnedTimezone.timezone.value === baseTimezone}
                onSetBaseTimezone={() => setBaseTimezone(pinnedTimezone.timezone.value)}
                baseTimezoneOffset={baseTimezoneOffset}
              />
            </div>
          );
        })}
      </div>

      {/* Timezone Selector */}
      <div className="min-h-[200px] sm:min-h-[240px]">
        <TimezoneSelector
          availableTimezones={getAvailableTimezones()}
          onSelectTimezone={pinTimezone}
        />
      </div>


    </div>
  );
};
