import { useState } from 'react';
import { Plus, Search, Globe } from 'lucide-react';
import type { Timezone } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getUTCOffsetString } from '../constants-timezone';
import { findTimezoneByCountry } from '../constants-country-timezone';

interface TimezoneSelectorProps {
  availableTimezones: Timezone[];
  onSelectTimezone: (timezone: Timezone) => void;
}

export const TimezoneSelector = ({
  availableTimezones,
  onSelectTimezone,
}: TimezoneSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter timezones based on search term
  const filteredTimezones = availableTimezones.filter(timezone =>
    timezone.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    timezone.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    timezone.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-select timezone based on country input
  const autoSelectedTimezone = searchTerm.length > 2 ? 
    (() => {
      const foundTimezoneValue = findTimezoneByCountry(searchTerm);
      return foundTimezoneValue ? 
        availableTimezones.find(tz => tz.value === foundTimezoneValue) : 
        null;
    })() : null;

  // Combine filtered timezones with auto-selected one (if any)
  const displayTimezones = autoSelectedTimezone && 
    !filteredTimezones.some(tz => tz.value === autoSelectedTimezone.value)
    ? [autoSelectedTimezone, ...filteredTimezones]
    : filteredTimezones;

  const handleTimezoneSelect = (timezone: Timezone) => {
    onSelectTimezone(timezone);
    setSearchTerm('');
    setIsExpanded(false);
  };

  if (availableTimezones.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-slate-50/80 to-white/50 backdrop-blur-sm border border-slate-200/50 shadow-sm">
        <CardContent className="p-6 text-center">
          <div className="text-slate-400 mb-3">
            <Globe className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-1">
            All timezones added!
          </h3>
          <p className="text-xs text-slate-500">
            Remove a timezone to add a different one
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-white/95 to-slate-50/80 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
            <Plus className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-sm font-semibold text-slate-800">
            Add Timezone
          </h2>
        </div>

        {/* Search input */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <Input
            type="text"
            placeholder="Search by city, country, or timezone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsExpanded(true);
            }}
            onFocus={() => setIsExpanded(true)}
            className="pl-10 pr-4 h-10 bg-white/80 border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-lg text-sm"
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {(isExpanded || searchTerm) && (
          <ScrollArea className="h-48">
            <div className="space-y-1">
              {displayTimezones.length > 0 ? (
                displayTimezones.map((timezone) => (
                  <Button
                    key={timezone.value}
                    variant="ghost"
                    onClick={() => handleTimezoneSelect(timezone)}
                    className={`w-full justify-start p-3 h-auto hover:bg-blue-50 hover:border-blue-200 border border-transparent rounded-lg transition-all duration-200 group ${
                      autoSelectedTimezone?.value === timezone.value ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {/* Flag */}
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg group-hover:shadow-sm transition-shadow">
                        <span className="text-sm">{timezone.flag}</span>
                      </div>
                      
                      {/* Timezone info */}
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-medium text-sm text-slate-800 truncate">
                            {timezone.label}
                          </span>
                          {autoSelectedTimezone?.value === timezone.value && (
                            <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-medium">
                              Auto
                            </span>
                          )}
                          <span className="text-xs font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                            {getUTCOffsetString(timezone.utcOffset)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {timezone.country}
                        </div>
                      </div>

                      {/* Add icon */}
                      <div className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                  </Button>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500">
                  <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No timezones found</p>
                  <p className="text-xs">Try searching for a city or country name</p>
                  <p className="text-xs text-slate-400 mt-1">e.g., "India", "Germany", "Australia"</p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        {!isExpanded && !searchTerm && (
          <div className="text-center py-4">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(true)}
              className="text-sm text-slate-600 hover:text-blue-600 hover:border-blue-300"
            >
              <Globe className="w-4 h-4 mr-2" />
              Browse all timezones
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
