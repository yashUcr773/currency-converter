/**
 * Format number with international number system (commas as thousands separators)
 * and up to 5 decimal places, removing trailing zeros
 */
export function formatCurrencyAmount(amount: number): string {
  if (amount === 0) return '';
  
  // Create a number formatter for the user's locale
  const formatter = new Intl.NumberFormat(undefined, {
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
export function formatForDisplay(amount: number): string {
  return formatCurrencyAmount(amount);
}
