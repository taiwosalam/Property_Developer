// zoomStore.ts
import { create } from 'zustand';

interface ZoomState {
  zoomLevel: number;
  increaseZoom: () => void;
  decreaseZoom: () => void;
  resetZoom: () => void;
  setZoom: (value: number) => void;
}

const useZoomStore = create<ZoomState>((set) => ({
  zoomLevel: 100,
  increaseZoom: () => set((state) => ({ zoomLevel: Math.min(state.zoomLevel + 10, 200) })),
  decreaseZoom: () => set((state) => ({ zoomLevel: Math.max(state.zoomLevel - 10, 50) })),
  resetZoom: () => set({ zoomLevel: 100 }),
  setZoom: (value) => set({ zoomLevel: Math.max(50, Math.min(value, 200)) }),
}));

export default useZoomStore;