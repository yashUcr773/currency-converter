import React from 'react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Grid3X3 } from 'lucide-react';
import type { CalendarView } from '@/types/itinerary';

interface CalendarNavigationProps {
  calendarView: CalendarView;
  onNavigate: (direction: 'prev' | 'next') => void;
  onViewTypeChange: (type: CalendarView['type']) => void;
  onGoToToday: () => void;
  onGoToDate: (date: Date) => void;
}

export const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
  calendarView,
  onNavigate,
  onViewTypeChange,
  onGoToToday,
  onGoToDate
}) => {
  const { type, currentDate } = calendarView;

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

  const getViewIcon = (viewType: CalendarView['type']) => {
    switch (viewType) {
      case 'month':
        return <Grid3X3 className="h-3 w-3" />;
      case 'week':
        return <CalendarIcon className="h-3 w-3" />;
      case 'day':
        return <Clock className="h-3 w-3" />;
      default:
        return <CalendarIcon className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-4 p-4 bg-background border rounded-lg">
      {/* Primary Navigation */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Current Date Display & Navigation */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('prev')}
            className="h-9 w-9 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-foreground">
              {formatHeaderDate()}
            </h3>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('next')}
            className="h-9 w-9 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-3">
          {/* Date Picker */}
          <DatePicker 
            selectedDate={currentDate} 
            onDateSelect={onGoToDate}
          />
          
          {/* Today Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onGoToToday}
            className="px-3"
          >
            Today
          </Button>
        </div>
      </div>

      {/* View Type Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">View:</span>
          <div className="flex items-center bg-muted rounded-lg p-1">
            {(['month', 'week', 'day'] as const).map((viewType) => (
              <Button
                key={viewType}
                variant={type === viewType ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewTypeChange(viewType)}
                className="h-8 px-3 text-xs font-medium capitalize flex items-center gap-1.5"
              >
                {getViewIcon(viewType)}
                {viewType}
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Jump Options */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">Jump to:</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const today = new Date();
                onGoToDate(new Date(today.getFullYear(), today.getMonth(), 1));
                onViewTypeChange('month');
              }}
              className="h-7 px-2 text-xs"
            >
              This Month
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const today = new Date();
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());
                onGoToDate(startOfWeek);
                onViewTypeChange('week');
              }}
              className="h-7 px-2 text-xs"
            >
              This Week
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
