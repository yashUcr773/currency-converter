import { useRef, useEffect } from 'react';
import { logger } from '../utils/env';

/**
 * Debug component to count renders - helps verify optimization
 * Only use this during development to test re-render performance
 */
export const RenderCounter = ({ name }: { name: string }) => {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    logger.log(`[RenderCounter] ${name} rendered ${renderCount.current} times`);
  });

  return (
    <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
      {name}: {renderCount.current} renders
    </div>
  );
};
