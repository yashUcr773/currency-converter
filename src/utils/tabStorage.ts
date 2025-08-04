// Tab persistence utilities
// This utility automatically saves your tab selection (Currency/Timezone) 
// and restores it when you return to the app, providing a seamless experience.

import { logger } from './env';

const TAB_STORAGE_KEY = 'ratevault-active-tab';

export type TabType = 'currency' | 'timezone' | 'units' | 'calculators';

export const saveActiveTab = (tab: TabType): void => {
  try {
    localStorage.setItem(TAB_STORAGE_KEY, tab);
  } catch (error) {
    logger.warn('Failed to save active tab to localStorage:', error);
  }
};

export const getActiveTab = (): TabType => {
  try {
    const saved = localStorage.getItem(TAB_STORAGE_KEY);
    return (saved === 'currency' || saved === 'timezone' || saved === 'units' || saved === 'calculators') ? saved : 'currency';
  } catch (error) {
    logger.warn('Failed to load active tab from localStorage:', error);
    return 'currency';
  }
};
