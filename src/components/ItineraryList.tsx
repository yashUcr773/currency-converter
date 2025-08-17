import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, MapPin, Clock, Calendar as CalendarIcon, Copy } from 'lucide-react';
import type { ItineraryItem } from '@/types/itinerary';
import { COLOR_VARIANTS, CATEGORY_ICONS } from '@/types/itinerary';

interface ItineraryListProps {
  items: ItineraryItem[];
  onEditItem: (item: ItineraryItem) => void;
  onDeleteItem: (id: string) => void;
  onDuplicateItem: (item: ItineraryItem) => void;
}

export const ItineraryList: React.FC<ItineraryListProps> = ({ items, onEditItem, onDeleteItem, onDuplicateItem }) => {
  const sortedItems = [...items].sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    return a.startTime.localeCompare(b.startTime);
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
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

  if (items.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-lg mb-2">No Activities Yet</CardTitle>
          <CardDescription className="text-center max-w-sm">
            Your itinerary is empty. Start by adding your first activity to begin planning your trip.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {sortedItems.map((item) => {
        const colorVariant = COLOR_VARIANTS[item.color];
        const upcoming = isUpcoming(item);
        const past = isPast(item);
        
        return (
          <Card 
            key={item.id}
            className={`group transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
              past ? 'opacity-70' : ''
            } ${upcoming ? 'ring-2 ring-blue-200' : ''} border-l-4 ${colorVariant.border}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Icon */}
                  <div className={`p-3 rounded-xl ${colorVariant.bg} flex-shrink-0 transition-transform group-hover:scale-105`}>
                    <span className="text-xl">
                      {CATEGORY_ICONS[item.category || 'other']}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Title and Description */}
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-1 leading-tight">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      {/* Date */}
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {formatDate(new Date(item.startDate))}
                          {item.endDate && 
                            formatDate(new Date(item.endDate)) !== formatDate(new Date(item.startDate)) && (
                              <span> - {formatDate(new Date(item.endDate))}</span>
                            )
                          }
                        </span>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {item.isAllDay ? 'All Day' : `${formatTime(item.startTime)}${item.endTime ? ` - ${formatTime(item.endTime)}` : ''}`}
                        </span>
                      </div>

                      {/* Location */}
                      {item.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground truncate">{item.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {item.notes && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg border">
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.notes}</p>
                      </div>
                    )}

                    {/* Status Badge */}
                    {(upcoming || past) && (
                      <div className="flex gap-2 mt-3">
                        {upcoming && (
                          <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            Upcoming
                          </div>
                        )}
                        {past && (
                          <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            Completed
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditItem(item)}
                    className="h-8 w-8 p-0"
                    title="Edit item"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDuplicateItem(item)}
                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    title="Duplicate item"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteItem(item.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Delete item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
