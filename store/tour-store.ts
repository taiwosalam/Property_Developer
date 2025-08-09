import { create } from "zustand";
import { getLocalStorage, saveLocalStorage } from "@/utils/local-storage";
import { TourState, TourStep } from "@/tour/types";
import { getTourStepsWithWelcome, pageSteps } from "@/tour/steps/page-steps";
import { checkTargets } from "@/tour/tour-util";

interface TourStoreState {
  tour: TourState;
  shouldRenderTour: boolean;
  persist: boolean;
  isGoToStepActive: boolean;
  setTourState: (state: Partial<TourState>) => void;
  setShouldRenderTour: (shouldRender: boolean) => void;
  setPersist: (persist: boolean) => void;
  completeTour: (tourKey: string, persist?: boolean) => void;
  isTourCompleted: (tourKey: string) => boolean;
  resetTour: (tourKey: string) => void;
  goToStep: (stepIndex: number, pathname?: string) => void;
  restartTour: (pathname: string) => void;
}

export const useTourStore = create<TourStoreState>((set, get) => ({
  tour: { run: false, stepIndex: 0, steps: [], tourKey: "" },
  shouldRenderTour: false,
  persist: false,
  isGoToStepActive: false,
  setTourState: (state) =>
    set((prev) => ({
      tour: { ...prev.tour, ...state },
    })),

  setShouldRenderTour: (shouldRender) =>
    set({ shouldRenderTour: shouldRender }),

  setPersist: (persist) => set({ persist }),

  completeTour: (tourKey, persistOverride) => {
    const shouldPersist =
      persistOverride !== undefined ? persistOverride : get().persist;
    if (shouldPersist) {
      const tourData = getLocalStorage("tour");
      let parsedData: Record<string, boolean> = {};
      if (tourData) {
        try {
          parsedData = JSON.parse(tourData);
        } catch (e) {
          console.warn("Error parsing tour data from localStorage:", e);
        }
      }
      parsedData[tourKey] = true;
      saveLocalStorage("tour", JSON.stringify(parsedData));
    }
    set({
      tour: { run: false, stepIndex: 0, steps: [], tourKey: "" },
      shouldRenderTour: false,
      isGoToStepActive: false,
    });
  },

  isTourCompleted: (tourKey) => {
    const tourData = getLocalStorage("tour");
    if (tourData) {
      try {
        const parsedData = JSON.parse(tourData);
        return parsedData[tourKey] === true;
      } catch (e) {
        console.warn("Error parsing tour data from localStorage:", e);
      }
    }
    return false;
  },

  resetTour: (tourKey) => {
    const shouldPersist = get().persist;
    if (shouldPersist) {
      const tourData = getLocalStorage("tour");
      let parsedData: Record<string, boolean> = {};
      if (tourData) {
        try {
          parsedData = JSON.parse(tourData);
        } catch (e) {
          console.warn("Error parsing tour data from localStorage:", e);
        }
      }
      parsedData[tourKey] = false;
      saveLocalStorage("tour", JSON.stringify(parsedData));
    }
    set({
      tour: { run: false, stepIndex: 0, steps: [], tourKey: "" },
      shouldRenderTour: true,
      isGoToStepActive: false,
    });
  },

  goToStep: (stepIndex, pathnameOverride) => {
    const pathname = pathnameOverride || window.location.pathname;
    // Find the tour configuration for the pathname
    const selectTourConfig = () => {
      for (const key in pageSteps) {
        const config = pageSteps[key];
        if (config.match?.(pathname)) {
          if (get().persist) {
            const tourData = getLocalStorage("tour");
            let parsedData: Record<string, boolean> = {};
            if (tourData) {
              try {
                parsedData = JSON.parse(tourData);
              } catch (e) {
                console.warn("Error parsing tour data from localStorage:", e);
              }
            }
            parsedData[config.tourKey] = false;
            saveLocalStorage("tour", JSON.stringify(parsedData));
          }
          get().setPersist(true);
          return config;
        }
      }
      return { steps: [], tourKey: "" };
    };

    const config = selectTourConfig();
    if (!config.tourKey || config.steps.length === 0) {
      console.warn("No valid tour configuration found for goToStep.");
      return;
    }

    const steps = getTourStepsWithWelcome(config);
    const validSteps = checkTargets(steps);
    if (validSteps.length === 0) {
      console.warn("No valid steps available for goToStep.");
      return;
    }

    if (stepIndex < 0 || stepIndex >= validSteps.length) {
      console.warn(`Invalid step index: ${stepIndex}`);
      return;
    }

    const step = validSteps[stepIndex];
    const target =
      step.target === "body"
        ? document.body
        : document.querySelector(step.target);
    if (!target) {
      console.warn(`Target not found for step: ${step.target}`);
      return;
    }

    // Set isGoToStepActive first
    set({ isGoToStepActive: true });

    // Delay tour initialization to ensure state is updated
    setTimeout(() => {
      set({
        tour: {
          run: true,
          stepIndex,
          steps: validSteps,
          tourKey: config.tourKey,
        },
        shouldRenderTour: true,
      });

      if (step.target !== "body" && stepIndex !== 0) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 10); // Small delay to ensure state propagation
  },

  restartTour: (pathname) => {
    const selectTourConfig = () => {
      for (const key in pageSteps) {
        const config = pageSteps[key];
        if (config.match?.(pathname)) {
          if (get().persist) {
            const tourData = getLocalStorage("tour");
            let parsedData: Record<string, boolean> = {};
            if (tourData) {
              try {
                parsedData = JSON.parse(tourData);
              } catch (e) {
                console.warn("Error parsing tour data from localStorage:", e);
              }
            }
            parsedData[config.tourKey] = false;
            saveLocalStorage("tour", JSON.stringify(parsedData));
          }
          get().setPersist(true);
          return config;
        }
      }
      return { steps: [], tourKey: "" };
    };

    const config = selectTourConfig();
    if (!config.tourKey || config.steps.length === 0) {
      console.warn("No valid tour configuration found to restart.");
      return;
    }
    const steps = getTourStepsWithWelcome(config);
    const validSteps = checkTargets(steps);
    if (validSteps.length > 0) {
      set({
        tour: {
          run: true,
          stepIndex: 0,
          steps: validSteps,
          tourKey: config.tourKey,
        },
        shouldRenderTour: true,
        isGoToStepActive: false,
      });
    } else {
      console.warn("No valid steps available to restart tour.");
    }
  },
}));
