import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Trash2, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Copy
} from 'lucide-react';
import type { ItineraryItem, TimelineView } from '@/types/itinerary';
import { COLOR_VARIANTS, CATEGORY_ICONS } from '@/types/itinerary';

interface ItineraryTimelineProps {
  items: ItineraryItem[];
  onEditItem: (item: ItineraryItem) => void;
  onDeleteItem: (id: string) => void;
  onDuplicateItem: (item: ItineraryItem) => void;
}

interface TimelineGroup {
  title: string;
  date: Date;
  items: ItineraryItem[];
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  items,
  onEditItem,
  onDeleteItem,
  onDuplicateItem
}) => {
  const [timelineView, setTimelineView] = useState<TimelineView>({
    groupBy: 'day',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 3, 0)
  });
  
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const filteredItems = useMemo(() => {
    return items
      .filter(item => {
        const itemDate = new Date(item.startDate);
        // Normalize dates to compare only the date part, not time
        const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
        const startDateOnly = new Date(timelineView.startDate.getFullYear(), timelineView.startDate.getMonth(), timelineView.startDate.getDate());
        const endDateOnly = new Date(timelineView.endDate.getFullYear(), timelineView.endDate.getMonth(), timelineView.endDate.getDate());
        
        return itemDateOnly >= startDateOnly && itemDateOnly <= endDateOnly;
      })
      .sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }
        return a.startTime.localeCompare(b.startTime);
      });
  }, [items, timelineView]);

  const timelineGroups = useMemo(() => {
    const groups: TimelineGroup[] = [];
    const groupMap = new Map<string, ItineraryItem[]>();

    filteredItems.forEach(item => {
      const itemDate = new Date(item.startDate);
      let groupKey: string;

      if (timelineView.groupBy === 'month') {
        groupKey = `${itemDate.getFullYear()}-${itemDate.getMonth()}`;
      } else if (timelineView.groupBy === 'week') {
        const startOfWeek = new Date(itemDate);
        startOfWeek.setDate(itemDate.getDate() - itemDate.getDay());
        groupKey = `${startOfWeek.getFullYear()}-${startOfWeek.getMonth()}-${startOfWeek.getDate()}`;
      } else {
        groupKey = `${itemDate.getFullYear()}-${itemDate.getMonth()}-${itemDate.getDate()}`;
      }

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, []);
      }
      groupMap.get(groupKey)!.push(item);
    });

    Array.from(groupMap.entries()).forEach(([, groupItems]) => {
      const firstItem = groupItems[0];
      const itemDate = new Date(firstItem.startDate);
      let groupTitle: string;
      let groupDate: Date;

      if (timelineView.groupBy === 'month') {
        groupTitle = itemDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        groupDate = new Date(itemDate.getFullYear(), itemDate.getMonth(), 1);
      } else if (timelineView.groupBy === 'week') {
        const startOfWeek = new Date(itemDate);
        startOfWeek.setDate(itemDate.getDate() - itemDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        groupTitle = `Week of ${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        groupDate = startOfWeek;
      } else {
        groupTitle = itemDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });
        groupDate = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
      }

      groups.push({
        title: groupTitle,
        date: groupDate,
        items: groupItems
      });
    });

    return groups.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [filteredItems, timelineView.groupBy]);  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const toggleGroup = (groupTitle: string) => {
    const newExpanded = new Set(expandedGroups);
    if (expandedGroups.has(groupTitle)) {
      newExpanded.delete(groupTitle);
    } else {
      newExpanded.add(groupTitle);
    }
    setExpandedGroups(newExpanded);
  };

  const isUpcoming = (item: ItineraryItem) => {
    const now = new Date();
    const itemDate = new Date(item.startDate);
    return itemDate > now;
  };

  const isPast = (item: ItineraryItem) => {
    const now = new Date();
    const itemDate = new Date(item.endDate || item.startDate);
    return itemDate < now;
  };

  return (
    <div className="space-y-4">
      {/* Clean Timeline Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <CardTitle className="text-base">Timeline</CardTitle>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredItems.length} {filteredItems.length === 1 ? 'activity' : 'activities'}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Group By Controls */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Group By</h4>
            <div className="flex gap-1">
              {(['day', 'week', 'month'] as const).map((groupType) => (
                <Button
                  key={groupType}
                  variant={timelineView.groupBy === groupType ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimelineView(prev => ({ ...prev, groupBy: groupType }))}
                  className="capitalize text-xs"
                >
                  {groupType}
                </Button>
              ))}
            </div>
          </div>

          {/* Clean Date Range Controls */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Date Range</h4>
            
            {/* Simple Quick Date Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  setTimelineView(prev => ({
                    ...prev,
                    startDate: today,
                    endDate: today
                  }));
                }}
                className="text-xs"
              >
                <CalendarIcon className="w-3 h-3 mr-1" />
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const weekStart = new Date(today);
                  weekStart.setDate(today.getDate() - today.getDay());
                  const weekEnd = new Date(weekStart);
                  weekEnd.setDate(weekStart.getDate() + 6);
                  setTimelineView(prev => ({
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
                  setTimelineView(prev => ({
                    ...prev,
                    startDate: new Date(today.getFullYear(), today.getMonth(), 1),
                    endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0)
                  }));
                }}
                className="text-xs"
              >
                This Month
              </Button>
            </div>
            
            {/* Custom Date Range Picker */}
            <div className="pt-2 border-t">
              <DateRangePicker
                startDate={timelineView.startDate}
                endDate={timelineView.endDate}
                onDateRangeSelect={(range) => setTimelineView(prev => ({
                  ...prev,
                  startDate: range.startDate,
                  endDate: range.endDate
                }))}
              />
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Simple Timeline Groups */}
      <div className="space-y-4">
        {timelineGroups.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CalendarIcon className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No activities in this time range</h3>
              <p className="text-muted-foreground text-center">
                Adjust your date range or add some activities to see them here.
              </p>
            </CardContent>
          </Card>
        ) : (
          timelineGroups.map((group) => {
            const isExpanded = expandedGroups.has(group.title);
            const totalItems = group.items.length;
            const upcomingCount = group.items.filter(isUpcoming).length;
            const pastCount = group.items.filter(isPast).length;

            return (
              <Card key={group.title}>
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleGroup(group.title)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{group.title}</CardTitle>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>{totalItems} {totalItems === 1 ? 'activity' : 'activities'}</span>
                        {upcomingCount > 0 && (
                          <span className="text-green-600">{upcomingCount} upcoming</span>
                        )}
                        {pastCount > 0 && (
                          <span className="text-gray-500">{pastCount} past</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {group.items.map((item, itemIndex) => {
                        const colorVariant = COLOR_VARIANTS[item.color];
                        const upcoming = isUpcoming(item);
                        const past = isPast(item);

                        return (
                          <div
                            key={item.id}
                            className={`relative pl-8 pb-4 ${
                              itemIndex < group.items.length - 1 ? 'border-l-2 border-gray-200' : ''
                            }`}
                          >
                            {/* Timeline dot */}
                            <div 
                              className={`absolute left-0 top-2 w-4 h-4 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 ${colorVariant.bg} ${colorVariant.border}`}
                            />

                            <Card className={`ml-4 ${past ? 'opacity-75' : ''}`}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    {/* Item header */}
                                    <div className="flex items-start gap-3 mb-2">
                                      <div className={`p-2 rounded-lg ${colorVariant.bg} flex-shrink-0`}>
                                        <span className="text-lg">
                                          {CATEGORY_ICONS[item.category || 'other']}
                                        </span>
                                      </div>
                                      
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                          <div>
                                            <h4 className="font-semibold text-gray-900 truncate">
                                              {item.title}
                                            </h4>
                                            {item.description && (
                                              <p className="text-gray-600 text-sm mt-1">
                                                {item.description}
                                              </p>
                                            )}
                                          </div>
                                          
                                          {upcoming && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                                              Upcoming
                                            </span>
                                          )}
                                          
                                          {past && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ml-2">
                                              Past
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Item details */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 ml-14">
                                      {/* Time */}
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span>
                                          {item.isAllDay ? 'All day' : (
                                            <>
                                              {formatTime(item.startTime)}
                                              {item.endTime && ` - ${formatTime(item.endTime)}`}
                                            </>
                                          )}
                                        </span>
                                      </div>

                                      {/* Location */}
                                      {item.location && (
                                        <div className="flex items-center gap-2">
                                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                          <span className="truncate">{item.location}</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Notes */}
                                    {item.notes && (
                                      <div className="mt-3 ml-14 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-700">{item.notes}</p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Actions */}
                                  <div className="flex items-center gap-2 ml-4">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => onEditItem(item)}
                                      className="p-2"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => onDuplicateItem(item)}
                                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                      title="Duplicate item"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => onDeleteItem(item.id)}
                                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
