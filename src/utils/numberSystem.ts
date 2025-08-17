export type NumberSystem = 'international' | 'indian';

// Utility functions for number formatting
export const formatNumber = (
  value: number, 
  system: NumberSystem = 'international',
  decimalPlaces: number = 2
): string => {
  if (isNaN(value) || !isFinite(value)) return '0';

  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimalPlaces,
  };

  if (system === 'indian') {
    // Indian number system (Lakh, Crore)
    return value.toLocaleString('en-IN', options);
  } else {
    // International system (Million, Billion)
    return value.toLocaleString('en-US', options);
  }
};

// Convert between number systems for display
export const getNumberSystemLabel = (
  value: number,
  system: NumberSystem
): string => {
  if (system === 'indian') {
    if (value >= 10000000) { // 1 Crore
      return `${(value / 10000000).toFixed(1)} Cr`;
    } else if (value >= 100000) { // 1 Lakh
      return `${(value / 100000).toFixed(1)} L`;
    } else if (value >= 1000) { // 1 Thousand
      return `${(value / 1000).toFixed(1)} K`;
    }
  } else {
    if (value >= 1000000000) { // 1 Billion
      return `${(value / 1000000000).toFixed(1)} B`;
    } else if (value >= 1000000) { // 1 Million
      return `${(value / 1000000).toFixed(1)} M`;
    } else if (value >= 1000) { // 1 Thousand
      return `${(value / 1000).toFixed(1)} K`;
    }
  }
  
  return formatNumber(value, system);
};

// Parse number string accounting for different number systems
export const parseNumberString = (str: string): number => {
  // Remove all non-digit characters except decimal point
  const cleanStr = str.replace(/[^\d.-]/g, '');
  return parseFloat(cleanStr) || 0;
};

// Format for display with proper separators
export const formatForDisplay = (
  value: number,
  system: NumberSystem = 'international'
): string => {
  if (value === 0) return '';
  return formatNumber(value, system);
};
