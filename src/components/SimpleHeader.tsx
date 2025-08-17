// Simplified Header Component
// Replaces the overly complex CombinedHeader

import { useTranslation } from 'react-i18next';
import { 
  DollarSign,
  Clock,
  Calculator,
  MapPin,
  Wifi,
  WifiOff,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TabType } from '../types/index';

interface SimpleHeaderProps {
  // Status
  isOnline: boolean;
  lastSync: number;
  areRatesExpired: boolean;
  syncing: boolean;
  onRefresh: () => void;
  
  // Navigation
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const SimpleHeader = ({
  isOnline,
  lastSync,
  areRatesExpired,
  syncing,
  onRefresh,
  activeTab,
  onTabChange
}: SimpleHeaderProps) => {
  const { t } = useTranslation();

  const formatLastSync = (timestamp: number) => {
    if (!timestamp) return t('statusBar.never');
    
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
    if (!isOnline) return 'Offline';
    if (areRatesExpired) return 'Rates expired';
    return 'Online';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff size={16} />;
    if (areRatesExpired) return <AlertTriangle size={16} />;
    return <Wifi size={16} />;
  };

  const tabs = [
    { id: 'currency' as TabType, label: 'Currency', icon: DollarSign },
    { id: 'timezone' as TabType, label: 'Timezone', icon: Clock },
    { id: 'units' as TabType, label: 'Units', icon: Calculator },
    { id: 'itinerary' as TabType, label: 'Travel', icon: MapPin }
  ];

  return (
    <header className="bg-card/80 backdrop-blur-sm shadow-lg border-b border-border">
      {/* Status Bar */}
      <div className="bg-background/90 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            {/* Status */}
            <div className={cn(
              "flex items-center gap-2 px-2 py-1 rounded-md border",
              getStatusColor()
            )}>
              {getStatusIcon()}
              <span>{getStatusText()}</span>
              {lastSync > 0 && (
                <span className="text-xs opacity-75">
                  • {formatLastSync(lastSync)}
                </span>
              )}
            </div>

            {/* Refresh Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={syncing || !isOnline}
              className="h-8"
            >
              <RefreshCw 
                size={16} 
                className={cn(syncing && "animate-spin")}
              />
              <span className="ml-1 hidden sm:inline">
                {syncing ? 'Syncing...' : 'Refresh'}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg shadow-sm">
              <DollarSign className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">RateVault</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Currency & Travel Tools
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "flex items-center gap-2 h-9",
                    isActive && "shadow-sm"
                  )}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">
                    {tab.label}
                  </span>
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
