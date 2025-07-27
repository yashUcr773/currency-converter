# Update Prompt Feature

## Overview
This feature automatically shows a user-friendly prompt when a new version of the app is available and the user has cached data. Instead of silently updating, the prompt informs users about what will happen and reassures them that their data is safe.

## How It Works

### Detection
- **New Version Available**: Detected via service worker `UPDATE_AVAILABLE` message
- **Cached Data Detection**: Checks both service worker cache and localStorage for:
  - Exchange rates data
  - Pinned currencies
  - App preferences
  - Any cached API responses

### User Experience Flow
1. **Service worker detects new version** → Sets `updateAvailable: true`
2. **App checks for cached data** → Sets `hasCachedData: true` if data exists
3. **Conditions met** → Auto-shows `UpdatePrompt` dialog
4. **User sees informative prompt** with details about:
   - What the update includes
   - That cached data is safe
   - Current cache size
   - Offline status (if applicable)

### Prompt Content
The prompt includes:
- **Clear messaging** about the new version
- **Data safety assurance** - cached rates and preferences are preserved
- **Cache information** - shows current cache size
- **Offline warning** - if user is currently offline
- **Action buttons** - Update Now or Update Later
- **Explanation** of what happens during update

### Technical Implementation

#### PWA Hook Enhancements
```typescript
// New interface properties
export interface PWAStatus {
  hasCachedData: boolean; // New property
  // ... existing properties
}

export interface PWAActions {
  checkForCachedData: () => boolean; // New method
  // ... existing methods
}
```

#### Cached Data Detection
```typescript
const checkForLocalStorageData = (): boolean => {
  const storageKeys = ['ratevault-data', 'pinnedCurrencies', 'exchangeRates'];
  return storageKeys.some(key => {
    const data = localStorage.getItem(key);
    return data && data !== 'null' && data !== '{}' && data !== '[]';
  });
};
```

#### Automatic Prompt Display
```typescript
useEffect(() => {
  if (status.updateAvailable && status.hasCachedData && !showUpdatePrompt) {
    setShowUpdatePrompt(true);
  }
}, [status.updateAvailable, status.hasCachedData, showUpdatePrompt]);
```

## Benefits

### User Benefits
- **No surprise updates** - users are informed before updating
- **Data safety assurance** - clear messaging that data won't be lost
- **Informed decisions** - users understand what happens during update
- **Offline awareness** - special handling when offline

### Developer Benefits
- **Better user experience** - reduces confusion about updates
- **Data preservation** - ensures users don't lose cached data
- **Clear communication** - transparent about update process
- **Progressive enhancement** - graceful handling of different states

## Testing

### Manual Testing
1. **With Cached Data**:
   - Use the app to generate cached data
   - Simulate service worker update
   - Verify prompt appears automatically

2. **Without Cached Data**:
   - Clear all data
   - Simulate service worker update
   - Verify standard update behavior

3. **Offline Scenario**:
   - Go offline
   - Have cached data
   - Simulate update
   - Verify offline-specific messaging

### Simulation
To test without actual service worker updates:
```javascript
// In browser console
window.dispatchEvent(new CustomEvent('test-update-available'));
```

## Configuration

### Storage Keys Monitored
The system checks these localStorage keys for cached data:
- `ratevault-data` - Main app data
- `pinnedCurrencies` - User's pinned currencies
- `exchangeRates` - Cached exchange rates

### Customization
To modify the detection logic, update the `checkForLocalStorageData` function in `usePWA.ts`.

## Future Enhancements

### Potential Improvements
- **Update changelog** - Show what's new in the update
- **Scheduled updates** - Allow users to schedule updates for later
- **Data backup** - Offer to backup data before updating
- **Update size** - Show download size of update
- **Progressive updates** - Partial updates for smaller changes

### Analytics Integration
Could track:
- Update prompt acceptance rate
- Time between prompt and action
- Cache size at update time
- User update preferences

## Files Modified
- `src/hooks/usePWA.ts` - Enhanced with cached data detection
- `src/components/PWAStatus.tsx` - Added automatic prompt triggering
- `src/components/UpdatePrompt.tsx` - New comprehensive update dialog
- `src/types.ts` - Updated interfaces (if needed)

## Dependencies
- React hooks (useState, useEffect, useCallback)
- shadcn/ui components (Dialog, Button)
- Lucide React icons
- Existing PWA infrastructure
