import { useContext } from 'react';
import { NumberSystemContext } from '../contexts/NumberSystemContextTypes';

export const useNumberSystem = () => {
  const context = useContext(NumberSystemContext);
  if (context === undefined) {
    throw new Error('useNumberSystem must be used within a NumberSystemProvider');
  }
  return context;
};
