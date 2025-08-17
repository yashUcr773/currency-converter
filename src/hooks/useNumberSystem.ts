import { useContext } from "react";
import { NumberSystemContext } from "../contexts/NumberSystemContext";

export const useNumberSystem = () => {
  const context = useContext(NumberSystemContext);
  if (context === undefined) {
    throw new Error('useNumberSystem must be used within a NumberSystemProvider');
  }
  return context;
};
