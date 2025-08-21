
// 1. First, let's fix the useRefetchOnEvent hook
// Create/Update: hooks/useRefetchOnEvent.ts
import { useEffect, useCallback, useRef } from 'react';

const useRefetchOnEvent = (eventName: string, callback: () => void) => {
  const callbackRef = useRef(callback);
  
  // Update the ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleEvent = () => {
      callbackRef.current();
    };

    window.addEventListener(eventName, handleEvent);
    
    return () => {
      window.removeEventListener(eventName, handleEvent);
    };
  }, [eventName]); // Only depend on eventName, not callback
};

export default useRefetchOnEvent;