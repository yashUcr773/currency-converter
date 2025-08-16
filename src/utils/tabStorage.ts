// Tab persistence utilities
// This utility automatically saves your tab selection (Currency/Timezone) 
// and restores it when you return to the app, providing a seamless experience.

import { storageManager } from './storageManager';

export type TabType = 'currency' | 'timezone' | 'units' | 'calculators' | 'itinerary';

export const saveActiveTab = (tab: TabType): void => {
  storageManager.updatePreferences({ activeTab: tab });
};

export const getActiveTab = (): TabType => {
  const preferences = storageManager.getPreferences();
  const saved = preferences?.activeTab;
  return (saved === 'currency' || saved === 'timezone' || saved === 'units' || saved === 'calculators' || saved === 'itinerary') 
    ? saved 
    : 'currency';
};
