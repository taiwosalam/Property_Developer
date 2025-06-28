import { useEffect } from "react";

/**
 * Reads zoomLevel from localStorage on mount, applies it to <html>,
 * and listens for changes from other tabs/windows.
 * Call this in your Header (or root) component.
 * Expects zoomLevel to be stored as a number or string in localStorage.
 */
export function useApplyZoomFromLocalStorage() {
  useEffect(() => {
    // Helper: get value from localStorage, parse as int, fallback to 100
    const getZoomValue = (): number => {
      if (typeof window === "undefined") return 100;
      let val = localStorage.getItem("zoomLevel");
      if (!val) return 100;
      // Handles both stringified numbers and JSON string
      try {
        val = JSON.parse(val);
      } catch (_err) {}
      const zoom = parseInt(val as string, 10);
      return isNaN(zoom) ? 100 : zoom;
    };

    // Set zoom on mount
    document.documentElement.style.fontSize = `${getZoomValue()}%`;

    // Listen for cross-tab changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "zoomLevel") {
        const zoom = e.newValue ? parseInt(e.newValue, 10) : 100;
        document.documentElement.style.fontSize = `${
          isNaN(zoom) ? 100 : zoom
        }%`;
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);
}
