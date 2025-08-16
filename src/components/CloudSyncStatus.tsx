// Cloud Sync Status Component
// Shows sync status and provides manual sync controls for logged-in users

import { useCloudSync } from '../utils/cloudSyncManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  Upload, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader2 
} from 'lucide-react';

export function CloudSyncStatus() {
  const { 
    syncState, 
    performFullSync, 
    uploadToCloud, 
    downloadFromCloud, 
    startPeriodicSync,
    stopPeriodicSync,
    isPeriodicSyncActive,
    isLoggedIn, 
    canSync 
  } = useCloudSync();

  if (!isLoggedIn) {
    return null; // Don't show for anonymous users
  }

  const getStatusIcon = () => {
    switch (syncState.status) {
      case 'syncing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return syncState.cloudAvailable ? 
          <Cloud className="h-4 w-4 text-blue-500" /> : 
          <CloudOff className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    if (!syncState.isOnline) return 'Offline';
    if (!syncState.cloudAvailable) return 'Cloud Unavailable';
    
    switch (syncState.status) {
      case 'syncing':
        return 'Syncing...';
      case 'success':
        return 'Synced';
      case 'error':
        return syncState.error || 'Sync Failed';
      default:
        return syncState.lastSync ? 
          `Last sync: ${new Date(syncState.lastSync).toLocaleTimeString()}` : 
          'Ready to sync';
    }
  };

  const getStatusColor = () => {
    if (!syncState.isOnline || !syncState.cloudAvailable) return 'gray';
    
    switch (syncState.status) {
      case 'syncing':
        return 'blue';
      case 'success':
        return 'green';
      case 'error':
        return 'red';
      default:
        return 'blue';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {getStatusIcon()}
          Cloud Sync
          <Badge variant="outline" className={`ml-auto text-${getStatusColor()}-600`}>
            {getStatusText()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {!syncState.isOnline && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-orange-50 rounded text-sm text-orange-700">
            <AlertCircle className="h-4 w-4" />
            You're offline. Changes will sync when reconnected.
          </div>
        )}
        
        {!syncState.cloudAvailable && syncState.isOnline && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-red-50 rounded text-sm text-red-700">
            <XCircle className="h-4 w-4" />
            Cloud storage unavailable. Check your configuration.
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="default"
            onClick={performFullSync}
            disabled={!canSync || syncState.status === 'syncing'}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-3 w-3 ${syncState.status === 'syncing' ? 'animate-spin' : ''}`} />
            Sync All
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={uploadToCloud}
            disabled={!canSync || syncState.status === 'syncing'}
            className="flex items-center gap-2"
          >
            <Upload className="h-3 w-3" />
            Upload
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={downloadFromCloud}
            disabled={!canSync || syncState.status === 'syncing'}
            className="flex items-center gap-2"
          >
            <Download className="h-3 w-3" />
            Download
          </Button>
        </div>

        {/* Periodic Sync Controls */}
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600">
              Auto-sync every 5 minutes
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={isPeriodicSyncActive() ? "default" : "secondary"}
                className="text-xs"
              >
                {isPeriodicSyncActive() ? "Active" : "Inactive"}
              </Badge>
              {isPeriodicSyncActive() ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={stopPeriodicSync}
                  className="h-6 px-2 text-xs"
                >
                  Stop
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={startPeriodicSync}
                  disabled={!canSync}
                  className="h-6 px-2 text-xs"
                >
                  Start
                </Button>
              )}
            </div>
          </div>
        </div>

        {syncState.lastSync && (
          <div className="text-xs text-gray-500 mt-2">
            Last synced: {new Date(syncState.lastSync).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Compact version for header/toolbar
export function CloudSyncIndicator() {
  const { syncState, isLoggedIn, performFullSync, isPeriodicSyncActive } = useCloudSync();

  if (!isLoggedIn) {
    return null;
  }

  const getIcon = () => {
    if (!syncState.isOnline) return <CloudOff className="h-4 w-4 text-gray-400" />;
    if (!syncState.cloudAvailable) return <CloudOff className="h-4 w-4 text-red-400" />;
    
    switch (syncState.status) {
      case 'syncing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <Cloud className="h-4 w-4 text-green-500" />;
      case 'error':
        return <Cloud className="h-4 w-4 text-red-500" />;
      default:
        return <Cloud className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusText = () => {
    if (!syncState.isOnline) return 'Offline';
    if (!syncState.cloudAvailable) return 'Cloud unavailable';
    
    let baseStatus = '';
    switch (syncState.status) {
      case 'syncing':
        baseStatus = 'Syncing...';
        break;
      case 'success':
        baseStatus = 'Synced';
        break;
      case 'error':
        baseStatus = 'Sync failed';
        break;
      default:
        baseStatus = 'Ready';
    }
    
    const periodicStatus = isPeriodicSyncActive() ? 'Auto-sync: ON' : 'Auto-sync: OFF';
    return `${baseStatus} • ${periodicStatus}`;
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={performFullSync}
      disabled={syncState.status === 'syncing' || !syncState.isOnline || !syncState.cloudAvailable}
      className="flex items-center gap-1 px-2 relative"
      title={getStatusText()}
    >
      {getIcon()}
      {/* Small indicator dot for active periodic sync */}
      {isPeriodicSyncActive() && syncState.isOnline && syncState.cloudAvailable && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full border border-white"></div>
      )}
      <span className="sr-only">Cloud sync</span>
    </Button>
  );
}
