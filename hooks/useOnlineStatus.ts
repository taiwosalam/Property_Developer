import { useState, useEffect, useCallback } from 'react';

/**
 * Callback function type for online status changes
 */
type OnStatusChangeCallback = (isOnline: boolean) => void;

/**
 * Custom hook to track and respond to network connectivity changes
 * 
 * @param onStatusChange - Optional callback function that will be called whenever the online status changes
 * @returns The current online status (true = online, false = offline)
 */
export function useOnlineStatus(onStatusChange?: OnStatusChangeCallback): boolean {
  // Initialize state with current online status
  const [onlineStatus, setOnlineStatus] = useState<boolean>(navigator.onLine);
  
  // Memoize the status update function to avoid recreating it on each render
  const updateStatus = useCallback((status: boolean) => {
    setOnlineStatus(status);
    if (onStatusChange) onStatusChange(status);
  }, [onStatusChange]);
  
  useEffect(() => {
    // Create handler functions that call updateStatus
    const handleOnline = () => updateStatus(true);
    const handleOffline = () => updateStatus(false);
    
    // Set initial status
    updateStatus(navigator.onLine);
    
    // Add event listeners for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Clean up function to remove event listeners when component unmounts
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [updateStatus]); // Only re-run effect if updateStatus changes
  
  return onlineStatus;
}