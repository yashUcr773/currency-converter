// Storage Initialization Hook
// Handles storage migration and setup

import { useEffect, useState } from 'react';
import { storage } from '../utils/storageSimple';
import type { NumberSystem } from '../types/index';

export const useStorageInit = () => {
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [numberSystem, setNumberSystemState] = useState<NumberSystem>('international');

  // Initialize storage and migrate legacy data
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        // Run migration once
        storage.migrateFromLegacyStorage();
        setMigrationComplete(true);

        // Load preferences
        const preferences = storage.getPreferences();
        const savedNumberSystem = preferences.numberSystem === 'eastern' ? 'indian' : 'international';
        setNumberSystemState(savedNumberSystem);

        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Storage initialization completed');
        }
      } catch (error) {
        console.error('Failed to initialize storage:', error);
        setMigrationComplete(true); // Continue even if migration fails
      }
    };

    initializeStorage();
  }, []);

  // Save number system preference
  const setNumberSystem = (system: NumberSystem) => {
    setNumberSystemState(system);
    storage.updatePreferences({ 
      numberSystem: system === 'indian' ? 'eastern' : 'western' 
    });
    window.dispatchEvent(new CustomEvent('numberSystemChanged', { detail: system }));
  };

  return {
    migrationComplete,
    numberSystem,
    setNumberSystem
  };
};
