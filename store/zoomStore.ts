// store/zoomStore.ts
import create from "zustand";

interface ZoomState {
  zoomLevel: number;
  increaseZoom: () => void;
  decreaseZoom: () => void;
  resetZoom: () => void;
  setZoom: (value: number) => void;
}

export const useZoomStore = create<ZoomState>((set) => ({
  zoomLevel: 100, // Default zoom level at 100%
  increaseZoom: () => set((state) => ({ zoomLevel: Math.min(state.zoomLevel + 10, 140) })),
  decreaseZoom: () => set((state) => ({ zoomLevel: Math.max(state.zoomLevel - 10, 50) })),
  resetZoom: () => set(() => ({ zoomLevel: 100 })),
  setZoom: (value) => set(() => ({ zoomLevel: Math.min(Math.max(value, 50), 140) })), // Limits between 50% and 200%
}));
