import { create } from "zustand";
import { getLocalStorage, saveLocalStorage } from "@/utils/local-storage";
import { TourState } from "@/tour/types";

interface TourStoreState {
  tour: TourState;
  shouldRenderTour: boolean;
  persist: boolean; // Add persist flag
  setTourState: (state: Partial<TourState>) => void;
  setShouldRenderTour: (shouldRender: boolean) => void;
  setPersist: (persist: boolean) => void; // Add method to set persist
  completeTour: (tourKey: string, persist?: boolean) => void; // Add optional persist parameter
  isTourCompleted: (tourKey: string) => boolean;
  resetTour: (tourKey: string) => void;
}

export const useTourStore = create<TourStoreState>((set, get) => ({
  tour: { run: false, stepIndex: 0, steps: [], tourKey: "" },
  shouldRenderTour: false,
  persist: true, // Default to persisting unless specified
  setTourState: (state) =>
    set((prev) => ({
      tour: { ...prev.tour, ...state },
    })),
  setShouldRenderTour: (shouldRender) =>
    set({ shouldRenderTour: shouldRender }),
  setPersist: (persist) => set({ persist }), // Method to set persist flag
  completeTour: (tourKey, persistOverride) => {
    const shouldPersist = persistOverride !== undefined ? persistOverride : get().persist;
    if (shouldPersist) {
      saveLocalStorage(`hasCompleted${tourKey}`, "true");
    }
    set({
      tour: { run: false, stepIndex: 0, steps: [], tourKey: "" },
      shouldRenderTour: false,
    });
  },
  isTourCompleted: (tourKey) => {
    const shouldPersist = get().persist;
    if (!shouldPersist) {
      return false; // If not persisting, always return false (tour not completed)
    }
    return getLocalStorage(`hasCompleted${tourKey}`) === "true";
  },
  resetTour: (tourKey) => {
    const shouldPersist = get().persist;
    if (shouldPersist) {
      saveLocalStorage(`hasCompleted${tourKey}`, "false");
    }
    set({
      tour: { run: false, stepIndex: 0, steps: [], tourKey: "" },
      shouldRenderTour: true,
    });
  },
}));