import { useEffect } from "react";

const useRefetchOnEvent = (eventName: string, refetch: () => void) => {
  useEffect(() => {
    const handleRefetch = () => {
      refetch();
    };

    window.addEventListener(eventName, handleRefetch);
    return () => {
      window.removeEventListener(eventName, handleRefetch);
    };
  }, [eventName, refetch]);
};

export default useRefetchOnEvent;
