export interface ItineraryItem {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  startTime: string;
  endTime?: string;
  location?: string;
  color: ItineraryColor;
  category?: ItineraryCategory;
  isAllDay?: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ItineraryColor = 
  | 'blue' 
  | 'green' 
  | 'purple' 
  | 'orange' 
  | 'pink' 
  | 'red' 
  | 'yellow' 
  | 'indigo' 
  | 'teal' 
  | 'gray';

export type ItineraryCategory = 
  | 'flight' 
  | 'hotel' 
  | 'activity' 
  | 'restaurant' 
  | 'transport' 
  | 'meeting' 
  | 'sightseeing' 
  | 'shopping' 
  | 'other';

export interface ItineraryDay {
  date: Date;
  items: ItineraryItem[];
}

export interface CalendarView {
  type: 'month' | 'week' | 'day';
  currentDate: Date;
}

export interface TimelineView {
  groupBy: 'month' | 'week' | 'day';
  startDate: Date;
  endDate: Date;
}

export const COLOR_VARIANTS: Record<ItineraryColor, { bg: string; border: string; text: string; hover: string }> = {
  blue: {
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    text: 'text-blue-800',
    hover: 'hover:bg-blue-200'
  },
  green: {
    bg: 'bg-green-100',
    border: 'border-green-300',
    text: 'text-green-800',
    hover: 'hover:bg-green-200'
  },
  purple: {
    bg: 'bg-purple-100',
    border: 'border-purple-300',
    text: 'text-purple-800',
    hover: 'hover:bg-purple-200'
  },
  orange: {
    bg: 'bg-orange-100',
    border: 'border-orange-300',
    text: 'text-orange-800',
    hover: 'hover:bg-orange-200'
  },
  pink: {
    bg: 'bg-pink-100',
    border: 'border-pink-300',
    text: 'text-pink-800',
    hover: 'hover:bg-pink-200'
  },
  red: {
    bg: 'bg-red-100',
    border: 'border-red-300',
    text: 'text-red-800',
    hover: 'hover:bg-red-200'
  },
  yellow: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-300',
    text: 'text-yellow-800',
    hover: 'hover:bg-yellow-200'
  },
  indigo: {
    bg: 'bg-indigo-100',
    border: 'border-indigo-300',
    text: 'text-indigo-800',
    hover: 'hover:bg-indigo-200'
  },
  teal: {
    bg: 'bg-teal-100',
    border: 'border-teal-300',
    text: 'text-teal-800',
    hover: 'hover:bg-teal-200'
  },
  gray: {
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    text: 'text-gray-800',
    hover: 'hover:bg-gray-200'
  }
};

export const CATEGORY_ICONS: Record<ItineraryCategory, string> = {
  flight: '✈️',
  hotel: '🏨',
  activity: '🎯',
  restaurant: '🍽️',
  transport: '🚗',
  meeting: '💼',
  sightseeing: '📷',
  shopping: '🛍️',
  other: '📝'
};
