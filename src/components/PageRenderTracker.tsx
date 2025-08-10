import { useRef, useEffect } from 'react';

/**
 * Debug component to track re-renders at the page level
 * Add this to your main App component to verify re-render performance
 * If this counter stays low and doesn't increment every second, 
 * then the global re-render issue is fixed!
 */
export const PageRenderTracker = () => {
  const renderCount = useRef(0);
  const lastRender = useRef(Date.now());
  
  renderCount.current += 1;
  const now = Date.now();
  const timeSinceLastRender = now - lastRender.current;
  lastRender.current = now;
  
  useEffect(() => {
    const message = `🎯 Page render #${renderCount.current} (${timeSinceLastRender}ms since last render)`;
    console.log(message);
    
    // If renders happen every ~1000ms, there's still a global timer issue
    if (renderCount.current > 3 && timeSinceLastRender >= 900 && timeSinceLastRender <= 1100) {
      console.warn('⚠️ Global re-renders still happening every second!');
    } else if (renderCount.current > 3) {
      console.log('✅ No regular global re-renders detected');
    }
  });
  
  return (
    <div className="fixed top-2 right-2 bg-black/90 text-white px-3 py-2 text-xs font-mono rounded-lg opacity-80 pointer-events-none z-50 shadow-lg border border-white/20">
      <div className="flex flex-col items-end">
        <div>Page Renders: {renderCount.current}</div>
        <div className="text-green-400">{timeSinceLastRender}ms ago</div>
      </div>
    </div>
  );
};
