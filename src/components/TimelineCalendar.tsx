import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { ChevronLeft, ChevronRight, Edit, Trash2, Clock, MapPin, Copy, Calendar as CalendarIcon } from 'lucide-react';
import type { ItineraryItem, CalendarView } from '@/types/itinerary';
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
  onGoToDate,
  onEditItem,
  onDeleteItem,
  onDuplicateItem
}) => {
  const { type, currentDate } = calendarView;
  const [timeRange] = useState({ start: 0, end: 23 }); // Always show all day (00:00 to 23:59)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Use all items without filtering
  const filteredItems = useMemo(() => {
    return items
      .sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }
        return a.startTime.localeCompare(b.startTime);
      });
  }, [items]);

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

  const formatTime = (hour: number) => {
    if (hour === 0) return '12:00 AM';
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return '12:00 PM';
    return `${hour - 12}:00 PM`;
  };

  const formatItemTime = (item: ItineraryItem) => {
    if (item.isAllDay) return 'All day';
    const start = formatTime12Hour(item.startTime);
    const end = item.endTime ? formatTime12Hour(item.endTime) : '';
    return end ? `${start} - ${end}` : start;
  };

  const formatTime12Hour = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Function to get items for a specific date with overlap handling
  const getItemsForDateWithOverlaps = (date: Date) => {
    const dateItems = filteredItems.filter(item => {
      const itemDate = new Date(item.startDate);
      return itemDate.toDateString() === date.toDateString();
    });

    const timeSlots: TimeSlot[] = [];
    
    Array.from({ length: timeRange.end - timeRange.start + 1 }, (_, i) => {
      const hour = timeRange.start + i;
      const hourItems = dateItems.filter(item => {
        if (item.isAllDay) return hour === timeRange.start; // Show all-day at first hour
        const startHour = parseInt(item.startTime.split(':')[0]);
        const endHour = item.endTime ? parseInt(item.endTime.split(':')[0]) : startHour;
        return startHour <= hour && hour <= endHour;
      });

      if (hourItems.length > 0) {
        const groups = processOverlappingItems(hourItems);
        timeSlots.push({ hour, items: groups });
      }
    });

    return timeSlots;
  };

  const processOverlappingItems = (items: ItineraryItem[]): OverlapGroup[] => {
    if (items.length === 0) return [];
    
    // Simple column assignment for overlapping items
    const groups: OverlapGroup[] = items.map((item, index) => ({
      items: [item],
      startMinute: 0,
      endMinute: 59,
      column: index,
      totalColumns: items.length
    }));

    return groups;
  };

  const getItemHeight = (item: ItineraryItem) => {
    if (item.isAllDay) return '40px';
    
    const startHour = parseInt(item.startTime.split(':')[0]);
    const endHour = item.endTime ? parseInt(item.endTime.split(':')[0]) : startHour;
    const duration = Math.max(1, endHour - startHour);
    
    return `${Math.min(duration * 50, 200)}px`;
  };

  const getItemTop = (item: ItineraryItem, hour: number) => {
    const startHour = parseInt(item.startTime.split(':')[0]);
    const startMinute = parseInt(item.startTime.split(':')[1]);
    
    if (startHour === hour) {
      return `${(startMinute / 60) * 50}px`;
    }
    return '0px';
  };

  return (
    <div className="space-y-4">
      {/* Clean Schedule Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <CardTitle className="text-base">Schedule View</CardTitle>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredItems.length} {filteredItems.length === 1 ? 'activity' : 'activities'}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* View Type Controls */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">View Mode</h4>
            <div className="flex gap-1">
              <Button
                variant={type === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onViewTypeChange('day')}
                className="text-xs"
              >
                Day View
              </Button>
              <Button
                variant={type === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onViewTypeChange('week')}
                className="text-xs"
              >
                Week View
              </Button>
            </div>
          </div>

          {/* Date Selector */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Select Date</h4>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('prev')}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="text-sm font-medium min-w-0">
                  {type === 'week' ? (
                    `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                  ) : (
                    currentDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('next')}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <div>
                  <DatePicker
                  className='m-0'
                    selectedDate={selectedDate}
                    onDateSelect={(date: Date) => {
                      setSelectedDate(date);
                      onGoToDate(date);
                    }}
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    setSelectedDate(today);
                    onGoToToday();
                  }}
                  className="text-xs flex items-center gap-1"
                >
                  <CalendarIcon className="h-3 w-3" />
                  Today
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Timeline Grid */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No activities in this time range</h3>
            <p className="text-muted-foreground text-center">
              Adjust your date range or time filters, or add some activities to see them here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile View */}
          <div className="block lg:hidden space-y-3">
            {calendarDays.map((date, dayIndex) => {
              const dayItems = filteredItems.filter(item => {
                const itemDate = new Date(item.startDate);
                return itemDate.toDateString() === date.toDateString();
              });

              return (
                <Card key={dayIndex} className={`${isToday(date) ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardContent className="p-4">
                    {/* Mobile Day Header */}
                    <div className={`text-center mb-4 pb-3 border-b ${
                      isToday(date) ? 'bg-blue-50 text-blue-700 -m-4 p-4 mb-4' : ''
                    }`}>
                      <div className="text-sm font-medium">
                        {date.toLocaleDateString('en-US', { weekday: 'long' })}
                      </div>
                      <div className="text-xl font-bold">{date.getDate()}</div>
                      <div className="text-sm text-gray-500">
                        {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                    </div>

                    {/* Mobile Activity List */}
                    {dayItems.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No activities scheduled</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {dayItems
                          .sort((a, b) => a.startTime.localeCompare(b.startTime))
                          .map((item) => {
                            const colorVariant = COLOR_VARIANTS[item.color];
                            return (
                              <div
                                key={item.id}
                                className={`p-3 rounded-lg border-l-4 ${colorVariant.bg} ${colorVariant.border} cursor-pointer hover:shadow-md transition-all`}
                                onClick={() => onEditItem(item)}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-base">
                                        {CATEGORY_ICONS[item.category || 'other']}
                                      </span>
                                      <span className={`font-semibold ${colorVariant.text}`}>
                                        {item.title}
                                      </span>
                                    </div>
                                    
                                    <div className="space-y-1 text-sm">
                                      <div className={`flex items-center gap-2 ${colorVariant.text} opacity-80`}>
                                        <Clock className="w-4 h-4" />
                                        {formatItemTime(item)}
                                      </div>
                                      
                                      {item.location && (
                                        <div className={`flex items-center gap-2 ${colorVariant.text} opacity-80`}>
                                          <MapPin className="w-4 h-4" />
                                          <span className="truncate">{item.location}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Mobile Action Buttons */}
                                  <div className="flex gap-1 ml-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onEditItem(item);
                                      }}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDuplicateItem(item);
                                      }}
                                      className="h-8 w-8 p-0 text-blue-600"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteItem(item.id);
                                      }}
                                      className="h-8 w-8 p-0 text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Desktop Grid View */}
          <Card className="hidden lg:block">
            <CardContent className="p-0">
              <div className="border rounded-lg overflow-hidden bg-white">
                {/* Header Row */}
                <div className={`grid ${type === 'week' ? 'grid-cols-8' : 'grid-cols-2'} border-b bg-gray-50`}>
                  <div className="p-3 border-r font-medium text-sm text-gray-700">
                    Time
                  </div>
                  {calendarDays.map((date, index) => (
                    <div
                      key={index}
                      className={`p-3 text-center font-medium text-sm border-r last:border-r-0 ${
                        isToday(date) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <div className="text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="text-lg font-semibold">{date.getDate()}</div>
                      <div className="text-xs text-gray-500">
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                {timeSlots.map((hour) => (
                  <div
                    key={hour}
                    className={`grid ${type === 'week' ? 'grid-cols-8' : 'grid-cols-2'} border-b last:border-b-0 min-h-[60px]`}
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
                          className={`relative p-1 border-r last:border-r-0 ${
                            isToday(date) ? 'bg-blue-50/30' : ''
                          } hover:bg-gray-50/50 transition-colors`}
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
                                    className={`relative rounded text-xs p-2 mb-1 cursor-pointer transition-all hover:shadow-sm ${colorVariant.bg} ${colorVariant.border} border group/item`}
                                    style={{
                                      height: getItemHeight(item),
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
            </CardContent>
          </Card>
        </>
      )}

      {/* Simple Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'activity' : 'activities'} 
              for your schedule
            </span>
            <span>
              Time range: {formatTime(timeRange.start)} - {formatTime(timeRange.end)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
