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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-2 sm:p-3 lg:p-4 bg-white/80 backdrop-blur-sm border-t border-slate-200">
      {/* Status indicator */}
      <div className={cn(
        'flex items-center gap-1.5 sm:gap-2 lg:gap-3 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm font-bold shadow-sm',
        getStatusColor()
      )}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>

      {/* Last sync and refresh */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2 lg:gap-4 text-xs sm:text-sm text-slate-600 w-full sm:w-auto">
        <span className="font-medium">
          <span className="hidden sm:inline">Last updated: </span>
          <span className="sm:hidden">Updated: </span>
          <span className="text-slate-500 font-medium">{formatLastSync(lastSync)}</span>
        </span>
        
        {/* Always show refresh button, but with different states */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={syncing}
          className={cn(
            "h-auto px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm flex items-center gap-1 sm:gap-2 transition-all duration-200 rounded-md sm:rounded-lg border border-transparent font-medium touch-manipulation",
            isOnline 
              ? "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 hover:border-blue-200 text-slate-600"
              : "hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-700 hover:border-orange-200 text-slate-500"
          )}
          title={isOnline ? "Refresh exchange rates" : "Try to refresh (you appear offline)"}
        >
          <RefreshCw 
            size={12} 
            className={`sm:w-3.5 sm:h-3.5 ${syncing ? 'animate-spin' : ''}`} 
          />
          <span className="hidden sm:inline">{syncing ? 'Syncing...' : isOnline ? 'Refresh' : 'Try Refresh'}</span>
          <span className="sm:hidden">{syncing ? 'Sync' : '🔄'}</span>
        </Button>
      </div>
    </div>
  );
};
