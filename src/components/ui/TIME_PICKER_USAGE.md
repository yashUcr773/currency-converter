# Reusable Time Picker Components

This project now includes two reusable time picker components that can be used throughout the application:

## TimezoneTimePicker

A timezone-aware time picker component specifically designed for timezone-related functionality.

### Features
- Timezone-aware time display
- Supports both current time and custom set time
- Manual input and dropdown selection
- Handles day transitions (+1, -1 indicators)
- Auto-updates when not in custom mode

### Usage

```tsx
import { TimezoneTimePicker } from '@/components/ui/timezone-time-picker';

function MyComponent() {
  const handleTimeChange = (hour: number, minute: number, ampm: 'AM' | 'PM') => {
    // Handle time change
    console.log(`Time set to: ${hour}:${minute.toString().padStart(2, '0')} ${ampm}`);
  };

  return (
    <TimezoneTimePicker
      timezoneValue="America/New_York"
      setTime={null} // null for current time, Date object for custom time
      onTimeChange={handleTimeChange}
      disabled={false}
      label="Select Time"
      showManualInput={true}
      variant="outline"
      size="default"
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `timezoneValue` | `string` | required | Timezone value (e.g., 'America/New_York') |
| `setTime` | `Date \| null` | `null` | Custom set time. If null, shows current time |
| `onTimeChange` | `(hour: number, minute: number, ampm: 'AM' \| 'PM') => void` | required | Callback when time changes |
| `disabled` | `boolean` | `false` | Whether the picker is disabled |
| `className` | `string` | `''` | CSS class name for styling |
| `label` | `string` | undefined | Optional label for the picker |
| `showManualInput` | `boolean` | `true` | Whether to show manual input field |
| `variant` | `'default' \| 'outline' \| 'ghost'` | `'outline'` | Button variant |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | Button size |

## SimpleTimePicker

A simple time picker component for general use without timezone functionality.

### Features
- 12-hour and 24-hour format support
- Manual input with validation
- Dropdown selection
- Error handling and validation
- Standard time format output (HH:MM in 24-hour format)

### Usage

```tsx
import { SimpleTimePicker } from '@/components/ui/simple-time-picker';

function MyComponent() {
  const [time, setTime] = useState('09:00');

  return (
    <SimpleTimePicker
      value={time}
      onChange={setTime}
      label="Select Time"
      required={true}
      showManualInput={true}
      variant="outline"
      size="default"
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | Current time value in HH:MM format (24-hour) |
| `onChange` | `(time: string) => void` | required | Callback when time changes |
| `disabled` | `boolean` | `false` | Whether the picker is disabled |
| `required` | `boolean` | `false` | Whether the field is required |
| `className` | `string` | `''` | CSS class name for styling |
| `label` | `string` | undefined | Optional label for the picker |
| `error` | `string` | undefined | Error message to display |
| `showManualInput` | `boolean` | `true` | Whether to show manual input field |
| `variant` | `'default' \| 'outline' \| 'ghost'` | `'outline'` | Button variant |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | Button size |

## Migration Guide

### From TimezoneTimeDropdown

```tsx
// Before
<TimezoneTimeDropdown
  timezoneValue={timezone}
  setTime={customTime}
  onTimeChange={handleTimeChange}
  disabled={false}
/>

// After
<TimezoneTimePicker
  timezoneValue={timezone}
  setTime={customTime}
  onTimeChange={handleTimeChange}
  disabled={false}
/>
```

### From TimePicker (ui/time-picker.tsx)

```tsx
// Before
<TimePicker
  value={timeValue}
  onChange={handleTimeChange}
  label="Select Time"
  required={true}
/>

// After  
<SimpleTimePicker
  value={timeValue}
  onChange={handleTimeChange}
  label="Select Time"
  required={true}
/>
```

## Input Format Support

Both components support various input formats:

### Manual Input Formats
- **24-hour format**: `14:30`, `09:15`
- **12-hour format with AM/PM**: `2:30 PM`, `9:15 AM`
- **Simple format**: `2 PM`, `9 AM` (assumes :00 for minutes)

### Output Format
- **TimezoneTimePicker**: Calls `onTimeChange(hour, minute, ampm)` with parsed values
- **SimpleTimePicker**: Returns time as `HH:MM` in 24-hour format

## Features

- **Responsive Design**: Works well on mobile and desktop
- **Keyboard Support**: Full keyboard navigation support
- **Accessibility**: ARIA labels and proper focus management
- **Validation**: Input validation with error handling
- **Customizable**: Flexible styling and behavior options
- **TypeScript**: Full TypeScript support with proper typing
