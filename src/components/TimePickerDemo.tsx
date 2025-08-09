import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimePicker } from '@/components/ui/time-picker';

export const TimePickerDemo: React.FC = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Redesigned Time Picker Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={setStartTime}
              required
            />
            
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={setEndTime}
            />
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Features:</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Click button to open time selector dropdown</li>
              <li>• Type time manually in 12-hour (2:30 PM) or 24-hour (14:30) format</li>
              <li>• Use dropdowns to select hour, minute, and AM/PM</li>
              <li>• Quick select buttons for common times</li>
              <li>• "Now" button to set current time</li>
              <li>• Always displays time in 12-hour format</li>
            </ul>
          </div>
          
          {(startTime || endTime) && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Selected Times:</h3>
              <div className="space-y-1 text-sm text-blue-700">
                {startTime && <div>Start Time: {startTime} (stored as 24-hour format)</div>}
                {endTime && <div>End Time: {endTime} (stored as 24-hour format)</div>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
