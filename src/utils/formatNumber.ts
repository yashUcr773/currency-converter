import type { NumberSystem } from './numberSystem';
import { storageManager } from './storageManager';

/**
 * Get the current number system preference from centralized storage
 */
function getCurrentNumberSystem(): NumberSystem {
  const preferences = storageManager.getPreferences();
  const saved = preferences?.numberSystem;
  
  // Map the old 'indian'/'international' to new 'eastern'/'western'
  if (saved === 'eastern') return 'indian';
  if (saved === 'western') return 'international';
  
  // Fallback for legacy values or if not set
  return 'international';
}

/**
 * Format number with selected number system (commas as thousands separators)
 * and up to 5 decimal places, removing trailing zeros
 */
export function formatCurrencyAmount(amount: number, system?: NumberSystem): string {
  if (amount === 0) return '';
  
  const numberSystem = system || getCurrentNumberSystem();
  
  // Create a number formatter for the appropriate locale
  const locale = numberSystem === 'indian' ? 'en-IN' : 'en-US';
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 5,
    useGrouping: true, // This adds commas/spaces as thousands separators
  });
  
  return formatter.format(amount);
}

/**
 * Parse a formatted number string back to a number
 * Handles international formatting (removes commas, spaces, etc.)
 */
export function parseCurrencyAmount(formattedValue: string): number {
  if (!formattedValue || formattedValue.trim() === '') return 0;
  
  // Remove all non-digit characters except decimal point and minus sign
  const cleanedValue = formattedValue.replace(/[^\d.-]/g, '');
  
  const parsed = parseFloat(cleanedValue);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format number for input display (no commas, to work with HTML number input)
 */
export function formatForInput(amount: number): string {
  if (amount === 0) return '';
  
  // Format to show up to 5 decimal places, removing trailing zeros
  return parseFloat(amount.toFixed(5)).toString();
}

/**
 * Format number for display (with commas and proper locale formatting)
 */
export function formatForDisplay(amount: number, system?: NumberSystem): string {
  return formatCurrencyAmount(amount, system);
}

/**
 * Listen for number system changes and re-format displays
 */
export function onNumberSystemChange(callback: (system: NumberSystem) => void): () => void {
  const handler = (event: CustomEvent<NumberSystem>) => {
    callback(event.detail);
  };
  
  window.addEventListener('numberSystemChanged', handler as EventListener);
  
  return () => {
    window.removeEventListener('numberSystemChanged', handler as EventListener);
  };
}
