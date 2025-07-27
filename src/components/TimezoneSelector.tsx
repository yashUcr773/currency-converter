import { useState } from 'react';
import { Plus, Search, Globe, X } from 'lucide-react';
import type { Timezone } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { getUTCOffsetString, getTimezonesByCountry, getTimezonesByAbbreviation } from '../constants-timezone';
import { saveRecentCountry, getRecentCountries, clearRecentCountries, type RecentCountry } from '../utils/countryStorage';

interface TimezoneSelectorProps {
  availableTimezones: Timezone[];
  onSelectTimezone: (timezone: Timezone) => void;
}

export const TimezoneSelector = ({
  availableTimezones,
  onSelectTimezone,
}: TimezoneSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentCountries, setRecentCountries] = useState<RecentCountry[]>(() => getRecentCountries());

  // Filter timezones based on search term
  const filteredTimezones = availableTimezones.filter(timezone =>
    timezone.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    timezone.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    timezone.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get country-based timezones when searching for a country
  const countryTimezones = searchTerm.length > 2 ? 
    getTimezonesByCountry(searchTerm) : [];

  // Get abbreviation-based timezones when searching for abbreviations (GMT, PST, etc.)
  const abbreviationTimezones = searchTerm.length >= 2 ? 
    getTimezonesByAbbreviation(searchTerm) : [];

  // Combine all relevant timezones, avoiding duplicates
  const allFoundTimezones = new Map<string, Timezone>();
  
  // Add filtered timezones first
  filteredTimezones.forEach(tz => allFoundTimezones.set(tz.value, tz));
  
  // Add country-based timezones
  countryTimezones.forEach(tz => {
    if (!allFoundTimezones.has(tz.value)) {
      allFoundTimezones.set(tz.value, tz);
    }
  });
  
  // Add abbreviation-based timezones
  abbreviationTimezones.forEach(tz => {
    if (!allFoundTimezones.has(tz.value)) {
      allFoundTimezones.set(tz.value, tz);
    }
  });

  const displayTimezones = Array.from(allFoundTimezones.values());

  const handleTimezoneSelect = (timezone: Timezone) => {
    // Save country information for recent countries
    const countryTimezoneCount = displayTimezones.filter(tz => tz.country === timezone.country).length;
    saveRecentCountry(timezone.country, timezone.flag, countryTimezoneCount);
    
    // Update recent countries state
    setRecentCountries(getRecentCountries());
    
    onSelectTimezone(timezone);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClearRecentCountries = () => {
    clearRecentCountries();
    setRecentCountries([]);
  };

  if (availableTimezones.length === 0) {
    return (
      <Card className="group cursor-pointer overflow-hidden bg-gradient-to-br from-slate-50/90 to-white/90 backdrop-blur-md border border-dashed border-slate-300 hover:border-blue-400 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 touch-manipulation h-full flex flex-col rounded-xl">
        <CardContent className="p-3 sm:p-4 flex-1 flex flex-col items-center justify-center text-center space-y-2 sm:space-y-3">
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer overflow-hidden bg-gradient-to-br from-slate-50/90 to-white/90 backdrop-blur-md border border-dashed border-slate-300 hover:border-blue-400 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 touch-manipulation h-full flex flex-col rounded-xl">
          <CardContent className="p-3 sm:p-4 flex-1 flex flex-col items-center justify-center text-center space-y-2 sm:space-y-3">
            {/* Icon container */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-sm group-hover:blur-none transition-all duration-300"></div>
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 rounded-full border border-blue-200/60 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                <Plus size={16} className="sm:w-5 sm:h-5 text-blue-600 group-hover:text-blue-700" />
              </div>
            </div>
            
            {/* Text content */}
            <div className="space-y-0.5 sm:space-y-1">
              <h3 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-blue-600 transition-colors duration-200">
                Add Timezone
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-tight">
                Search by city or country
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-sm mx-4 bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-800 text-center">
            Add Timezone
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
            <Input
              type="text"
              inputMode="search"
              placeholder="Search city, country, or timezone (GMT, PST, IST...)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-50/80 border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-200 rounded-xl h-12 text-base touch-manipulation"
              autoFocus
            />
          </div>

          {/* Search hints and recent countries for empty state */}
          {searchTerm.length === 0 && (
            <div className="space-y-3">
              {/* Recent Countries */}
              {recentCountries.length > 0 && (
                <div className="text-xs text-slate-600 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Recent Countries:</p>
                    <button
                      onClick={handleClearRecentCountries}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                      title="Clear recent countries"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {recentCountries.slice(0, 6).map((country) => (
                      <button
                        key={country.name}
                        onClick={() => setSearchTerm(country.name)}
                        className="bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
                      >
                        <span>{country.flag}</span>
                        <span>{country.name}</span>
                        <span className="text-blue-600">({country.timezoneCount})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Search Suggestions */}
              <div className="text-xs text-slate-500 text-center space-y-1">
                <p>Or try searching for:</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">GMT</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">PST</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">IST</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">London</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">Tokyo</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-xs text-slate-600 bg-blue-50/60 px-3 py-2 rounded-xl font-medium border border-blue-200/60">
            {displayTimezones.length} of {availableTimezones.length} timezones
          </div>

          {/* Timezone List */}
          <ScrollArea className="h-72 bg-slate-50/60 rounded-xl border border-slate-200">
            {displayTimezones.length === 0 ? (
              <div className="p-6 text-center space-y-2">
                <Globe className="w-8 h-8 mx-auto text-slate-400 opacity-50" />
                <p className="text-sm text-slate-600 font-medium">No timezones found</p>
                <p className="text-xs text-slate-500">Try searching for a city or country name</p>
                <p className="text-xs text-slate-400">e.g., "India", "Germany", "Australia"</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {displayTimezones.map((timezone) => (
                  <Button
                    key={timezone.id}
                    variant="ghost"
                    onClick={() => handleTimezoneSelect(timezone)}
                    className={`w-full justify-start h-auto p-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200 rounded-xl border border-transparent group touch-manipulation`}
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
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
