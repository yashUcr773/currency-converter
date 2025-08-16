import React, { useState } from 'react';
import { useItinerary } from '@/hooks/useItinerary';
import { ItineraryCalendar } from './ItineraryCalendar';
import { ItineraryForm } from './ItineraryForm';
import { ItineraryList } from './ItineraryList';
import { ItineraryTimeline } from './ItineraryTimeline';
import { TimelineCalendar } from './TimelineCalendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, List, Clock, CalendarDays } from 'lucide-react';
import type { ItineraryItem } from '@/types/itinerary';

// Itinerary Manager Component - manages calendar, list, and timeline views

export const ItineraryManager: React.FC = () => {
  const {
    items,
    loading,
    calendarView,
    createItem,
    updateItem,
    deleteItem,
    duplicateItem,
    navigateDate,
    setViewType,
    goToToday,
    goToDate
  } = useItinerary();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [activeTab, setActiveTab] = useState<'calendar' | 'list' | 'timeline' | 'timeline-calendar'>('calendar');

  const handleCreateItem = async (itemData: Omit<ItineraryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createItem(itemData);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const handleUpdateItem = async (id: string, updates: Partial<ItineraryItem>) => {
    try {
      await updateItem(id, updates);
      setEditingItem(null);
      setShowForm(false); // Close the form after successful update
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItem(id);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleDuplicateItem = async (item: ItineraryItem) => {
    try {
      await duplicateItem(item);
    } catch (error) {
      console.error('Error duplicating item:', error);
    }
  };

  const handleEditItem = (item: ItineraryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Travel Itinerary</h1>
          <p className="text-lg text-muted-foreground">
            Plan and organize your trip activities with ease
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          size="lg"
          className="flex items-center gap-2 px-6"
        >
          <Plus className="h-4 w-4" />
          Add Activity
        </Button>
      </div>

      {/* Main Content */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-6 space-y-4">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold">Activity Views</CardTitle>
            <CardDescription className="text-base">
              Choose how you want to view and manage your itinerary
            </CardDescription>
          </div>
          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'calendar' | 'list' | 'timeline' | 'timeline-calendar')}>
            <TabsList className="grid w-full grid-cols-4 h-14 bg-muted/30 p-1 rounded-xl">
              <TabsTrigger 
                value="calendar" 
                className="flex items-center gap-2 text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground px-3 py-2"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Calendar</span>
              </TabsTrigger>
              <TabsTrigger 
                value="list" 
                className="flex items-center gap-2 text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground px-3 py-2"
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">List</span>
              </TabsTrigger>
              <TabsTrigger 
                value="timeline" 
                className="flex items-center gap-2 text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground px-3 py-2"
              >
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Timeline</span>
              </TabsTrigger>
              <TabsTrigger 
                value="timeline-calendar" 
                className="flex items-center gap-2 text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground px-3 py-2"
              >
                <CalendarDays className="h-4 w-4" />
                <span className="hidden sm:inline">Schedule</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="pt-0 px-6 pb-6">
          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'calendar' | 'list' | 'timeline' | 'timeline-calendar')}>
            <TabsContent value="calendar" className="mt-6 space-y-6 focus-visible:outline-none">
              <ItineraryCalendar
                items={items}
                calendarView={calendarView}
                onNavigate={navigateDate}
                onViewTypeChange={setViewType}
                onGoToToday={goToToday}
                onGoToDate={goToDate}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                onDuplicateItem={handleDuplicateItem}
              />
            </TabsContent>
            
            <TabsContent value="list" className="mt-6 space-y-6 focus-visible:outline-none">
              <ItineraryList
                items={items}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                onDuplicateItem={handleDuplicateItem}
              />
            </TabsContent>
            
            <TabsContent value="timeline" className="mt-6 space-y-6 focus-visible:outline-none">
              <ItineraryTimeline
                items={items}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                onDuplicateItem={handleDuplicateItem}
              />
            </TabsContent>
            
            <TabsContent value="timeline-calendar" className="mt-6 space-y-6 focus-visible:outline-none">
              <TimelineCalendar
                items={items}
                calendarView={calendarView}
                onNavigate={navigateDate}
                onViewTypeChange={setViewType}
                onGoToToday={goToToday}
                onGoToDate={goToDate}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                onDuplicateItem={handleDuplicateItem}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <ItineraryForm
          item={editingItem}
          onSave={editingItem ? 
            (updates: Partial<ItineraryItem>) => handleUpdateItem(editingItem.id, updates) : 
            handleCreateItem
          }
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
};
