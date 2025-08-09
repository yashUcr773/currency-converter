import type { ItineraryItem, ItineraryColor, ItineraryCategory } from '@/types/itinerary';
import { logger } from './env';

const ITINERARY_STORAGE_KEY = 'ratevault-itinerary-items';

interface SerializedItineraryItem {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime?: string;
  location?: string;
  color: string;
  category?: string;
  isAllDay?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const saveItineraryItems = (items: ItineraryItem[]): void => {
  try {
    const serializedItems = JSON.stringify(items, (key, value) => {
      if (key === 'startDate' || key === 'endDate' || key === 'createdAt' || key === 'updatedAt') {
        return value instanceof Date ? value.toISOString() : value;
      }
      return value;
    });
    localStorage.setItem(ITINERARY_STORAGE_KEY, serializedItems);
  } catch (error) {
    logger.warn('Failed to save itinerary items to localStorage:', error);
  }
};

export const getItineraryItems = (): ItineraryItem[] => {
  try {
    const saved = localStorage.getItem(ITINERARY_STORAGE_KEY);
    if (!saved) return [];
    
    const parsed: SerializedItineraryItem[] = JSON.parse(saved);
    return parsed.map((item: SerializedItineraryItem) => ({
      ...item,
      startDate: new Date(item.startDate),
      endDate: item.endDate ? new Date(item.endDate) : undefined,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      color: item.color as ItineraryColor,
      category: item.category as ItineraryCategory
    }));
  } catch (error) {
    logger.warn('Failed to load itinerary items from localStorage:', error);
    return [];
  }
};

export const addItineraryItem = (item: Omit<ItineraryItem, 'id' | 'createdAt' | 'updatedAt'>): ItineraryItem => {
  const newItem: ItineraryItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const existingItems = getItineraryItems();
  const updatedItems = [...existingItems, newItem];
  saveItineraryItems(updatedItems);
  
  return newItem;
};

export const updateItineraryItem = (id: string, updates: Partial<ItineraryItem>): ItineraryItem | null => {
  const existingItems = getItineraryItems();
  const itemIndex = existingItems.findIndex(item => item.id === id);
  
  if (itemIndex === -1) return null;
  
  const updatedItem = {
    ...existingItems[itemIndex],
    ...updates,
    updatedAt: new Date()
  };
  
  existingItems[itemIndex] = updatedItem;
  saveItineraryItems(existingItems);
  
  return updatedItem;
};

export const deleteItineraryItem = (id: string): boolean => {
  const existingItems = getItineraryItems();
  const filteredItems = existingItems.filter(item => item.id !== id);
  
  if (filteredItems.length === existingItems.length) return false;
  
  saveItineraryItems(filteredItems);
  return true;
};

export const getItineraryItemsByDateRange = (startDate: Date, endDate: Date): ItineraryItem[] => {
  const items = getItineraryItems();
  return items.filter(item => {
    const itemDate = new Date(item.startDate);
    return itemDate >= startDate && itemDate <= endDate;
  });
};

export const getItineraryItemsByDate = (date: Date): ItineraryItem[] => {
  const items = getItineraryItems();
  return items.filter(item => {
    const itemDate = new Date(item.startDate);
    return itemDate.toDateString() === date.toDateString();
  });
};
