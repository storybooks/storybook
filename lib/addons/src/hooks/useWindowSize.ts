import { useState, useEffect, useCallback } from 'react';
import root from 'window-or-global';

export interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

// Hook
export const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  const handleResize = useCallback(() => {
    setWindowSize({
      width: root.innerWidth,
      height: root.innerHeight,
    });
  }, [setWindowSize, root]);

  useEffect(() => {
    root.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      root.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
};
