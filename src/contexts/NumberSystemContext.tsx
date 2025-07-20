import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { NumberSystem } from '../utils/numberSystem';

interface NumberSystemContextType {
  numberSystem: NumberSystem;
  setNumberSystem: (system: NumberSystem) => void;
}

export const NumberSystemContext = createContext<NumberSystemContextType | undefined>(undefined);

interface NumberSystemProviderProps {
  children: ReactNode;
}

export const NumberSystemProvider = ({ children }: NumberSystemProviderProps) => {
  const [numberSystem, setNumberSystemState] = useState<NumberSystem>('international');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('number-system-preference');
    if (saved === 'indian' || saved === 'international') {
      setNumberSystemState(saved);
    }
  }, []);

  // Save to localStorage when changed
  const setNumberSystem = (system: NumberSystem) => {
    setNumberSystemState(system);
    localStorage.setItem('number-system-preference', system);
  };

  return (
    <NumberSystemContext.Provider value={{ numberSystem, setNumberSystem }}>
      {children}
    </NumberSystemContext.Provider>
  );
};
