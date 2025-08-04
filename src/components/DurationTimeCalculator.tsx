import { useState } from 'react';
import { Clock, Calendar, Plus, AlertTriangle, ArrowRight, Timer, CalendarDays, Calculator, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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

  // Helper function to get current date/time with time set to 00:00
  const getTodayAt00 = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00`;
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
      <Card className="mt-6 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 border-slate-200/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            Calculation Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result, index) => (
              <div 
                key={index} 
                className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-slate-200/60 hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600 hover:bg-slate-100">
                      {result.label}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-slate-800 break-words">
                    {result.value}
                  </div>
                  {result.description && (
                    <div className="text-xs text-slate-500 italic">
                      {result.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Duration & Time Calculator
        </h2>
        <p className="text-slate-600 text-lg">Calculate time differences, add durations, and analyze dates with precision</p>
      </div>

      <Tabs defaultValue="difference" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-1 h-auto p-1 bg-slate-100/80 backdrop-blur-sm">
          <TabsTrigger 
            value="difference" 
            className="flex flex-col items-center p-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Timer className="w-5 h-5 mb-1" />
            <span>Time Diff</span>
          </TabsTrigger>
          <TabsTrigger 
            value="duration" 
            className="flex flex-col items-center p-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Calculator className="w-5 h-5 mb-1" />
            <span>Add Duration</span>
          </TabsTrigger>
          <TabsTrigger 
            value="age" 
            className="flex flex-col items-center p-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <CalendarDays className="w-5 h-5 mb-1" />
            <span>Age Calc</span>
          </TabsTrigger>
          <TabsTrigger 
            value="working" 
            className="flex flex-col items-center p-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Briefcase className="w-5 h-5 mb-1" />
            <span>Work Days</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="difference" className="space-y-4">
          <Card className="shadow-lg border-slate-200/60 bg-white/90 backdrop-blur-sm">
            <CardHeader className="space-y-3">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Timer className="w-6 h-6" />
                </div>
                Time Difference Calculator
              </CardTitle>
              <Alert className="border-amber-200 bg-amber-50/80">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Enter two dates and times to calculate the exact duration between them.
                </AlertDescription>
              </Alert>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="startDateTime" className="text-sm font-semibold text-slate-700">
                    Start Date & Time
                  </Label>
                  <div className="space-y-3">
                    <Input
                      id="startDateTime"
                      type="datetime-local"
                      value={startDateTime}
                      onChange={(e) => setStartDateTime(e.target.value)}
                      className="bg-white/80 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setStartDateTime(getTodayAt00())}
                      className="w-full border-slate-300 hover:bg-slate-50"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Set to Today 00:00 AM
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="endDateTime" className="text-sm font-semibold text-slate-700">
                    End Date & Time
                  </Label>
                  <div className="space-y-3">
                    <Input
                      id="endDateTime"
                      type="datetime-local"
                      value={endDateTime}
                      onChange={(e) => setEndDateTime(e.target.value)}
                      className="bg-white/80 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEndDateTime(getTodayAt00())}
                      className="w-full border-slate-300 hover:bg-slate-50"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Set to Today 00:00 AM
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="includeSeconds"
                  checked={includeSeconds}
                  onCheckedChange={(checked) => setIncludeSeconds(!!checked)}
                />
                <Label htmlFor="includeSeconds" className="text-sm font-medium text-slate-700">
                  Include seconds in results
                </Label>
              </div>

              <ResultCard results={calculateTimeDifference()} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="duration" className="space-y-4">
          <Card className="shadow-lg border-slate-200/60 bg-white/90 backdrop-blur-sm">
            <CardHeader className="space-y-3">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-green-100 text-green-600">
                  <Calculator className="w-6 h-6" />
                </div>
                Duration Addition/Subtraction Calculator
              </CardTitle>
              <Alert className="border-amber-200 bg-amber-50/80">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Add or subtract a duration from a specific date and time.
                </AlertDescription>
              </Alert>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="baseDateTime" className="text-sm font-semibold text-slate-700">
                  Base Date & Time
                </Label>
                <div className="space-y-3">
                  <Input
                    id="baseDateTime"
                    type="datetime-local"
                    value={baseDateTime}
                    onChange={(e) => setBaseDateTime(e.target.value)}
                    className="bg-white/80 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setBaseDateTime(getTodayAt00())}
                    className="w-full border-slate-300 hover:bg-slate-50"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Set to Today 00:00 AM
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="operation" className="text-sm font-semibold text-slate-700">
                    Operation
                  </Label>
                  <Select value={operation} onValueChange={(value: 'add' | 'subtract') => setOperation(value)}>
                    <SelectTrigger className="bg-white/80 border-slate-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add">
                        <div className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-green-600" />
                          Add (+)
                        </div>
                      </SelectItem>
                      <SelectItem value="subtract">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 flex items-center justify-center text-red-600 font-bold">−</span>
                          Subtract (−)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="durationValue" className="text-sm font-semibold text-slate-700">
                    Duration Value
                  </Label>
                  <Input
                    id="durationValue"
                    type="number"
                    placeholder="10"
                    value={durationValue}
                    onChange={(e) => setDurationValue(e.target.value)}
                    className="bg-white/80 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="durationUnit" className="text-sm font-semibold text-slate-700">
                    Unit
                  </Label>
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

              <Alert className="border-blue-200 bg-blue-50/80">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 space-y-1">
                  <div>• Months are calculated as 30.44 days (average)</div>
                  <div>• Years are calculated as 365.25 days (accounting for leap years)</div>
                  <div>• For exact month/year calculations, use specific date inputs</div>
                </AlertDescription>
              </Alert>

              <ResultCard results={calculateDurationAddition()} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="age" className="space-y-4">
          <Card className="shadow-lg border-slate-200/60 bg-white/90 backdrop-blur-sm">
            <CardHeader className="space-y-3">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <CalendarDays className="w-6 h-6" />
                </div>
                Age Calculator
              </CardTitle>
              <Alert className="border-amber-200 bg-amber-50/80">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Calculate precise age or time elapsed from a birth date to any target date.
                </AlertDescription>
              </Alert>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="birthDate" className="text-sm font-semibold text-slate-700">
                    Birth Date
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="bg-white/80 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="targetDate" className="text-sm font-semibold text-slate-700">
                    Target Date (default: today)
                  </Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="bg-white/80 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setTargetDate(new Date().toISOString().split('T')[0])}
                  className="border-slate-300 hover:bg-slate-50"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Set to Today
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
                  className="border-slate-300 hover:bg-slate-50"
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Next Birthday
                </Button>
              </div>

              <ResultCard results={calculateAge()} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="working" className="space-y-4">
          <Card className="shadow-lg border-slate-200/60 bg-white/90 backdrop-blur-sm">
            <CardHeader className="space-y-3">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                  <Briefcase className="w-6 h-6" />
                </div>
                Working Days Calculator
              </CardTitle>
              <Alert className="border-amber-200 bg-amber-50/80">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Calculate working days between two dates, optionally including weekends.
                </AlertDescription>
              </Alert>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="workStartDate" className="text-sm font-semibold text-slate-700">
                    Start Date
                  </Label>
                  <Input
                    id="workStartDate"
                    type="date"
                    value={workStartDate}
                    onChange={(e) => setWorkStartDate(e.target.value)}
                    className="bg-white/80 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="workEndDate" className="text-sm font-semibold text-slate-700">
                    End Date
                  </Label>
                  <Input
                    id="workEndDate"
                    type="date"
                    value={workEndDate}
                    onChange={(e) => setWorkEndDate(e.target.value)}
                    className="bg-white/80 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="includeWeekends"
                  checked={includeWeekends}
                  onCheckedChange={(checked) => setIncludeWeekends(!!checked)}
                />
                <Label htmlFor="includeWeekends" className="text-sm font-medium text-slate-700">
                  Include weekends in working days count
                </Label>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setWorkStartDate(new Date().toISOString().split('T')[0])}
                  className="border-slate-300 hover:bg-slate-50"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Start Today
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    setWorkEndDate(nextWeek.toISOString().split('T')[0]);
                  }}
                  className="border-slate-300 hover:bg-slate-50"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  End Next Week
                </Button>
              </div>

              <ResultCard results={calculateWorkingDays()} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DurationTimeCalculator;
