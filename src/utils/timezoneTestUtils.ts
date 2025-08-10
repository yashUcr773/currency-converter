/**
 * Test the timezone conversion utilities
 * This can be run in the browser console to verify timezone conversions work correctly
 */

import { createTimeInTimezone, convertUtcToTimezone } from './timezoneUtils';

export function testTimezoneConversions() {
  console.log('🧪 Testing timezone conversions...');
  
  try {
    // Test: Create 3:00 PM in New York time
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    
    console.log(`📅 Testing for date: ${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
    
    // Create 3:00 PM (15:00) in New York
    const nyTime = createTimeInTimezone('America/New_York', year, month, day, 15, 0);
    console.log(`🗽 3:00 PM in New York = ${nyTime.toISOString()} UTC`);
    
    // Convert this UTC time to London time
    const londonTime = convertUtcToTimezone(nyTime, 'Europe/London');
    console.log(`🇬🇧 Equivalent in London: ${londonTime.toLocaleString()}`);
    
    // Convert to Tokyo time
    const tokyoTime = convertUtcToTimezone(nyTime, 'Asia/Tokyo');
    console.log(`🇯🇵 Equivalent in Tokyo: ${tokyoTime.toLocaleString()}`);
    
    // Test another scenario: 10:30 AM in Tokyo
    const tokyoUtc = createTimeInTimezone('Asia/Tokyo', year, month, day, 10, 30);
    console.log(`🗾 10:30 AM in Tokyo = ${tokyoUtc.toISOString()} UTC`);
    
    const nyFromTokyo = convertUtcToTimezone(tokyoUtc, 'America/New_York');
    console.log(`🇺🇸 Equivalent in New York: ${nyFromTokyo.toLocaleString()}`);
    
    const londonFromTokyo = convertUtcToTimezone(tokyoUtc, 'Europe/London');
    console.log(`🇬🇧 Equivalent in London: ${londonFromTokyo.toLocaleString()}`);
    
    console.log('✅ Timezone conversion tests completed!');
    
    return {
      nyTime,
      londonTime,
      tokyoTime,
      tokyoUtc,
      nyFromTokyo,
      londonFromTokyo
    };
  } catch (error) {
    console.error('❌ Timezone conversion test failed:', error);
    throw error;
  }
}

// Auto-run test if in development
if (import.meta.env.DEV) {
  console.log('🔧 Development mode - running timezone tests...');
  // Delay to ensure everything is loaded
  setTimeout(() => {
    try {
      testTimezoneConversions();
    } catch (error) {
      console.error('Auto-test failed:', error);
    }
  }, 1000);
}

export default testTimezoneConversions;
