import { useState } from 'react';
import { Calendar, Plus, ArrowRight, Timer, CalendarDays, Calculator, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DateTimePicker, DatePicker } from '@/components/ui/date-time-picker';
import { useNumberSystem } from '@/hooks/useNumberSystem';
import { formatNumber } from '@/utils/numberSystem';

interface DurationResult {
  value: number | string;
  label: string;
  description?: string;
}

export const DurationTimeCalculator = () => {
  const { numberSystem } = useNumberSystem();

  // Time Difference Calculator State
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [includeSeconds, setIncludeSeconds] = useState(false);

  // Duration Addition Calculator State
  const [baseDateTime, setBaseDateTime] = useState('');
  const [durationValue, setDurationValue] = useState('');
  const [durationUnit, setDurationUnit] = useState('hours');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');

  // Age Calculator State
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);

  // Working Days Calculator State
  const [workStartDate, setWorkStartDate] = useState('');
  const [workEndDate, setWorkEndDate] = useState('');
  const [includeWeekends, setIncludeWeekends] = useState(false);

  const formatDisplayNumber = (value: number): string => {
    return formatNumber(value, numberSystem, 2);
  };

  const formatDateTime = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    const timeStr = includeSeconds 
      ? `${String(displayHours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`
      : `${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;
    
    return `${day}-${month}-${year} ${timeStr}`;
  };

  const calculateTimeDifference = (): DurationResult[] => {
    if (!startDateTime || !endDateTime) return [];

    try {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return [{ value: 'Invalid date format', label: 'Error', description: 'Please check your date and time inputs' }];
      }

      const diffMs = Math.abs(end.getTime() - start.getTime());
      
      const seconds = Math.floor(diffMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 30.44); // Average month length
      const years = Math.floor(days / 365.25); // Account for leap years

      const remainingHours = hours % 24;
      const remainingMinutes = minutes % 60;
      const remainingSeconds = seconds % 60;

      const isEarlier = end.getTime() < start.getTime();
      const direction = isEarlier ? 'earlier' : 'later';

      const results: DurationResult[] = [
        { value: formatDisplayNumber(diffMs), label: 'Total Milliseconds' },
        { value: formatDisplayNumber(seconds), label: 'Total Seconds' },
        { value: formatDisplayNumber(minutes), label: 'Total Minutes' },
        { value: formatDisplayNumber(hours), label: 'Total Hours' },
        { value: formatDisplayNumber(days), label: 'Total Days' },
      ];

      if (weeks > 0) {
        results.push({ value: formatDisplayNumber(weeks), label: 'Total Weeks' });
      }

      if (months > 0) {
        results.push({ value: formatDisplayNumber(months), label: 'Total Months (approx)' });
      }

      if (years > 0) {
        results.push({ value: formatDisplayNumber(years), label: 'Total Years (approx)' });
      }

      // Human readable format
      let humanReadable = '';
      if (years > 0) humanReadable += `${years} year${years !== 1 ? 's' : ''} `;
      if (months % 12 > 0) humanReadable += `${months % 12} month${months % 12 !== 1 ? 's' : ''} `;
      if (days % 30 > 0) humanReadable += `${days % 30} day${days % 30 !== 1 ? 's' : ''} `;
      if (remainingHours > 0) humanReadable += `${remainingHours} hour${remainingHours !== 1 ? 's' : ''} `;
      if (remainingMinutes > 0) humanReadable += `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''} `;
      if (includeSeconds && remainingSeconds > 0) humanReadable += `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;

      results.push({ 
        value: humanReadable.trim() || '0 seconds', 
        label: 'Duration', 
        description: `End time is ${direction} than start time`
      });

      return results;
    } catch {
      return [{ value: 'Calculation error', label: 'Error', description: 'Please check your inputs' }];
    }
  };

  const calculateDurationAddition = (): DurationResult[] => {
    if (!baseDateTime || !durationValue) return [];

    try {
      const base = new Date(baseDateTime);
      const duration = parseFloat(durationValue);

      if (isNaN(base.getTime()) || isNaN(duration)) {
        return [{ value: 'Invalid input', label: 'Error', description: 'Please check your date and duration inputs' }];
      }

      let milliseconds = 0;
      switch (durationUnit) {
        case 'seconds':
          milliseconds = duration * 1000;
          break;
        case 'minutes':
          milliseconds = duration * 60 * 1000;
          break;
        case 'hours':
          milliseconds = duration * 60 * 60 * 1000;
          break;
        case 'days':
          milliseconds = duration * 24 * 60 * 60 * 1000;
          break;
        case 'weeks':
          milliseconds = duration * 7 * 24 * 60 * 60 * 1000;
          break;
        case 'months':
          milliseconds = duration * 30.44 * 24 * 60 * 60 * 1000; // Average month
          break;
        case 'years':
          milliseconds = duration * 365.25 * 24 * 60 * 60 * 1000; // Account for leap years
          break;
      }

      const resultDate = new Date(base.getTime() + (operation === 'add' ? milliseconds : -milliseconds));

      // Calculate the difference between base and result in various units
      const diffMs = Math.abs(resultDate.getTime() - base.getTime());
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);
      const diffWeeks = Math.floor(diffDays / 7);
      const diffMonths = Math.floor(diffDays / 30.44);
      const diffYears = Math.floor(diffDays / 365.25);

      const results: DurationResult[] = [
        { value: formatDateTime(base), label: 'Start Date & Time' },
        { value: `${operation === 'add' ? '+' : '-'}${formatDisplayNumber(duration)} ${durationUnit}`, label: 'Duration Applied' },
        { value: formatDateTime(resultDate), label: 'Result Date & Time' },
      ];

      // Add time difference breakdown
      if (diffYears > 0) {
        results.push({ value: formatDisplayNumber(diffYears), label: 'Difference in Years' });
      }
      if (diffMonths > 0) {
        results.push({ value: formatDisplayNumber(diffMonths), label: 'Difference in Months' });
      }
      if (diffWeeks > 0) {
        results.push({ value: formatDisplayNumber(diffWeeks), label: 'Difference in Weeks' });
      }
      
      results.push(
        { value: formatDisplayNumber(diffDays), label: 'Difference in Days' },
        { value: formatDisplayNumber(diffHours), label: 'Difference in Hours' },
        { value: formatDisplayNumber(diffMinutes), label: 'Difference in Minutes' },
        { value: formatDisplayNumber(diffSeconds), label: 'Difference in Seconds' },
        { value: Math.floor(resultDate.getTime() / 1000), label: 'Unix Timestamp (Epoch)', description: 'Seconds since Jan 1, 1970 UTC' },
        { value: resultDate.getTime(), label: 'JavaScript Timestamp', description: 'Milliseconds since Jan 1, 1970 UTC' },
        { value: resultDate.toISOString(), label: 'ISO Format', description: 'International standard format' }
      );

      return results;
    } catch {
      return [{ value: 'Calculation error', label: 'Error', description: 'Please check your inputs' }];
    }
  };

  const calculateAge = (): DurationResult[] => {
    if (!birthDate) return [];

    try {
      const birth = new Date(birthDate);
      const target = new Date(targetDate);

      if (isNaN(birth.getTime()) || isNaN(target.getTime())) {
        return [{ value: 'Invalid date', label: 'Error', description: 'Please check your date inputs' }];
      }

      const diffMs = target.getTime() - birth.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      let years = target.getFullYear() - birth.getFullYear();
      let months = target.getMonth() - birth.getMonth();
      let days = target.getDate() - birth.getDate();

      if (days < 0) {
        months--;
        const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
        days += lastMonth.getDate();
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      const totalMonths = years * 12 + months;
      const totalWeeks = Math.floor(diffDays / 7);
      const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

      return [
        { value: formatDisplayNumber(years + months / 12), label: 'Age in Years (decimal)' },
        { value: formatDisplayNumber(totalMonths), label: 'Age in Months' },
        { value: formatDisplayNumber(totalWeeks), label: 'Age in Weeks' },
        { value: formatDisplayNumber(diffDays), label: 'Age in Days' },
        { value: formatDisplayNumber(totalHours), label: 'Age in Hours' },
      ];
    } catch {
      return [{ value: 'Calculation error', label: 'Error', description: 'Please check your inputs' }];
    }
  };

  const calculateWorkingDays = (): DurationResult[] => {
    if (!workStartDate || !workEndDate) return [];

    try {
      const start = new Date(workStartDate);
      const end = new Date(workEndDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return [{ value: 'Invalid date', label: 'Error', description: 'Please check your date inputs' }];
      }

      if (start > end) {
        return [{ value: 'Invalid range', label: 'Error', description: 'Start date must be before end date' }];
      }

      const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      let workingDays = 0;
      let weekends = 0;

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
          weekends++;
          if (includeWeekends) {
            workingDays++;
          }
        } else {
          workingDays++;
        }
      }

      const weeks = Math.floor(totalDays / 7);
      const workingWeeks = Math.floor(workingDays / (includeWeekends ? 7 : 5));

      return [
        { value: formatDisplayNumber(totalDays), label: 'Total Days' },
        { value: formatDisplayNumber(workingDays), label: includeWeekends ? 'Days (including weekends)' : 'Working Days (Mon-Fri)' },
        { value: formatDisplayNumber(weekends), label: 'Weekend Days' },
        { value: formatDisplayNumber(weeks), label: 'Total Weeks' },
        { value: formatDisplayNumber(workingWeeks), label: includeWeekends ? 'Weeks' : 'Working Weeks' },
        { 
          value: formatDisplayNumber(workingDays * 8), 
          label: 'Working Hours', 
          description: 'Assuming 8 hours per working day' 
        },
      ];
    } catch {
      return [{ value: 'Calculation error', label: 'Error', description: 'Please check your inputs' }];
    }
  };

  const ResultCard = ({ results }: { results: DurationResult[] }) => {
    if (results.length === 0) return null;

    return (
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {results.slice(0, 6).map((result, index) => (
          <div 
            key={index} 
            className="bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-slate-200/60 hover:shadow-md transition-all duration-200"
          >
            <div className="text-xs font-medium text-slate-500 mb-1">
              {result.label}
            </div>
            <div className="text-lg font-bold text-slate-800 break-words">
              {result.value}
            </div>
            {result.description && (
              <div className="text-xs text-slate-400 mt-1">
                {result.description}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Duration & Time Calculator
        </h2>
        <p className="text-slate-600">Calculate time differences, add durations, and analyze dates</p>
      </div>

      <Tabs defaultValue="difference" className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="inline-flex grid-cols-2 lg:grid-cols-4 gap-2 h-auto p-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 shadow-lg rounded-xl">
            <TabsTrigger 
              value="difference" 
              className="flex flex-col items-center p-3 text-xs font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-50 data-[state=active]:to-blue-100 data-[state=active]:text-blue-700 data-[state=active]:shadow-md hover:bg-slate-50"
            >
              <Timer className="w-4 h-4 mb-1" />
              <span>Time Diff</span>
            </TabsTrigger>
            <TabsTrigger 
              value="duration" 
              className="flex flex-col items-center p-3 text-xs font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-50 data-[state=active]:to-green-100 data-[state=active]:text-green-700 data-[state=active]:shadow-md hover:bg-slate-50"
            >
              <Calculator className="w-4 h-4 mb-1" />
              <span>Add Duration</span>
            </TabsTrigger>
            <TabsTrigger 
              value="age" 
              className="flex flex-col items-center p-3 text-xs font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-50 data-[state=active]:to-purple-100 data-[state=active]:text-purple-700 data-[state=active]:shadow-md hover:bg-slate-50"
            >
              <CalendarDays className="w-4 h-4 mb-1" />
              <span>Age Calc</span>
            </TabsTrigger>
            <TabsTrigger 
              value="working" 
              className="flex flex-col items-center p-3 text-xs font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-50 data-[state=active]:to-orange-100 data-[state=active]:text-orange-700 data-[state=active]:shadow-md hover:bg-slate-50"
            >
              <Briefcase className="w-4 h-4 mb-1" />
              <span>Work Days</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="difference" className="space-y-4">
          <Card className="bg-white/95 backdrop-blur-md border-slate-200 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Timer className="w-5 h-5 text-blue-600" />
                Time Difference Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DateTimePicker
                  label="Start Date & Time"
                  value={startDateTime}
                  onChange={setStartDateTime}
                  className="bg-white/80"
                  placeholder="Select start date & time"
                />
                
                <DateTimePicker
                  label="End Date & Time"
                  value={endDateTime}
                  onChange={setEndDateTime}
                  className="bg-white/80"
                  placeholder="Select end date & time"
                />
                
                <div className="flex flex-col justify-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeSeconds"
                      checked={includeSeconds}
                      onCheckedChange={(checked) => setIncludeSeconds(!!checked)}
                    />
                    <Label htmlFor="includeSeconds" className="text-sm text-slate-700">
                      Include seconds
                    </Label>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <ResultCard results={calculateTimeDifference()} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="duration" className="space-y-4">
          <Card className="bg-white/95 backdrop-blur-md border-slate-200 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="w-5 h-5 text-green-600" />
                Duration Addition/Subtraction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DateTimePicker
                  label="Base Date & Time"
                  value={baseDateTime}
                  onChange={setBaseDateTime}
                  className="bg-white/80"
                  placeholder="Select base date & time"
                />

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Operation</Label>
                  <Select value={operation} onValueChange={(value: 'add' | 'subtract') => setOperation(value)}>
                    <SelectTrigger className="bg-white/80 border-slate-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add">
                        <div className="flex items-center gap-2">
                          <Plus className="w-3 h-3 text-green-600" />
                          Add
                        </div>
                      </SelectItem>
                      <SelectItem value="subtract">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 flex items-center justify-center text-red-600 font-bold">−</span>
                          Subtract
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Value</Label>
                  <Input
                    type="number"
                    placeholder="10"
                    value={durationValue}
                    onChange={(e) => setDurationValue(e.target.value)}
                    className="bg-white/80 border-slate-300 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Unit</Label>
                  <Select value={durationUnit} onValueChange={setDurationUnit}>
                    <SelectTrigger className="bg-white/80 border-slate-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seconds">Seconds</SelectItem>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                      <SelectItem value="years">Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-4">
                <ResultCard results={calculateDurationAddition()} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="age" className="space-y-4">
          <Card className="bg-white/95 backdrop-blur-md border-slate-200 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarDays className="w-5 h-5 text-purple-600" />
                Age Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DatePicker
                  label="Birth Date"
                  value={birthDate ? `${birthDate}T00:00` : ''}
                  onChange={(value) => setBirthDate(value.split('T')[0])}
                  className="bg-white/80"
                  placeholder="Select birth date"
                />

                <DatePicker
                  label="Calculate Age On"
                  value={targetDate ? `${targetDate}T00:00` : ''}
                  onChange={(value) => setTargetDate(value.split('T')[0])}
                  className="bg-white/80"
                  placeholder="Select target date"
                />

                <div className="flex flex-col justify-end">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setTargetDate(new Date().toISOString().split('T')[0])}
                      className="text-xs border-slate-300 hover:bg-slate-50"
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      Today
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const nextBirthday = new Date();
                        if (birthDate) {
                          const birth = new Date(birthDate);
                          nextBirthday.setFullYear(nextBirthday.getFullYear());
                          nextBirthday.setMonth(birth.getMonth());
                          nextBirthday.setDate(birth.getDate());
                          if (nextBirthday < new Date()) {
                            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
                          }
                          setTargetDate(nextBirthday.toISOString().split('T')[0]);
                        }
                      }}
                      disabled={!birthDate}
                      className="text-xs border-slate-300 hover:bg-slate-50"
                    >
                      <CalendarDays className="w-3 h-3 mr-1" />
                      Next Birthday
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <ResultCard results={calculateAge()} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="working" className="space-y-4">
          <Card className="bg-white/95 backdrop-blur-md border-slate-200 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="w-5 h-5 text-orange-600" />
                Working Days Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DatePicker
                  label="Start Date"
                  value={workStartDate ? `${workStartDate}T00:00` : ''}
                  onChange={(value) => setWorkStartDate(value.split('T')[0])}
                  className="bg-white/80"
                  placeholder="Select start date"
                />
                
                <DatePicker
                  label="End Date"
                  value={workEndDate ? `${workEndDate}T00:00` : ''}
                  onChange={(value) => setWorkEndDate(value.split('T')[0])}
                  className="bg-white/80"
                  placeholder="Select end date"
                />

                <div className="flex flex-col justify-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeWeekends"
                      checked={includeWeekends}
                      onCheckedChange={(checked) => setIncludeWeekends(!!checked)}
                    />
                    <Label htmlFor="includeWeekends" className="text-sm text-slate-700">
                      Include weekends
                    </Label>
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setWorkStartDate(new Date().toISOString().split('T')[0])}
                      className="text-xs border-slate-300 hover:bg-slate-50"
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      Today
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const nextWeek = new Date();
                        nextWeek.setDate(nextWeek.getDate() + 7);
                        setWorkEndDate(nextWeek.toISOString().split('T')[0]);
                      }}
                      className="text-xs border-slate-300 hover:bg-slate-50"
                    >
                      <ArrowRight className="w-3 h-3 mr-1" />
                      +1 Week
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <ResultCard results={calculateWorkingDays()} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DurationTimeCalculator;
