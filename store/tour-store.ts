// import { create } from "zustand";
// import { getLocalStorage, saveLocalStorage } from "@/utils/local-storage";
// import { TourState, TourStep } from "@/tour/types";
// import { getTourStepsWithWelcome, pageSteps } from "@/tour/steps/page-steps";
// import { checkTargets } from "@/tour/tour-util";

// interface TourStoreState {
//   tour: TourState;
//   shouldRenderTour: boolean;
//   persist: boolean;
//   setTourState: (state: Partial<TourState>) => void;
//   setShouldRenderTour: (shouldRender: boolean) => void;
//   setPersist: (persist: boolean) => void;
//   completeTour: (tourKey: string, persist?: boolean) => void;
//   isTourCompleted: (tourKey: string) => boolean;
//   resetTour: (tourKey: string) => void;
//   goToStep: (stepIndex: number) => void;
//   restartTour: (pathname: string) => void;
// }

// export const useTourStore = create<TourStoreState>((set, get) => ({
//   tour: { run: false, stepIndex: 0, steps: [], tourKey: "" },
//   shouldRenderTour: false,
//   persist: true,
//   setTourState: (state) =>
//     set((prev) => ({
//       tour: { ...prev.tour, ...state },
//     })),
//   setShouldRenderTour: (shouldRender) =>
//     set({ shouldRenderTour: shouldRender }),
//   setPersist: (persist) => set({ persist }),
//   completeTour: (tourKey, persistOverride) => {
//     const shouldPersist =
//       persistOverride !== undefined ? persistOverride : get().persist;
//     if (shouldPersist) {
//       saveLocalStorage(`hasCompleted${tourKey}`, "true");
//     }
//     set({
//       tour: { run: false, stepIndex: 0, steps: [], tourKey: "" },
//       shouldRenderTour: false,
//     });
//   },
//   isTourCompleted: (tourKey) => {
//     const shouldPersist = get().persist;
//     if (!shouldPersist) {
//       return false;
//     }
//     return getLocalStorage(`hasCompleted${tourKey}`) === "true";
//   },
//   resetTour: (tourKey) => {
//     const shouldPersist = get().persist;
//     if (shouldPersist) {
//       saveLocalStorage(`hasCompleted${tourKey}`, "false");
//     }
//     set({
//       tour: { run: false, stepIndex: 0, steps: [], tourKey: "" },
//       shouldRenderTour: true,
//     });
//   },
//   goToStep: (stepIndex) => {
//     const { tour, setTourState } = get();
//     if (!tour.run || !tour.steps.length) {
//       console.warn("Tour is not running or no steps available.");
//       return;
//     }
//     if (stepIndex < 0 || stepIndex >= tour.steps.length) {
//       console.warn(`Invalid step index: ${stepIndex}`);
//       return;
//     }
//     const step = tour.steps[stepIndex];
//     const target =
//       step.target === "body"
//         ? document.body
//         : document.querySelector(step.target);
//     if (!target) {
//       console.warn(`Target not found for step: ${step.target}`);
//       return;
//     }
//     setTourState({ stepIndex });
//     if (step.target !== "body" && stepIndex !== 0) {
//       target.scrollIntoView({ behavior: "smooth", block: "center" });
//     }
//   },
//   restartTour: (pathname) => {
//     const selectTourConfig = () => {
//       if (pathname === "/dashboard" && !get().isTourCompleted("NavTour")) {
//         const navConfig = pageSteps["/dashboard"];
//         if (navConfig && navConfig.match?.(pathname)) {
//           get().setPersist(false);
//           return navConfig;
//         }
//       }
//       for (const key in pageSteps) {
//         const config = pageSteps[key];
//         if (
//           config.match?.(pathname) &&
//           !get().isTourCompleted(config.tourKey)
//         ) {
//           get().setPersist(config.tourKey !== "DashboardTour");
//           return config;
//         }
//       }
//       return { steps: [], tourKey: "" };
//     };

//     const config = selectTourConfig();
//     if (!config.tourKey || config.steps.length === 0) {
//       console.warn("No valid tour configuration found to restart.");
//       return;
//     }
//     const steps = getTourStepsWithWelcome(config);
//     const validSteps = checkTargets(steps);
//     if (validSteps.length > 0) {
//       set({
//         tour: {
//           run: true,
//           stepIndex: 0,
//           steps: validSteps,
//           tourKey: config.tourKey,
//         },
//         shouldRenderTour: true,
//       });
//     } else {
//       console.warn("No valid steps available to restart tour.");
//     }
//   },
// }));








import { create } from "zustand";
import { getLocalStorage, saveLocalStorage } from "@/utils/local-storage";
import { TourState, TourStep } from "@/tour/types";
import { getTourStepsWithWelcome, pageSteps } from "@/tour/steps/page-steps";
import { checkTargets } from "@/tour/tour-util";

interface TourStoreState {
  tour: TourState;
  shouldRenderTour: boolean;
  persist: boolean;
  setTourState: (state: Partial<TourState>) => void;
  setShouldRenderTour: (shouldRender: boolean) => void;
  setPersist: (persist: boolean) => void;
  completeTour: (tourKey: string, persist?: boolean) => void;
  isTourCompleted: (tourKey: string) => boolean;
  resetTour: (tourKey: string) => void;
  goToStep: (stepIndex: number) => void;
  restartTour: (pathname: string) => void;
}

export const useTourStore = create<TourStoreState>((set, get) => ({
  tour: { run: false, stepIndex: 0, steps: [], tourKey: "" },
  shouldRenderTour: false,
  persist: true, // Default to true for all tours
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
      console.log("Saving tour completion:", { tourKey, parsedData }); // Debug
      saveLocalStorage("tour", JSON.stringify(parsedData));
      console.log("Saved to localStorage:", getLocalStorage("tour")); // Debug
    }
    set({
      tour: { run: false, stepIndex: 0, steps: [], tourKey: "" },
      shouldRenderTour: false,
    });
  },
  isTourCompleted: (tourKey) => {
    const tourData = getLocalStorage("tour");
    if (tourData) {
      try {
        const parsedData = JSON.parse(tourData);
        console.log(`Checking completion for ${tourKey}:`, parsedData[tourKey]); // Debug
        return parsedData[tourKey] === true;
      } catch (e) {
        console.warn("Error parsing tour data from localStorage:", e);
      }
    }
    console.log(`No tour data found for ${tourKey} in localStorage`); // Debug
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
      console.log("Resetting tour:", { tourKey, parsedData }); // Debug
      saveLocalStorage("tour", JSON.stringify(parsedData));
    }
    set({
      tour: { run: false, stepIndex: 0, steps: [], tourKey: "" },
      shouldRenderTour: true,
    });
  },
  goToStep: (stepIndex) => {
    const { tour, setTourState } = get();
    if (!tour.run || !tour.steps.length) {
      console.warn("Tour is not running or no steps available.");
      return;
    }
    if (stepIndex < 0 || stepIndex >= tour.steps.length) {
      console.warn(`Invalid step index: ${stepIndex}`);
      return;
    }
    const step = tour.steps[stepIndex];
    const target =
      step.target === "body"
        ? document.body
        : document.querySelector(step.target);
    if (!target) {
      console.warn(`Target not found for step: ${step.target}`);
      return;
    }
    setTourState({ stepIndex });
    if (step.target !== "body" && stepIndex !== 0) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  },
  restartTour: (pathname) => {
    const selectTourConfig = () => {
      for (const key in pageSteps) {
        const config = pageSteps[key];
        if (
          config.match?.(pathname) &&
          !get().isTourCompleted(config.tourKey)
        ) {
          get().setPersist(true); // All tours persist
          console.log(`Restarting tour: ${config.tourKey}`); // Debug
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
      });
    } else {
      console.warn("No valid steps available to restart tour.");
    }
  },
}));
