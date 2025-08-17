/**
 * Timezone conversion utilities
 * Provides reliable timezone conversion functions
 */

/**
 * Create a Date object that represents a specific time in a given timezone
 * @param timezone - The timezone identifier (e.g., 'America/New_York')
 * @param year - Year
 * @param month - Month (0-11, JavaScript month indexing)
 * @param day - Day of month (1-31)
 * @param hour - Hour (0-23)
 * @param minute - Minute (0-59)
 * @returns Date object representing the UTC time for the given local time in the timezone
 */
export function createTimeInTimezone(
  timezone: string,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): Date {
  // Create a temporary date in local time
  const tempDate = new Date(year, month, day, hour, minute, 0);
  
  // Get the timezone offset at this date (to handle DST correctly)
  const utcTime = tempDate.getTime() - (tempDate.getTimezoneOffset() * 60000);
  const utcDate = new Date(utcTime);
  
  // Format this UTC time to the target timezone
  const targetTimeString = utcDate.toLocaleString('sv-SE', { 
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  // Parse the formatted time
  const match = targetTimeString.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
  if (!match) {
    throw new Error(`Could not parse timezone string: ${targetTimeString}`);
  }
  
  const [, tYear, tMonth, tDay, tHour, tMinute, tSecond] = match.map(Number);
  const targetLocalTime = new Date(tYear, tMonth - 1, tDay, tHour, tMinute, tSecond);
  
  // Calculate the offset between what we wanted and what we got
  const desiredLocalTime = new Date(year, month, day, hour, minute, 0);
  const offset = desiredLocalTime.getTime() - targetLocalTime.getTime();
  
  // Return the UTC time adjusted by this offset
  return new Date(utcDate.getTime() + offset);
}

/**
 * Convert a UTC time to local time in a specific timezone
 * @param utcDate - The UTC date to convert
 * @param timezone - The target timezone identifier
 * @returns Date object representing the local time in the target timezone
 */
export function convertUtcToTimezone(utcDate: Date, timezone: string): Date {
  try {
    const timeString = utcDate.toLocaleString('sv-SE', { 
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    const match = timeString.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
    if (!match) {
      throw new Error(`Could not parse timezone string: ${timeString}`);
    }
    
    const [, year, month, day, hour, minute, second] = match.map(Number);
    return new Date(year, month - 1, day, hour, minute, second);
  } catch (error) {
    console.error(`Error converting UTC to ${timezone}:`, error);
    throw error;
  }
}

/**
 * Get the current time in a specific timezone
 * @param timezone - The timezone identifier
 * @returns Date object representing the current local time in the timezone
 */
export function getCurrentTimeInTimezone(timezone: string): Date {
  const now = new Date();
  return convertUtcToTimezone(now, timezone);
}
