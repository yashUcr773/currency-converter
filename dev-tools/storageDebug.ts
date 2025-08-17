// Debug utilities for storage management
// Use these in browser console for debugging storage issues

import { storageManager } from '../src/utils/storageManager';

// Add debug utilities to global window object for easy access
declare global {
  interface Window {
    storageDebug: {
      getInfo: () => void;
      clearAll: () => void;
      migrate: () => void;
      cleanup: () => void;
      exportData: () => string;
      importData: (data: string) => void;
    };
  }
}

// Initialize debug utilities
if (typeof window !== 'undefined') {
  window.storageDebug = {
    // Get comprehensive storage information
    getInfo: () => {
      const info = storageManager.getStorageInfo();
      console.group('💾 Storage Debug Info');
      console.log('📊 Storage Overview:', info);
      console.log('🔑 Local Storage Keys:', Object.keys(localStorage));
      console.log('📏 Storage Usage:', {
        totalKeys: Object.keys(localStorage).length,
        estimatedSize: JSON.stringify(localStorage).length + ' characters'
      });
      console.groupEnd();
      return info;
    },

    // Clear all storage data
    clearAll: () => {
      const confirmed = confirm('⚠️ This will clear ALL stored data. Are you sure?');
      if (confirmed) {
        storageManager.clearAllData();
        console.log('🗑️ All storage data cleared');
        window.location.reload();
      }
    },

    // Run migration manually
    migrate: () => {
      console.log('🔄 Running legacy storage migration...');
      storageManager.migrateFromLegacyStorage();
      console.log('✅ Migration completed');
    },

    // Clean up legacy keys manually
    cleanup: () => {
      console.log('🧹 Running aggressive legacy cleanup...');
      storageManager.cleanupLegacyKeys();
      console.log('✅ Cleanup completed');
    },

    // Export all data as JSON string
    exportData: () => {
      const data = {
        main: storageManager.getMainData(),
        preferences: storageManager.getPreferences(),
        itinerary: storageManager.getItineraryItems(),
        searchData: storageManager.getSearchData(),
        timezoneCache: storageManager.getTimezoneCache(),
        metadata: storageManager.getMetadata()
      };
      const exported = JSON.stringify(data, null, 2);
      console.log('📤 Exported data:', exported);
      return exported;
    },

    // Import data from JSON string
    importData: (jsonData: string) => {
      try {
        const data = JSON.parse(jsonData);
        const confirmed = confirm('⚠️ This will overwrite existing data. Continue?');
        
        if (confirmed) {
          if (data.main) storageManager.setMainData(data.main);
          if (data.preferences) storageManager.setPreferences(data.preferences);
          if (data.itinerary) storageManager.setItineraryItems(data.itinerary);
          if (data.searchData) storageManager.setSearchData(data.searchData);
          if (data.timezoneCache) storageManager.setTimezoneCache(data.timezoneCache);
          
          console.log('📥 Data imported successfully');
          window.location.reload();
        }
      } catch (error) {
        console.error('❌ Failed to import data:', error);
      }
    }
  };

  // Log instructions on how to use debug utilities
  console.group('💾 Storage Debug Utilities Available');
  console.log('Use these commands in the browser console:');
  console.log('• window.storageDebug.getInfo() - View storage information');
  console.log('• window.storageDebug.clearAll() - Clear all data');
  console.log('• window.storageDebug.migrate() - Run migration');
  console.log('• window.storageDebug.cleanup() - Clean legacy keys');
  console.log('• window.storageDebug.exportData() - Export data');
  console.log('• window.storageDebug.importData(json) - Import data');
  console.groupEnd();
}

export {}; // Make this a module
