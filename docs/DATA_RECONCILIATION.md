# Data Reconciliation System

This document explains the intelligent data reconciliation system that prevents data loss when synchronizing between local storage and cloud storage.

## Overview

When a user has data in both local storage and cloud storage, conflicts can arise. Our reconciliation system uses sophisticated strategies to merge data intelligently, ensuring no information is lost.

## Reconciliation Strategies

### 1. `merge-smart` (for Main Data)
- **Purpose**: Intelligent merging that preserves the most valuable data
- **Logic**: Prefers non-null, non-empty values from either source
- **Use Case**: Currency rates, timezone selections, unit conversions

### 2. `latest-wins` (for User Preferences)
- **Purpose**: Uses the most recently modified data
- **Logic**: Compares `lastModified` timestamps and uses the newer version
- **Use Case**: User settings, themes, language preferences

### 3. `merge-union` (for Arrays and Collections)
- **Purpose**: Combines data from both sources without duplicates
- **Logic**: Creates a union of both datasets, removing duplicates
- **Use Case**: Search history, recent countries, timezone cache

### 4. `local-wins` / `cloud-wins`
- **Purpose**: Simple precedence rules
- **Logic**: Always uses data from the specified source
- **Use Case**: Testing or specific conflict scenarios

## Data Type Reconciliation

### Main Storage Data
```typescript
// Conflict Example:
Local:  { selectedCurrencies: ['USD', 'EUR'], exchangeRates: { 'USD-EUR': 0.85 } }
Cloud:  { selectedCurrencies: ['USD', 'EUR', 'GBP'], exchangeRates: { 'USD-EUR': 0.86, 'USD-GBP': 0.76 } }

// Result (merge-smart):
Merged: { 
  selectedCurrencies: ['USD', 'EUR', 'GBP'], // Cloud has more data
  exchangeRates: { 'USD-EUR': 0.86, 'USD-GBP': 0.76 } // Cloud rates are newer
}
```

### User Preferences
```typescript
// Conflict Example:
Local:  { theme: 'dark', lastModified: 1642000000 }
Cloud:  { theme: 'light', lastModified: 1642001000 }

// Result (latest-wins):
Merged: { theme: 'light', lastModified: 1642001000 } // Cloud is newer
```

### Itinerary Items
```typescript
// Conflict Example:
Local:  [{ id: '1', title: 'Trip A', updatedAt: '2025-01-20' }, { id: '2', title: 'Local Trip' }]
Cloud:  [{ id: '1', title: 'Trip A Updated', updatedAt: '2025-01-18' }, { id: '3', title: 'Cloud Trip' }]

// Result (merge-union):
Merged: [
  { id: '1', title: 'Trip A', updatedAt: '2025-01-20' }, // Local is newer
  { id: '2', title: 'Local Trip' }, // Local only
  { id: '3', title: 'Cloud Trip' }  // Cloud only
]
```

### Search Data & Cache
```typescript
// Conflict Example:
Local:  { recentCountries: ['US', 'FR'], searchHistory: ['query1', 'query2'] }
Cloud:  { recentCountries: ['US', 'DE', 'JP'], searchHistory: ['query2', 'query3'] }

// Result (merge-union):
Merged: { 
  recentCountries: ['US', 'FR', 'DE', 'JP'], // Union of unique values
  searchHistory: ['query1', 'query2', 'query3'] // Union of unique values
}
```

## Conflict Detection

The system detects conflicts by:
1. **Checksums**: Comparing data integrity hashes
2. **Timestamps**: Checking `lastModified` dates
3. **Content Comparison**: Deep comparison of data structures
4. **Device Tracking**: Identifying which device made changes

## Metadata Tracking

Each data piece includes metadata:
```typescript
{
  lastModified: 1642000000,    // When data was last changed
  deviceId: 'device-123',      // Which device made the change
  version: '1.0.0',            // Data schema version
  checksum: 'abc123'           // Data integrity hash
}
```

## Conflict Resolution Process

1. **Detection Phase**: Compare local and cloud data
2. **Strategy Selection**: Choose appropriate reconciliation strategy
3. **Merge Execution**: Apply strategy to resolve conflicts
4. **Validation**: Verify no data was lost
5. **Sync Completion**: Update both local and cloud with merged result

## Error Handling

- **Network Failures**: Graceful degradation to offline mode
- **Data Corruption**: Checksums detect and log corruption
- **Type Mismatches**: Safe casting with fallbacks
- **Sync Conflicts**: Detailed logging of all conflicts

## Performance Considerations

- **Debounced Sync**: Auto-sync is debounced to prevent excessive calls
- **Incremental Updates**: Only changed data types are synchronized
- **Queue Management**: Sync operations are queued to prevent conflicts
- **Background Processing**: Large merges don't block the UI

## Testing

The reconciliation system can be tested manually:
```javascript
// In browser console (after loading the app):
// This will run comprehensive tests of all reconciliation scenarios
runReconciliationTests();
```

## Monitoring

Reconciliation events are logged with:
- Conflict count and types
- Resolution strategies used
- Data sizes before/after merge
- Performance metrics

Example log output:
```
[CloudSync] Data conflicts resolved for main data:
  - conflictCount: 2
  - conflicts: [
      { type: "main.exchangeRates", strategy: "merge-smart" },
      { type: "main.selectedCurrencies", strategy: "merge-smart" }
    ]
```

## Best Practices

1. **Regular Sync**: Enable auto-sync for real-time reconciliation
2. **Conflict Awareness**: Monitor logs for frequent conflicts
3. **Data Validation**: Always validate merged data integrity
4. **Backup Strategy**: Cloud serves as backup for local data
5. **User Communication**: Inform users about sync status and conflicts

This system ensures that users never lose data when switching between devices or when multiple devices are used simultaneously.
