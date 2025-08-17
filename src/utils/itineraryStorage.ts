import type { ItineraryItem } from '@/types/itinerary';
import { storageManager } from './storageManager';

export const saveItineraryItems = (items: ItineraryItem[]): void => {
  storageManager.setItineraryItems(items);
};

export const getItineraryItems = (): ItineraryItem[] => {
  return storageManager.getItineraryItems();
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
