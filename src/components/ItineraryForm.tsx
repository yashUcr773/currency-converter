import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SimpleTimePicker } from '@/components/ui/simple-time-picker';
import { Calendar, MapPin, Palette, Tag } from 'lucide-react';
import type { ItineraryItem, ItineraryColor, ItineraryCategory } from '@/types/itinerary';
import { COLOR_VARIANTS, CATEGORY_ICONS } from '@/types/itinerary';

interface ItineraryFormProps {
  item?: ItineraryItem | null;
  onSave: (item: Omit<ItineraryItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const ItineraryForm: React.FC<ItineraryFormProps> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    color: 'blue' as ItineraryColor,
    category: 'other' as ItineraryCategory,
    isAllDay: false,
    notes: ''
  });

  const [errors, setErrors] = useState<{
    dateRange?: string;
    timeRange?: string;
  }>({});

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description || '',
        startDate: item.startDate.toISOString().split('T')[0],
        endDate: item.endDate ? item.endDate.toISOString().split('T')[0] : '',
        startTime: item.startTime,
        endTime: item.endTime || '',
        location: item.location || '',
        color: item.color,
        category: item.category || 'other',
        isAllDay: item.isAllDay || false,
        notes: item.notes || ''
      });
    }
  }, [item]);

  const validateForm = (): boolean => {
    const newErrors: { dateRange?: string; timeRange?: string } = {};

    // Validate date range
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate < startDate) {
        newErrors.dateRange = 'End date cannot be earlier than start date';
      }
    }

    // Validate time range (only if not all day)
    if (!formData.isAllDay && formData.startTime && formData.endTime) {
      const startDate = formData.startDate || new Date().toISOString().split('T')[0];
      const endDate = formData.endDate || startDate;
      
      const startDateTime = new Date(`${startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${endDate}T${formData.endTime}`);
      
      if (endDateTime <= startDateTime) {
        newErrors.timeRange = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.startDate) {
      return;
    }

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = formData.endDate ? new Date(formData.endDate) : undefined;

    onSave({
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      startDate,
      endDate,
      startTime: formData.isAllDay ? '00:00' : formData.startTime,
      endTime: formData.isAllDay ? '23:59' : (formData.endTime || undefined),
      location: formData.location.trim() || undefined,
      color: formData.color,
      category: formData.category,
      isAllDay: formData.isAllDay,
      notes: formData.notes.trim() || undefined
    });
  };

  const colorOptions: ItineraryColor[] = Object.keys(COLOR_VARIANTS) as ItineraryColor[];
  const categoryOptions: ItineraryCategory[] = Object.keys(CATEGORY_ICONS) as ItineraryCategory[];

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Edit Activity' : 'Add New Activity'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Activity title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Activity description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Date & Time</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="allDay"
                checked={formData.isAllDay}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  isAllDay: e.target.checked,
                  startTime: e.target.checked ? '00:00' : prev.startTime,
                  endTime: e.target.checked ? '23:59' : prev.endTime
                }))}
                className="rounded"
              />
              <label htmlFor="allDay" className="text-sm text-gray-700">
                All day event
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, startDate: e.target.value }));
                    // Clear date validation error when user changes date
                    if (errors.dateRange) {
                      setErrors(prev => ({ ...prev, dateRange: undefined }));
                    }
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, endDate: e.target.value }));
                    // Clear date validation error when user changes date
                    if (errors.dateRange) {
                      setErrors(prev => ({ ...prev, dateRange: undefined }));
                    }
                  }}
                  min={formData.startDate}
                />
              </div>
            </div>

            {errors.dateRange && (
              <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <span>⚠️</span>
                {errors.dateRange}
              </div>
            )}

            {!formData.isAllDay && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SimpleTimePicker
                    value={formData.startTime}
                    onChange={(time: string) => {
                      setFormData(prev => ({ ...prev, startTime: time }));
                      // Clear time validation error when user changes time
                      if (errors.timeRange) {
                        setErrors(prev => ({ ...prev, timeRange: undefined }));
                      }
                    }}
                    label="Start Time"
                    required={!formData.isAllDay}
                    error={errors.timeRange && formData.startTime === formData.endTime ? errors.timeRange : undefined}
                  />

                  <SimpleTimePicker
                    value={formData.endTime}
                    onChange={(time: string) => {
                      setFormData(prev => ({ ...prev, endTime: time }));
                      // Clear time validation error when user changes time
                      if (errors.timeRange) {
                        setErrors(prev => ({ ...prev, timeRange: undefined }));
                      }
                    }}
                    label="End Time"
                    required={!formData.isAllDay}
                    error={errors.timeRange && formData.endTime === formData.startTime ? errors.timeRange : undefined}
                  />
                </div>

                {errors.timeRange && (
                  <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.timeRange}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Location */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">
                Location
              </label>
            </div>
            <Input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Activity location"
            />
          </div>

          {/* Category */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category }))}
                  className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center gap-1 ${
                    formData.category === category
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{CATEGORY_ICONS[category]}</span>
                  <span className="text-xs capitalize">{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">
                Color
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 ${COLOR_VARIANTS[color].bg} ${
                    formData.color === color
                      ? 'border-gray-800'
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {item ? 'Update Activity' : 'Add Activity'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
