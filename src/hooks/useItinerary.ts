import { useState, useEffect, useCallback } from 'react';
import type { ItineraryItem, CalendarView } from '@/types/itinerary';
import {
  getItineraryItems,
  addItineraryItem,
  updateItineraryItem,
  deleteItineraryItem,
  getItineraryItemsByDate,
  getItineraryItemsByDateRange
} from '@/utils/itineraryStorage';

export const useItinerary = () => {
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendarView, setCalendarView] = useState<CalendarView>({
    type: 'month',
    currentDate: new Date()
  });

  // Load items on mount
  useEffect(() => {
    try {
      const loadedItems = getItineraryItems();
      setItems(loadedItems);
    } catch (error) {
      console.error('Failed to load itinerary items:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = useCallback((itemData: Omit<ItineraryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newItem = addItineraryItem(itemData);
      setItems(prev => [...prev, newItem]);
      return newItem;
    } catch (error) {
      console.error('Failed to create itinerary item:', error);
      throw error;
    }
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<ItineraryItem>) => {
    try {
      const updatedItem = updateItineraryItem(id, updates);
      if (updatedItem) {
        setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
        return updatedItem;
      }
      return null;
    } catch (error) {
      console.error('Failed to update itinerary item:', error);
      throw error;
    }
  }, []);

  const deleteItem = useCallback((id: string) => {
    try {
      const success = deleteItineraryItem(id);
      if (success) {
        setItems(prev => prev.filter(item => item.id !== id));
      }
      return success;
    } catch (error) {
      console.error('Failed to delete itinerary item:', error);
      throw error;
    }
  }, []);

  const getItemsForDate = useCallback((date: Date) => {
    return getItineraryItemsByDate(date);
  }, []);

  const getItemsForDateRange = useCallback((startDate: Date, endDate: Date) => {
    return getItineraryItemsByDateRange(startDate, endDate);
  }, []);

  const getItemsForCurrentView = useCallback(() => {
    const { type, currentDate } = calendarView;
    
    if (type === 'day') {
      return getItemsForDate(currentDate);
    } else if (type === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return getItemsForDateRange(startOfWeek, endOfWeek);
    } else {
      // month view
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      return getItemsForDateRange(startOfMonth, endOfMonth);
    }
  }, [calendarView, getItemsForDate, getItemsForDateRange]);

  const navigateDate = useCallback((direction: 'prev' | 'next') => {
    setCalendarView(prev => {
      const newDate = new Date(prev.currentDate);
      
      if (prev.type === 'day') {
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
      } else if (prev.type === 'week') {
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
      } else {
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      }
      
      return { ...prev, currentDate: newDate };
    });
  }, []);

  const setViewType = useCallback((type: CalendarView['type']) => {
    setCalendarView(prev => ({ ...prev, type }));
  }, []);

  const goToToday = useCallback(() => {
    setCalendarView(prev => ({ ...prev, currentDate: new Date() }));
  }, []);

  const goToDate = useCallback((date: Date) => {
    setCalendarView(prev => ({ ...prev, currentDate: date }));
  }, []);

  return {
    items,
    loading,
    calendarView,
    createItem,
    updateItem,
    deleteItem,
    getItemsForDate,
    getItemsForDateRange,
    getItemsForCurrentView,
    navigateDate,
    setViewType,
    goToToday,
    goToDate
  };
};
