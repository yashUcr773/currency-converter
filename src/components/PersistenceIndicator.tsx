import { Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PersistenceIndicatorProps {
  isActive?: boolean;
}

export const PersistenceIndicator = ({ isActive = true }: PersistenceIndicatorProps) => {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!showSaved) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-200 text-green-800 px-3 py-2 rounded-lg shadow-sm flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
      <Check size={14} />
      <span className="text-xs font-medium">Settings saved</span>
    </div>
  );
};
