import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, MapPin, Clock, Calendar as CalendarIcon } from 'lucide-react';
import type { ItineraryItem } from '@/types/itinerary';
import { COLOR_VARIANTS, CATEGORY_ICONS } from '@/types/itinerary';

interface ItineraryListProps {
  items: ItineraryItem[];
  onEditItem: (item: ItineraryItem) => void;
  onDeleteItem: (id: string) => void;
}

export const ItineraryList: React.FC<ItineraryListProps> = ({ items, onEditItem, onDeleteItem }) => {
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
      <div className="text-center py-12">
        <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
        <p className="text-gray-500">Start planning your trip by adding your first activity!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedItems.map((item) => {
        const colorVariant = COLOR_VARIANTS[item.color];
        const upcoming = isUpcoming(item);
        const past = isPast(item);
        
        return (
          <Card 
            key={item.id}
            className={`transition-all hover:shadow-md ${
              past ? 'opacity-75' : ''
            } ${colorVariant.border} border-l-4`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${colorVariant.bg} flex-shrink-0`}>
                      <span className="text-lg">
                        {CATEGORY_ICONS[item.category || 'other']}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {item.title}
                          </h3>
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

                  {/* Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                    {/* Date */}
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>
                        {formatDate(new Date(item.startDate))}
                        {item.endDate && 
                          new Date(item.endDate).toDateString() !== new Date(item.startDate).toDateString() && 
                          ` - ${formatDate(new Date(item.endDate))}`
                        }
                      </span>
                    </div>

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
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
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
                    onClick={() => onDeleteItem(item.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
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
