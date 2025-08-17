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

interface OverlapInfo {
  hasOverlap: boolean;
  overlapCount: number;
  conflictingItems: Array<{
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    overlapPeriod: string;
  }>;
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

      if (timelineView.groupBy === 'month') {
        const groupTitle = itemDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const groupDate = new Date(itemDate.getFullYear(), itemDate.getMonth(), 1);
        groups.push({ title: groupTitle, date: groupDate, items: groupItems });
      } else if (timelineView.groupBy === 'week') {
        const startOfWeek = new Date(itemDate);
        startOfWeek.setDate(itemDate.getDate() - itemDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        const groupTitle = `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        groups.push({ title: groupTitle, date: startOfWeek, items: groupItems });
      } else {
        const groupTitle = itemDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        const groupDate = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
        groups.push({ title: groupTitle, date: groupDate, items: groupItems });
      }
    });

    return groups.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [filteredItems, timelineView.groupBy]);

  const formatTime = (time: string) => {
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

  // Enhanced overlap detection with conflict details
  const getOverlapInfo = (item: ItineraryItem, allItems: ItineraryItem[]): OverlapInfo => {
    if (!item.endTime || item.isAllDay) {
      return { hasOverlap: false, overlapCount: 0, conflictingItems: [] };
    }

    const itemStart = new Date(`1970-01-01T${item.startTime}`);
    const itemEnd = new Date(`1970-01-01T${item.endTime}`);
    const conflictingItems: OverlapInfo['conflictingItems'] = [];

    allItems.forEach(otherItem => {
      if (otherItem.id === item.id || !otherItem.endTime || otherItem.isAllDay) return;
      
      const otherStart = new Date(`1970-01-01T${otherItem.startTime}`);
      const otherEnd = new Date(`1970-01-01T${otherItem.endTime}`);
      
      if (itemStart < otherEnd && itemEnd > otherStart) {
        // Calculate overlap period
        const overlapStart = new Date(Math.max(itemStart.getTime(), otherStart.getTime()));
        const overlapEnd = new Date(Math.min(itemEnd.getTime(), otherEnd.getTime()));
        
        const formatOverlapTime = (date: Date) => {
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const displayHour = hours % 12 || 12;
          return `${displayHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        };

        conflictingItems.push({
          id: otherItem.id,
          title: otherItem.title,
          startTime: otherItem.startTime,
          endTime: otherItem.endTime,
          overlapPeriod: `${formatOverlapTime(overlapStart)} - ${formatOverlapTime(overlapEnd)}`
        });
      }
    });

    return {
      hasOverlap: conflictingItems.length > 0,
      overlapCount: conflictingItems.length + 1, // +1 to include current item
      conflictingItems
    };
  };

  return (
    <div className="space-y-4">
      {/* Minimal Timeline Controls */}
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
          <DateRangePicker
            startDate={timelineView.startDate}
            endDate={timelineView.endDate}
            onDateRangeSelect={(range) => setTimelineView(prev => ({
              ...prev,
              startDate: range.startDate,
              endDate: range.endDate
            }))}
          />
        </CardContent>
      </Card>

      {/* Timeline Content */}
      {timelineGroups.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Activities Found</h3>
            <p className="text-gray-600">No activities found in this date range.</p>
          </CardContent>
        </Card>
      ) : (
        timelineGroups.map((group) => {
          const isExpanded = expandedGroups.has(group.title);
          const hasOverlaps = group.items.some(item => getOverlapInfo(item, group.items).hasOverlap);

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
                      <span>{group.items.length} {group.items.length === 1 ? 'activity' : 'activities'}</span>
                      {hasOverlaps && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">
                          overlaps
                        </span>
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
                      const overlapInfo = getOverlapInfo(item, group.items);

                      return (
                        <div
                          key={item.id}
                          className={`relative pl-8 pb-4 ${
                            itemIndex < group.items.length - 1 ? 'border-l-2' : ''
                          } ${overlapInfo.hasOverlap ? 'border-l-orange-200' : 'border-l-gray-200'}`}
                        >
                          {/* Timeline dot with minimal overlap indicator */}
                          <div 
                            className={`absolute left-0 top-2 w-4 h-4 rounded-full border-2 border-white shadow-sm transform -translate-x-1/2 ${colorVariant.bg} ${colorVariant.border}`}
                          >
                            {overlapInfo.hasOverlap && (
                              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full border border-white"></div>
                            )}
                          </div>

                          <Card className={`ml-4 ${past ? 'opacity-75' : ''}`}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start gap-3 mb-2">
                                    <div className={`p-2 rounded-lg ${colorVariant.bg} flex-shrink-0`}>
                                      <span className="text-lg">
                                        {CATEGORY_ICONS[item.category || 'other']}
                                      </span>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <h4 className="font-semibold text-gray-900">
                                            {item.title}
                                            {overlapInfo.hasOverlap && (
                                              <span className="ml-2 text-xs text-orange-600 font-normal">
                                                ({overlapInfo.overlapCount} events)
                                              </span>
                                            )}
                                          </h4>
                                          {item.description && (
                                            <p className="text-gray-600 text-sm mt-1">
                                              {item.description}
                                            </p>
                                          )}
                                        </div>
                                        
                                        <div className="flex items-center gap-1 ml-2">
                                          {upcoming && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                              Upcoming
                                            </span>
                                          )}
                                          {past && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                              Past
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Item details */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 ml-14">
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

                                    {item.location && (
                                      <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span className="truncate">{item.location}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Minimal Conflict Information */}
                                  {overlapInfo.hasOverlap && overlapInfo.conflictingItems.length > 0 && (
                                    <div className="mt-2 ml-14 text-xs text-orange-700">
                                      <div className="flex items-center gap-1 mb-1">
                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                        <span className="font-medium">Overlaps with:</span>
                                      </div>
                                      <div className="pl-3 space-y-0.5">
                                        {overlapInfo.conflictingItems.map((conflict) => (
                                          <div key={conflict.id} className="text-orange-600">
                                            {conflict.title} ({conflict.overlapPeriod})
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

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
  );
};
