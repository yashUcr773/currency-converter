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
    if (!isOnline) return 'bg-red-50 text-red-700 border-red-200';
    if (areRatesExpired) return 'bg-orange-50 text-orange-700 border-orange-200';
    return 'bg-green-50 text-green-700 border-green-200';
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
    <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-t border-slate-200">
      {/* Status indicator */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-2 rounded-full border text-sm font-bold shadow-sm',
        getStatusColor()
      )}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>

      {/* Last sync and refresh */}
      <div className="flex items-center gap-4 text-sm text-slate-600">
        <span className="font-medium">
          Last updated: <span className="text-slate-500 font-medium">{formatLastSync(lastSync)}</span>
        </span>
        
        {isOnline && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={syncing}
            className="h-auto px-3 py-2 text-sm flex items-center gap-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 transition-all duration-200 rounded-lg border border-transparent hover:border-blue-200 text-slate-600 font-medium"
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
