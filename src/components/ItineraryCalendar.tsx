import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Edit, Trash2, Copy } from 'lucide-react';
import type { ItineraryItem, CalendarView } from '@/types/itinerary';
import { COLOR_VARIANTS, CATEGORY_ICONS } from '@/types/itinerary';

interface ItineraryCalendarProps {
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

export const ItineraryCalendar: React.FC<ItineraryCalendarProps> = ({
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

  const getCalendarDays = useMemo(() => {
    if (type === 'month') {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());
      
      const days = [];
      const endDate = new Date(lastDay);
      endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
      
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        days.push(new Date(date));
      }
      
      return days;
    } else if (type === 'week') {
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

  const getItemsForDate = (date: Date) => {
    return items.filter(item => {
      const itemDate = new Date(item.startDate);
      return itemDate.toDateString() === date.toDateString();
    });
  };

  const formatHeaderDate = () => {
    if (type === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (type === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - Week of ${startOfWeek.getDate()}`;
      } else {
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }
    } else {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
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
            {(['month', 'week', 'day'] as const).map((viewType) => (
              <Button
                key={viewType}
                variant={type === viewType ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewTypeChange(viewType)}
                className="px-3 py-1 text-xs"
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      {type === 'month' && (
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {getCalendarDays.map((date, index) => {
            const dayItems = getItemsForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);
            
            return (
              <Card
                key={index}
                className={`min-h-[120px] cursor-pointer transition-colors hover:bg-gray-50 ${
                  !isCurrentMonthDay ? 'opacity-40' : ''
                } ${isTodayDate ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => onGoToDate(date)}
              >
                <CardContent className="p-2">
                  <div className={`text-sm font-medium mb-2 ${
                    isTodayDate ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayItems.slice(0, 3).map((item) => {
                      const colorVariant = COLOR_VARIANTS[item.color];
                      return (
                        <div
                          key={item.id}
                          className={`text-xs p-1 rounded truncate ${colorVariant.bg} ${colorVariant.text}`}
                          title={item.title}
                        >
                          <span className="mr-1">
                            {CATEGORY_ICONS[item.category || 'other']}
                          </span>
                          {item.title}
                        </div>
                      );
                    })}
                    
                    {dayItems.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayItems.length - 3} more
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Week View */}
      {type === 'week' && (
        <div className="grid grid-cols-7 gap-2">
          {getCalendarDays.map((date, index) => {
            const dayItems = getItemsForDate(date);
            const isTodayDate = isToday(date);
            
            return (
              <Card key={index} className={`min-h-[200px] ${isTodayDate ? 'ring-2 ring-blue-500' : ''}`}>
                <CardContent className="p-3">
                  <div className={`text-sm font-medium mb-3 text-center ${
                    isTodayDate ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className="text-lg">{date.getDate()}</div>
                  </div>
                  
                  <div className="space-y-2">
                    {dayItems.map((item) => {
                      const colorVariant = COLOR_VARIANTS[item.color];
                      return (
                        <div
                          key={item.id}
                          className={`text-xs p-2 rounded ${colorVariant.bg} ${colorVariant.text} relative group`}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <span>{CATEGORY_ICONS[item.category || 'other']}</span>
                            <span className="font-medium truncate">{item.title}</span>
                          </div>
                          {!item.isAllDay && (
                            <div className="text-xs opacity-75">
                              {formatTime(item.startTime)}
                            </div>
                          )}
                          
                          {/* Action buttons on hover */}
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditItem(item);
                              }}
                              className="h-6 w-6 p-0"
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
                              className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
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
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Day View */}
      {type === 'day' && (
        <Card>
          <CardContent className="p-4">
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {currentDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </h4>
            </div>
            
            <div className="space-y-3">
              {getItemsForDate(currentDate).map((item) => {
                const colorVariant = COLOR_VARIANTS[item.color];
                return (
                  <Card key={item.id} className={`${colorVariant.border} border-l-4`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-lg ${colorVariant.bg}`}>
                            <span className="text-lg">
                              {CATEGORY_ICONS[item.category || 'other']}
                            </span>
                          </div>
                          
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900">{item.title}</h5>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>
                                {item.isAllDay ? 'All day' : (
                                  <>
                                    {formatTime(item.startTime)}
                                    {item.endTime && ` - ${formatTime(item.endTime)}`}
                                  </>
                                )}
                              </span>
                              {item.location && (
                                <span>📍 {item.location}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditItem(item)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDuplicateItem(item)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="Duplicate item"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {getItemsForDate(currentDate).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No activities scheduled for this day</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
