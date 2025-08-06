import React, { useState } from 'react';
import { useItinerary } from '@/hooks/useItinerary';
import { ItineraryCalendar } from './ItineraryCalendar';
import { ItineraryForm } from './ItineraryForm';
import { ItineraryList } from './ItineraryList';
import { ItineraryTimeline } from './ItineraryTimeline';
import { TimelineCalendar } from './TimelineCalendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
    getItemsForDate,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Travel Itinerary</h2>
          <p className="text-gray-600">Plan and organize your trip activities</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Activity
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900">{items.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Today's Activities</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getItemsForDate(new Date()).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <List className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">
                  {items.filter(item => new Date(item.startDate) > new Date()).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'calendar' | 'list' | 'timeline' | 'timeline-calendar')}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="w-4 h-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="timeline-calendar" className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                Schedule
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'calendar' | 'list' | 'timeline' | 'timeline-calendar')}>
            <TabsContent value="calendar" className="mt-0">
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
            
            <TabsContent value="list" className="mt-0">
              <ItineraryList
                items={items}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                onDuplicateItem={handleDuplicateItem}
              />
            </TabsContent>
            
            <TabsContent value="timeline" className="mt-0">
              <ItineraryTimeline
                items={items}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                onDuplicateItem={handleDuplicateItem}
              />
            </TabsContent>
            
            <TabsContent value="timeline-calendar" className="mt-0">
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
