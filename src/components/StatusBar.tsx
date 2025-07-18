import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StatusBarProps {
  isOnline: boolean;
  lastSync: number;
  areRatesExpired: boolean;
  syncing: boolean;
  onRefresh: () => void;
}

export const StatusBar = ({
  isOnline,
  lastSync,
  areRatesExpired,
  syncing,
  onRefresh
}: StatusBarProps) => {
  const formatLastSync = (timestamp: number) => {
    if (!timestamp) return 'Never';
    
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  const getStatusColor = () => {
    if (!isOnline) return 'bg-destructive/10 text-destructive border-destructive/20';
    if (areRatesExpired) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline Mode';
    if (areRatesExpired) return 'Rates Expired';
    return 'Online';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff size={16} />;
    if (areRatesExpired) return <AlertTriangle size={16} />;
    return <Wifi size={16} />;
  };

  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 border-b">
      {/* Status indicator */}
      <div className={cn(
        'flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium',
        getStatusColor()
      )}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>

      {/* Last sync and refresh */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          Last updated: {formatLastSync(lastSync)}
        </span>
        
        {isOnline && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={syncing}
            className="h-auto px-2 py-1 text-sm flex items-center gap-1"
          >
            <RefreshCw 
              size={14} 
              className={syncing ? 'animate-spin' : ''} 
            />
            {syncing ? 'Syncing...' : 'Refresh'}
          </Button>
        )}
      </div>
    </div>
  );
};
