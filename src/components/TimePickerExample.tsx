import React, { useState } from 'react';
import { TimezoneTimePicker } from '@/components/ui/timezone-time-picker';
import { SimpleTimePicker } from '@/components/ui/simple-time-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Example component demonstrating the usage of both time picker components
 * This serves as a reference for how to implement time pickers in your components
 */
export const TimePickerExample: React.FC = () => {
  // State for timezone time picker
  const [timezoneCustomTime, setTimezoneCustomTime] = useState<Date | null>(null);

  // State for simple time picker
  const [simpleTime, setSimpleTime] = useState('09:00');

  // Handle timezone time picker changes
  const handleTimezoneTimeChange = (hour: number, minute: number, ampm: 'AM' | 'PM') => {
    // Create a Date object for the selected time
    const now = new Date();
    let hour24 = hour;
    if (ampm === 'PM' && hour !== 12) {
      hour24 += 12;
    } else if (ampm === 'AM' && hour === 12) {
      hour24 = 0;
    }
    
    const customTime = new Date(now);
    customTime.setHours(hour24, minute, 0, 0);
    setTimezoneCustomTime(customTime);
    
    console.log(`Timezone time set to: ${hour}:${minute.toString().padStart(2, '0')} ${ampm}`);
  };

  // Handle simple time picker changes  
  const handleSimpleTimeChange = (time: string) => {
    setSimpleTime(time);
    console.log(`Simple time set to: ${time}`);
  };

  // Reset timezone picker to current time
  const resetTimezoneTime = () => {
    setTimezoneCustomTime(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Time Picker Components</h1>
        <p className="text-gray-600">
          Examples of the reusable TimezoneTimePicker and SimpleTimePicker components
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timezone Time Picker Example */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🌍 Timezone Time Picker
            </CardTitle>
            <p className="text-sm text-gray-600">
              Timezone-aware picker with current time display and custom time setting
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">New York Time</h3>
              <TimezoneTimePicker
                timezoneValue="America/New_York"
                setTime={timezoneCustomTime}
                onTimeChange={handleTimezoneTimeChange}
                label="Select NYC Time"
                showManualInput={true}
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">London Time</h3>
              <TimezoneTimePicker
                timezoneValue="Europe/London"
                setTime={timezoneCustomTime}
                onTimeChange={handleTimezoneTimeChange}
                label="Select London Time"
                variant="outline"
                size="default"
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Tokyo Time</h3>
              <TimezoneTimePicker
                timezoneValue="Asia/Tokyo"
                setTime={timezoneCustomTime}
                onTimeChange={handleTimezoneTimeChange}
                label="Select Tokyo Time"
                variant="outline"
                size="sm"
              />
            </div>

            <div className="pt-2 border-t">
              <Button 
                onClick={resetTimezoneTime}
                variant="outline" 
                size="sm"
                className="w-full"
              >
                Reset to Current Time
              </Button>
            </div>

            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
              <strong>Current State:</strong><br/>
              Custom Time: {timezoneCustomTime ? timezoneCustomTime.toLocaleString() : 'None (showing current time)'}
            </div>
          </CardContent>
        </Card>

        {/* Simple Time Picker Example */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🕒 Simple Time Picker
            </CardTitle>
            <p className="text-sm text-gray-600">
              Basic time picker for general use without timezone functionality
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <SimpleTimePicker
                value={simpleTime}
                onChange={handleSimpleTimeChange}
                label="Meeting Time"
                required={true}
                showManualInput={true}
              />
            </div>

            <div className="space-y-2">
              <SimpleTimePicker
                value={simpleTime}
                onChange={handleSimpleTimeChange}
                label="Compact Picker"
                variant="outline"
                size="sm"
              />
            </div>

            <div className="space-y-2">
              <SimpleTimePicker
                value={simpleTime}
                onChange={handleSimpleTimeChange}
                label="Ghost Variant"
                variant="ghost"
                showManualInput={false}
              />
            </div>

            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
              <strong>Current Value:</strong><br/>
              Time: {simpleTime} (24-hour format)<br/>
              Display: {new Date(`2000-01-01T${simpleTime}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Feature</th>
                  <th className="text-center p-2">TimezoneTimePicker</th>
                  <th className="text-center p-2">SimpleTimePicker</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                <tr className="border-b">
                  <td className="p-2">Timezone Aware</td>
                  <td className="text-center p-2">✅</td>
                  <td className="text-center p-2">❌</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Manual Input</td>
                  <td className="text-center p-2">✅</td>
                  <td className="text-center p-2">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Dropdown Selection</td>
                  <td className="text-center p-2">✅</td>
                  <td className="text-center p-2">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Quick Actions</td>
                  <td className="text-center p-2">✅</td>
                  <td className="text-center p-2">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Current Time Auto-Update</td>
                  <td className="text-center p-2">✅</td>
                  <td className="text-center p-2">❌</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Day Transition Indicators</td>
                  <td className="text-center p-2">✅</td>
                  <td className="text-center p-2">❌</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Output Format</td>
                  <td className="text-center p-2">Parsed (h, m, ampm)</td>
                  <td className="text-center p-2">HH:MM (24h)</td>
                </tr>
                <tr>
                  <td className="p-2">Best Use Case</td>
                  <td className="text-center p-2">Multi-timezone apps</td>
                  <td className="text-center p-2">General forms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimePickerExample;
