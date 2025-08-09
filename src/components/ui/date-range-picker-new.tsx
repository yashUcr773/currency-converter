import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onDateRangeSelect: (range: DateRange) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  startDate, 
  endDate, 
  onDateRangeSelect 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
  const [isOpen, setIsOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
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
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(currentMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const handleDateClick = (date: Date) => {
    if (!tempStartDate) {
      setTempStartDate(date);
    } else {
      const start = tempStartDate <= date ? tempStartDate : date;
      const end = tempStartDate <= date ? date : tempStartDate;
      
      onDateRangeSelect({ startDate: start, endDate: end });
      setTempStartDate(null);
      setHoverDate(null);
      setIsOpen(false);
    }
  };

  const isInRange = (date: Date) => {
    if (!tempStartDate) {
      return date >= startDate && date <= endDate;
    } else {
      const previewEnd = hoverDate || tempStartDate;
      const rangeStart = tempStartDate <= previewEnd ? tempStartDate : previewEnd;
      const rangeEnd = tempStartDate <= previewEnd ? previewEnd : tempStartDate;
      return date >= rangeStart && date <= rangeEnd;
    }
  };

  const isRangeStart = (date: Date) => {
    if (!tempStartDate) {
      return date.toDateString() === startDate.toDateString();
    } else {
      const previewEnd = hoverDate || tempStartDate;
      const rangeStart = tempStartDate <= previewEnd ? tempStartDate : previewEnd;
      return date.toDateString() === rangeStart.toDateString();
    }
  };

  const isRangeEnd = (date: Date) => {
    if (!tempStartDate) {
      return date.toDateString() === endDate.toDateString();
    } else {
      const previewEnd = hoverDate || tempStartDate;
      const rangeEnd = tempStartDate <= previewEnd ? previewEnd : tempStartDate;
      return date.toDateString() === rangeEnd.toDateString();
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const handleCancel = () => {
    setTempStartDate(null);
    setHoverDate(null);
    setIsOpen(false);
  };

  const formatDateRange = () => {
    const formatOptions: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    
    if (startDate.toDateString() === endDate.toDateString()) {
      return startDate.toLocaleDateString('en-US', formatOptions);
    }
    
    if (startDate.getFullYear() === endDate.getFullYear()) {
      if (startDate.getMonth() === endDate.getMonth()) {
        return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.getDate()}, ${endDate.getFullYear()}`;
      } else {
        return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${endDate.getFullYear()}`;
      }
    }
    
    return `${startDate.toLocaleDateString('en-US', formatOptions)} - ${endDate.toLocaleDateString('en-US', formatOptions)}`;
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 min-w-[200px] justify-start font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="rounded-md border bg-popover">
          {/* Clean Header */}
          <div className="flex items-center justify-between p-3 border-b">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigateMonth('prev')}
              className="h-7 w-7"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigateMonth('next')}
              className="h-7 w-7"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-3 space-y-3">
            {/* Simple Instructions */}
            {!tempStartDate && (
              <div className="text-xs text-center text-muted-foreground">
                Select start date, then end date
              </div>
            )}

            {/* Clean Week Headers */}
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
                <div key={day} className="h-8 w-8 text-center text-xs font-medium text-muted-foreground flex items-center justify-center">
                  {day.slice(0, 2)}
                </div>
              ))}
            </div>

            {/* Minimalistic Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const inRange = isInRange(day);
                const rangeStart = isRangeStart(day);
                const rangeEnd = isRangeEnd(day);
                const today = isToday(day);
                const currentMonthDay = isCurrentMonth(day);

                return (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDateClick(day)}
                    onMouseEnter={() => tempStartDate && setHoverDate(day)}
                    onMouseLeave={() => setHoverDate(null)}
                    className={cn(
                      "h-8 w-8 p-0 font-normal",
                      !currentMonthDay && "text-muted-foreground opacity-50",
                      today && "bg-accent text-accent-foreground font-semibold",
                      inRange && "bg-primary/10",
                      (rangeStart || rangeEnd) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                      tempStartDate && tempStartDate.toDateString() === day.toDateString() && "bg-primary text-primary-foreground"
                    )}
                  >
                    {day.getDate()}
                  </Button>
                );
              })}
            </div>

            {/* Simple Selection Info */}
            {tempStartDate && (
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                <span>Start: {tempStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                {hoverDate && hoverDate !== tempStartDate && (
                  <span>→ End: {hoverDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                )}
              </div>
            )}

            {/* Clean Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  const today = new Date();
                  onDateRangeSelect({ startDate: today, endDate: today });
                  setTempStartDate(null);
                  setHoverDate(null);
                  setIsOpen(false);
                }}
                className="h-7 text-xs"
              >
                Today
              </Button>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCancel}
                  className="h-7 text-xs"
                >
                  Cancel
                </Button>
                {tempStartDate && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => {
                      onDateRangeSelect({ startDate: tempStartDate, endDate: tempStartDate });
                      setTempStartDate(null);
                      setHoverDate(null);
                      setIsOpen(false);
                    }}
                    className="h-7 text-xs"
                  >
                    Apply
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
