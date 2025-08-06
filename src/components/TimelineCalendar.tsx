import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { ChevronLeft, ChevronRight, Edit, Trash2, Clock, MapPin, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import type { ItineraryItem, CalendarView, TimelineView } from '@/types/itinerary';
import { COLOR_VARIANTS, CATEGORY_ICONS } from '@/types/itinerary';

interface TimelineCalendarProps {
  items: ItineraryItem[];
  calendarView: CalendarView;
  onNavigate: (direction: 'prev' | 'next') => void;
  onViewTypeChange: (type: CalendarView['type']) => void;
  onGoToToday: () => void;
  onGoToDate: (date: Date) => void;
  onEditItem: (item: ItineraryItem) => void;
  onDeleteItem: (id: string) => void;
  onDuplicateItem: (item: ItineraryItem) => void;
}

interface TimeSlot {
  hour: number;
  items: OverlapGroup[];
}

interface OverlapGroup {
  items: ItineraryItem[];
  startMinute: number;
  endMinute: number;
  column: number;
  totalColumns: number;
}

export const TimelineCalendar: React.FC<TimelineCalendarProps> = ({
  items,
  calendarView,
  onNavigate,
  onViewTypeChange,
  onGoToToday,
  onEditItem,
  onDeleteItem,
  onDuplicateItem
}) => {
  const { type, currentDate } = calendarView;
  const [timeRange, setTimeRange] = useState({ start: 0, end: 23 }); // 12 AM to 11:59 PM
  
  // Timeline filtering state
  const [timelineFilter, setTimelineFilter] = useState<TimelineView>({
    groupBy: 'day',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 3, 0)
  });
  
  const [showTimelineControls, setShowTimelineControls] = useState(false);

  // Filter items based on timeline controls
  const filteredItems = useMemo(() => {
    return items
      .filter(item => {
        const itemDate = new Date(item.startDate);
        return itemDate >= timelineFilter.startDate && itemDate <= timelineFilter.endDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }
        return a.startTime.localeCompare(b.startTime);
      });
  }, [items, timelineFilter]);

  // Get activity statistics
  const activityStats = useMemo(() => {
    const now = new Date();
    const total = filteredItems.length;
    const upcoming = filteredItems.filter(item => new Date(item.startDate) > now).length;
    const past = filteredItems.filter(item => new Date(item.endDate || item.startDate) < now).length;
    const today = filteredItems.filter(item => {
      const itemDate = new Date(item.startDate);
      return itemDate.toDateString() === now.toDateString();
    }).length;
    
    return { total, upcoming, past, today };
  }, [filteredItems]);

  // Generate time slots for the timeline
  const timeSlots = useMemo(() => {
    const slots: number[] = [];
    for (let hour = timeRange.start; hour <= timeRange.end; hour++) {
      slots.push(hour);
    }
    return slots;
  }, [timeRange]);

  // Get calendar days to display
  const calendarDays = useMemo(() => {
    if (type === 'week') {
      const days = [];
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        days.push(day);
      }
      return days;
    } else {
      return [new Date(currentDate)];
    }
  }, [currentDate, type]);

  // Parse time string to minutes since midnight
  const parseTime = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Get items for a specific date with overlap detection
  const getItemsForDateWithOverlaps = (date: Date): TimeSlot[] => {
    const dayItems = filteredItems.filter(item => {
      const itemStartDate = new Date(item.startDate);
      const itemEndDate = item.endDate ? new Date(item.endDate) : new Date(item.startDate);
      
      // Check if the date falls within the item's date range
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      
      const startDate = new Date(itemStartDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(itemEndDate);
      endDate.setHours(23, 59, 59, 999);
      
      return targetDate >= startDate && targetDate <= endDate;
    });

    const timeSlotMap = new Map<number, ItineraryItem[]>();

    // Group items by hour
    dayItems.forEach(item => {
      if (item.isAllDay) {
        // All-day items go in a special slot at the top
        for (let hour = timeRange.start; hour <= timeRange.end; hour++) {
          if (!timeSlotMap.has(hour)) {
            timeSlotMap.set(hour, []);
          }
          if (hour === timeRange.start) { // Only add to first slot to avoid duplicates
            timeSlotMap.get(hour)!.push(item);
          }
        }
      } else {
        // For multi-day events, adjust times based on current viewing date
        const itemStartDate = new Date(item.startDate);
        const itemEndDate = item.endDate ? new Date(item.endDate) : new Date(item.startDate);
        const viewingDate = new Date(date);
        
        let startMinutes: number;
        let endMinutes: number;
        
        // Determine effective start time for this viewing date
        if (itemStartDate.toDateString() === viewingDate.toDateString()) {
          // This is the actual start date, use the specified start time
          startMinutes = parseTime(item.startTime);
        } else {
          // This is a continuation day, start from beginning of day
          startMinutes = 0;
        }
        
        // Determine effective end time for this viewing date
        if (itemEndDate.toDateString() === viewingDate.toDateString()) {
          // This is the actual end date, use the specified end time or default
          endMinutes = item.endTime ? parseTime(item.endTime) : startMinutes + 60;
        } else {
          // This is not the final day, go to end of day
          endMinutes = 24 * 60; // End of day (24:00)
        }
        
        const startHour = Math.floor(startMinutes / 60);
        const endHour = Math.min(Math.ceil(endMinutes / 60), 24);

        for (let hour = Math.max(startHour, timeRange.start); hour <= Math.min(endHour - 1, timeRange.end); hour++) {
          if (!timeSlotMap.has(hour)) {
            timeSlotMap.set(hour, []);
          }
          timeSlotMap.get(hour)!.push(item);
        }
      }
    });

    // Convert to TimeSlot array with overlap detection
    const slots: TimeSlot[] = [];
    
    for (let hour = timeRange.start; hour <= timeRange.end; hour++) {
      const hourItems = timeSlotMap.get(hour) || [];
      const overlapGroups = detectOverlaps(hourItems, hour, date);
      
      slots.push({
        hour,
        items: overlapGroups
      });
    }

    return slots;
  };

  // Detect overlapping items and organize them into columns
  const detectOverlaps = (hourItems: ItineraryItem[], hour: number, viewingDate: Date): OverlapGroup[] => {
    if (hourItems.length === 0) return [];

    // Filter items that actually occur in this hour
    const relevantItems = hourItems.filter(item => {
      if (item.isAllDay) return hour === timeRange.start; // Only show all-day in first slot
      
      // For multi-day events, calculate effective start and end times for this viewing date
      const itemStartDate = new Date(item.startDate);
      const itemEndDate = item.endDate ? new Date(item.endDate) : new Date(item.startDate);
      
      let startMinutes: number;
      let endMinutes: number;
      
      if (itemStartDate.toDateString() === viewingDate.toDateString()) {
        startMinutes = parseTime(item.startTime);
      } else {
        startMinutes = 0;
      }
      
      if (itemEndDate.toDateString() === viewingDate.toDateString()) {
        endMinutes = item.endTime ? parseTime(item.endTime) : startMinutes + 60;
      } else {
        endMinutes = 24 * 60;
      }
      
      const hourStart = hour * 60;
      const hourEnd = (hour + 1) * 60;
      
      return startMinutes < hourEnd && endMinutes > hourStart;
    });

    if (relevantItems.length === 0) return [];

    // Sort by start time
    const sortedItems = relevantItems.sort((a, b) => {
      if (a.isAllDay && !b.isAllDay) return -1;
      if (!a.isAllDay && b.isAllDay) return 1;
      if (a.isAllDay && b.isAllDay) return 0;
      return parseTime(a.startTime) - parseTime(b.startTime);
    });

    // Group overlapping items
    const groups: OverlapGroup[] = [];
    const columns: { startMinute: number; endMinute: number }[] = [];

    sortedItems.forEach(item => {
      let startMinute: number;
      let endMinute: number;
      
      if (item.isAllDay) {
        startMinute = hour * 60;
        endMinute = (hour + 1) * 60;
      } else {
        // For multi-day events, calculate effective times for this viewing date
        const itemStartDate = new Date(item.startDate);
        const itemEndDate = item.endDate ? new Date(item.endDate) : new Date(item.startDate);
        
        if (itemStartDate.toDateString() === viewingDate.toDateString()) {
          startMinute = parseTime(item.startTime);
        } else {
          startMinute = 0; // Start of day for continuation
        }
        
        if (itemEndDate.toDateString() === viewingDate.toDateString()) {
          endMinute = item.endTime ? parseTime(item.endTime) : startMinute + 60;
        } else {
          endMinute = 24 * 60; // End of day for continuation
        }
        
        // Clamp to the current hour window
        const hourStart = hour * 60;
        const hourEnd = (hour + 1) * 60;
        startMinute = Math.max(startMinute, hourStart);
        endMinute = Math.min(endMinute, hourEnd);
      }

      // Find a column that doesn't overlap
      let columnIndex = 0;
      while (columnIndex < columns.length) {
        const column = columns[columnIndex];
        if (startMinute >= column.endMinute || endMinute <= column.startMinute) {
          break;
        }
        columnIndex++;
      }

      // Create or update column
      if (columnIndex >= columns.length) {
        columns.push({ startMinute, endMinute });
      } else {
        columns[columnIndex] = {
          startMinute: Math.min(columns[columnIndex].startMinute, startMinute),
          endMinute: Math.max(columns[columnIndex].endMinute, endMinute)
        };
      }

      // Find or create overlap group
      let group = groups.find(g => g.column === columnIndex);
      if (!group) {
        group = {
          items: [],
          startMinute,
          endMinute,
          column: columnIndex,
          totalColumns: columns.length
        };
        groups.push(group);
      }

      group.items.push(item);
      group.startMinute = Math.min(group.startMinute, startMinute);
      group.endMinute = Math.max(group.endMinute, endMinute);
    });

    // Update total columns for all groups
    groups.forEach(group => {
      group.totalColumns = columns.length;
    });

    return groups;
  };

  const formatTime = (hour: number): string => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${ampm}`;
  };

  const formatItemTime = (item: ItineraryItem): string => {
    if (item.isAllDay) return 'All day';
    
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    return `${formatTime(item.startTime)}${item.endTime ? ` - ${formatTime(item.endTime)}` : ''}`;
  };

  const formatHeaderDate = () => {
    if (type === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `Week of ${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getItemHeight = (item: ItineraryItem, hour: number): string => {
    if (item.isAllDay) return '32px';
    
    const startMinutes = parseTime(item.startTime);
    const endMinutes = item.endTime ? parseTime(item.endTime) : startMinutes + 60;
    const hourStart = hour * 60;
    const hourEnd = (hour + 1) * 60;
    
    const visibleStart = Math.max(startMinutes, hourStart);
    const visibleEnd = Math.min(endMinutes, hourEnd);
    const visibleDuration = Math.max(0, visibleEnd - visibleStart);
    
    // Convert to percentage of hour slot (60px base height)
    const percentage = (visibleDuration / 60) * 100;
    return `${Math.max(percentage, 20)}%`; // Minimum 20% height
  };

  const getItemTop = (item: ItineraryItem, hour: number): string => {
    if (item.isAllDay) return '0px';
    
    const startMinutes = parseTime(item.startTime);
    const hourStart = hour * 60;
    
    if (startMinutes <= hourStart) return '0px';
    
    const offsetMinutes = startMinutes - hourStart;
    const percentage = (offsetMinutes / 60) * 100;
    return `${percentage}%`;
  };

  return (
    <div className="space-y-4">
      {/* Timeline Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Schedule Timeline
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTimelineControls(!showTimelineControls)}
            >
              {showTimelineControls ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Filters
            </Button>
          </CardTitle>
        </CardHeader>
        {showTimelineControls && (
          <CardContent className="space-y-4">
            {/* Activity Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{activityStats.total}</div>
                <div className="text-sm text-blue-700">Total</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{activityStats.today}</div>
                <div className="text-sm text-green-700">Today</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{activityStats.upcoming}</div>
                <div className="text-sm text-orange-700">Upcoming</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{activityStats.past}</div>
                <div className="text-sm text-gray-700">Past</div>
              </div>
            </div>

            {/* Date Range Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">Date Range</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      const weekStart = new Date(today);
                      weekStart.setDate(today.getDate() - today.getDay());
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekStart.getDate() + 6);
                      setTimelineFilter(prev => ({
                        ...prev,
                        startDate: weekStart,
                        endDate: weekEnd
                      }));
                    }}
                    className="text-xs"
                  >
                    This Week
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      setTimelineFilter(prev => ({
                        ...prev,
                        startDate: new Date(today.getFullYear(), today.getMonth(), 1),
                        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0)
                      }));
                    }}
                    className="text-xs"
                  >
                    This Month
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      setTimelineFilter(prev => ({
                        ...prev,
                        startDate: new Date(today.getFullYear(), 0, 1),
                        endDate: new Date(today.getFullYear(), 11, 31)
                      }));
                    }}
                    className="text-xs"
                  >
                    This Year
                  </Button>
                </div>
              </div>
              
              {/* Unified Date Range Picker */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  Select Date Range
                </label>
                <DateRangePicker
                  startDate={timelineFilter.startDate}
                  endDate={timelineFilter.endDate}
                  onDateRangeSelect={(range) => setTimelineFilter(prev => ({
                    ...prev,
                    startDate: range.startDate,
                    endDate: range.endDate
                  }))}
                />
              </div>
              
              {/* Date Range Summary */}
              <div className="p-3 bg-muted/50 rounded-lg border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Selected Range:</span>
                  <span className="font-medium">
                    {Math.ceil((timelineFilter.endDate.getTime() - timelineFilter.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {timelineFilter.startDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })} → {timelineFilter.endDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
            </div>

            {/* Time Range Controls */}
            {/* Time Range Controls */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Time Range</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">
                    Start Time (Hour)
                  </label>
                  <select 
                    value={timeRange.start}
                    onChange={(e) => setTimeRange(prev => ({ 
                      ...prev, 
                      start: Math.min(parseInt(e.target.value) || 0, prev.end - 1)
                    }))}
                    className="w-full px-3 py-2 border border-input bg-background text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">
                    End Time (Hour)
                  </label>
                  <select
                    value={timeRange.end}
                    onChange={(e) => setTimeRange(prev => ({ 
                      ...prev, 
                      end: Math.max(parseInt(e.target.value) || 23, prev.start + 1)
                    }))}
                    className="w-full px-3 py-2 border border-input bg-background text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Quick Time Range Presets */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTimeRange({ start: 6, end: 22 })}
                  className="text-xs"
                >
                  Day Hours (6 AM - 10 PM)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTimeRange({ start: 9, end: 17 })}
                  className="text-xs"
                >
                  Business Hours (9 AM - 5 PM)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTimeRange({ start: 0, end: 23 })}
                  className="text-xs"
                >
                  Full Day (24 hours)
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('prev')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <h3 className="text-lg font-semibold text-gray-900 min-w-0">
            {formatHeaderDate()}
          </h3>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('next')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onGoToToday}
          >
            Today
          </Button>
          
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={type === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewTypeChange('day')}
              className="px-3 py-1 text-xs"
            >
              Day
            </Button>
            <Button
              variant={type === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewTypeChange('week')}
              className="px-3 py-1 text-xs"
            >
              Week
            </Button>
          </div>
        </div>
      </div>

      {/* Time Range Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Time Range:</span>
            <div className="flex items-center gap-2">
              <select
                value={timeRange.start}
                onChange={(e) => setTimeRange(prev => ({ ...prev, start: parseInt(e.target.value) }))}
                className="text-sm border rounded px-2 py-1"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{formatTime(i)}</option>
                ))}
              </select>
              <span className="text-sm text-gray-500">to</span>
              <select
                value={timeRange.end}
                onChange={(e) => setTimeRange(prev => ({ ...prev, end: parseInt(e.target.value) }))}
                className="text-sm border rounded px-2 py-1"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{formatTime(i)}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Grid */}
      {filteredItems.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No activities in this time range</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              Adjust your date range or time filters above, or add some activities to see them here!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden bg-white">
        {/* Header Row */}
        <div className={`grid ${type === 'week' ? 'grid-cols-8' : 'grid-cols-2'} border-b`}>
          <div className="p-3 bg-gray-50 border-r font-medium text-sm text-gray-700">
            Time
          </div>
          {calendarDays.map((date, index) => (
            <div
              key={index}
              className={`p-3 bg-gray-50 text-center font-medium text-sm ${
                isToday(date) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              } ${index < calendarDays.length - 1 ? 'border-r' : ''}`}
            >
              <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div className="text-lg font-semibold">{date.getDate()}</div>
            </div>
          ))}
        </div>

        {/* Time Slots */}
        {timeSlots.map((hour) => (
          <div
            key={hour}
            className={`grid ${type === 'week' ? 'grid-cols-8' : 'grid-cols-2'} border-b min-h-[60px]`}
          >
            {/* Time Label */}
            <div className="p-3 bg-gray-50 border-r flex items-start">
              <span className="text-sm font-medium text-gray-600">
                {formatTime(hour)}
              </span>
            </div>

            {/* Day Columns */}
            {calendarDays.map((date, dayIndex) => {
              const dayTimeSlots = getItemsForDateWithOverlaps(date);
              const hourSlot = dayTimeSlots.find(slot => slot.hour === hour);

              return (
                <div
                  key={dayIndex}
                  className={`relative p-1 ${dayIndex < calendarDays.length - 1 ? 'border-r' : ''} ${
                    isToday(date) ? 'bg-blue-50/30' : ''
                  }`}
                >
                  {hourSlot?.items.map((group, groupIndex) => (
                    <div
                      key={groupIndex}
                      className="absolute inset-x-1"
                      style={{
                        left: `${(group.column / group.totalColumns) * 100}%`,
                        width: `${100 / group.totalColumns}%`,
                        paddingLeft: '2px',
                        paddingRight: '2px'
                      }}
                    >
                      {group.items.map((item) => {
                        const colorVariant = COLOR_VARIANTS[item.color];
                        return (
                          <div
                            key={item.id}
                            className={`relative rounded text-xs p-1 mb-1 cursor-pointer transition-all hover:shadow-md ${colorVariant.bg} ${colorVariant.border} border group/item`}
                            style={{
                              height: getItemHeight(item, hour),
                              top: getItemTop(item, hour)
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditItem(item);
                            }}
                          >
                            <div className="flex items-start justify-between h-full">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 mb-1">
                                  <span className="text-xs">
                                    {CATEGORY_ICONS[item.category || 'other']}
                                  </span>
                                  <span className={`font-medium truncate ${colorVariant.text}`}>
                                    {item.title}
                                  </span>
                                </div>
                                
                                <div className={`text-xs ${colorVariant.text} opacity-75 mb-1`}>
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {formatItemTime(item)}
                                </div>
                                
                                {item.location && (
                                  <div className={`text-xs ${colorVariant.text} opacity-75 truncate`}>
                                    <MapPin className="w-3 h-3 inline mr-1" />
                                    {item.location}
                                  </div>
                                )}
                              </div>

                              {/* Action buttons on hover */}
                              <div className="opacity-0 group-hover/item:opacity-100 flex gap-1 ml-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEditItem(item);
                                  }}
                                  className="h-4 w-4 p-0"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDuplicateItem(item);
                                  }}
                                  className="h-4 w-4 p-0 text-blue-600 hover:text-blue-700"
                                  title="Duplicate item"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteItem(item.id);
                                  }}
                                  className="h-4 w-4 p-0 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      )}

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">Timeline View Features:</p>
            <ul className="space-y-1 text-xs">
              <li>• Activities are positioned by their start time and duration</li>
              <li>• Overlapping activities are shown in separate columns side by side</li>
              <li>• All-day events appear at the top of each time slot</li>
              <li>• Click on any activity to edit, hover for quick actions</li>
              <li>• Adjust time range to focus on specific hours</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
