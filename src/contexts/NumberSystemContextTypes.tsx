import { createContext } from 'react';
import type { NumberSystem } from '../utils/numberSystem';

interface NumberSystemContextType {
  numberSystem: NumberSystem;
  setNumberSystem: (system: NumberSystem) => void;
}

export const NumberSystemContext = createContext<NumberSystemContextType | undefined>(undefined);
