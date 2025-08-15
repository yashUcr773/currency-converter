import { useUser } from '@clerk/clerk-react';
import { useEffect, useCallback } from 'react';

interface UserPreferences {
  baseCurrency?: string;
  pinnedCurrencies?: string[];
  preferredTimezone?: string;
  preferredLanguage?: string;
  numberSystem?: 'western' | 'eastern';
}

interface UserPublicMetadata {
  preferences?: UserPreferences;
  [key: string]: unknown;
}

export function useUserPreferences() {
  const { user, isLoaded } = useUser();

  const savePreferences = useCallback(async (preferences: UserPreferences) => {
    if (!user || !isLoaded) return;

    try {
      const currentMetadata = (user.publicMetadata as UserPublicMetadata) || {};
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          preferences: {
            ...currentMetadata.preferences,
            ...preferences,
          },
        },
      });
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }, [user, isLoaded]);

  const getPreferences = useCallback((): UserPreferences => {
    if (!user || !isLoaded) return {};
    const metadata = user.unsafeMetadata as UserPublicMetadata;
    return metadata?.preferences || {};
  }, [user, isLoaded]);

  const clearPreferences = useCallback(async () => {
    if (!user || !isLoaded) return;

    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          preferences: {},
        },
      });
    } catch (error) {
      console.error('Failed to clear user preferences:', error);
    }
  }, [user, isLoaded]);

  // Auto-sync basic preferences on user load
  useEffect(() => {
    if (!user || !isLoaded) return;

    const preferences = getPreferences();
    
    // If no preferences exist, initialize with browser locale
    if (!preferences.preferredLanguage) {
      const browserLang = navigator.language.split('-')[0] || 'en';
      savePreferences({ preferredLanguage: browserLang });
    }
  }, [user, isLoaded, getPreferences, savePreferences]);

  return {
    savePreferences,
    getPreferences,
    clearPreferences,
    isLoaded,
  };
}
