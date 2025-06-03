// "use client";

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { usePathname } from "next/navigation";
// import { usePersonalInfoStore } from "@/store/personal-info-store";
// import { getTourStepsWithWelcome, pageSteps } from "../steps/page-steps";
// import { TourState, TourStep } from "../types";
// import TourOverlay from "./tour-overlay";
// import TourCard from "./tour-card";
// import {
//   checkTargets,
//   debugMissingTargets,
//   positionTooltip,
// } from "../tour-util";
// import { useTourStore } from "@/store/tour-store";

// const CustomTour: React.FC = () => {
//   const pathname = usePathname();
//   const companyStatus = usePersonalInfoStore((state) => state.company_status);
//   const {
//     tour: tourState,
//     shouldRenderTour,
//     setTourState,
//     setShouldRenderTour,
//     setPersist,
//     completeTour,
//     isTourCompleted,
//     restartTour,
//     persist,
//   } = useTourStore();
//   const [isMounted, setIsMounted] = useState(false);
//   const tooltipRef = useRef<HTMLDivElement>(null);
//   const retryCountRef = useRef(0);
//   const maxRetries = 15;
//   const retryInterval = 1000;
//   const initialDelay = 2000;
//   const animationFrameRef = useRef<number | null>(null);
//   const observerRef = useRef<MutationObserver | null>(null);

//   useEffect(() => {
//     setIsMounted(true);
//     return () => {
//       if (observerRef.current) observerRef.current.disconnect();
//       if (animationFrameRef.current)
//         cancelAnimationFrame(animationFrameRef.current);
//     };
//   }, []);

//   // const selectTourConfig = () => {
//   //   if (pathname === "/dashboard" && !isTourCompleted("NavTour")) {
//   //     const navConfig = pageSteps["/dashboard"];
//   //     if (navConfig && navConfig.match?.(pathname)) {
//   //       setPersist(false);
//   //       return navConfig;
//   //     }
//   //   }

//   //   for (const key in pageSteps) {
//   //     const config = pageSteps[key];
//   //     if (config.match?.(pathname) && !isTourCompleted(config.tourKey)) {
//   //       setPersist(config.tourKey !== "DashboardTour");
//   //       return config;
//   //     }
//   //   }

//   //   return { steps: [], tourKey: "" };
//   // };

//   const selectTourConfig = () => {
//     // Check NavTour for dashboard first
//     if (pathname === "/dashboard" && !isTourCompleted("NavTour")) {
//       const navConfig = pageSteps["/dashboard"];
//       if (navConfig && navConfig.match?.(pathname)) {
//         setPersist(false);
//         return navConfig;
//       }
//     }

//     // Check other tours
//     for (const key in pageSteps) {
//       const config = pageSteps[key];
//       if (config.match?.(pathname) && !isTourCompleted(config.tourKey)) {
//         setPersist(config.tourKey !== "DashboardTour");
//         return config;
//       }
//     }

//     return { steps: [], tourKey: "" };
//   };

//   // const startTour = (steps: TourStep[], tourKey: string) => {
//   //   if (retryCountRef.current >= maxRetries) {
//   //     setShouldRenderTour(false);
//   //     return;
//   //   }

//   //   const validSteps = steps.filter((step, index) => {
//   //     if (index === 0 && step.target === "body") return true;
//   //     if (tourKey === "PropertiesTour" && step.target === ".add-property-modal")
//   //       return true;
//   //     const element = document.querySelector(step.target);
//   //     if (!element) {
//   //       console.log(
//   //         `Target ${step.target} not found for ${tourKey}. Skipping step.`
//   //       );
//   //       return false;
//   //     }
//   //     return true;
//   //   });

//   //   if (validSteps.length > 1) {
//   //     setTourState({ run: true, stepIndex: 0, steps: validSteps, tourKey });
//   //     retryCountRef.current = 0;
//   //   } else {
//   //     debugMissingTargets(steps, tourKey);
//   //     retryCountRef.current += 1;
//   //     setTimeout(
//   //       () => startTour(steps, tourKey),
//   //       retryCountRef.current === 1 ? initialDelay : retryInterval
//   //     );
//   //   }
//   // };

//   const startTour = (steps: TourStep[], tourKey: string) => {
//     // Check if tour is already completed in localStorage
//     if (isTourCompleted(tourKey)) {
//       setShouldRenderTour(false);
//       return;
//     }

//     if (retryCountRef.current >= maxRetries) {
//       setShouldRenderTour(false);
//       return;
//     }

//     const validSteps = steps.filter((step, index) => {
//       if (index === 0 && step.target === "body") return true;
//       if (tourKey === "PropertiesTour" && step.target === ".add-property-modal")
//         return true;
//       const element = document.querySelector(step.target);
//       if (!element) {
//         console.log(
//           `Target ${step.target} not found for ${tourKey}. Skipping step.`
//         );
//         return false;
//       }
//       return true;
//     });

//     if (validSteps.length > 1) {
//       setTourState({ run: true, stepIndex: 0, steps: validSteps, tourKey });
//       retryCountRef.current = 0;
//     } else {
//       debugMissingTargets(steps, tourKey);
//       retryCountRef.current += 1;
//       setTimeout(
//         () => startTour(steps, tourKey),
//         retryCountRef.current === 1 ? initialDelay : retryInterval
//       );
//     }
//   };

//   const updatePosition = useCallback(
//     (step: TourStep, target: Element) => {
//       if (!tourState.run || !tooltipRef.current) {
//         if (animationFrameRef.current)
//           cancelAnimationFrame(animationFrameRef.current);
//         return;
//       }

//       positionTooltip(target, tooltipRef, step.placement);
//       animationFrameRef.current = requestAnimationFrame(() =>
//         updatePosition(step, target)
//       );
//     },
//     [tourState.run]
//   );

//   useEffect(() => {
//     if (
//       tourState.tourKey === "PropertiesTour" &&
//       tourState.run &&
//       tourState.stepIndex === 8
//     ) {
//       const modal = document.querySelector(".add-property-modal");
//       if (modal) {
//         setTourState({ stepIndex: tourState.stepIndex + 1 });
//       } else {
//         observerRef.current = new MutationObserver(() => {
//           if (document.querySelector(".add-property-modal")) {
//             setTourState({ stepIndex: tourState.stepIndex + 1 });
//             observerRef.current?.disconnect();
//           }
//         });
//         observerRef.current.observe(document.body, {
//           childList: true,
//           subtree: true,
//         });
//       }
//     }
//     return () => {
//       if (observerRef.current) observerRef.current.disconnect();
//     };
//   }, [tourState, setTourState]);

//   useEffect(() => {
//     if (!isMounted || companyStatus === null || !shouldRenderTour) {
//       return;
//     }

//     const config = selectTourConfig();
//     if (!config.tourKey || config.steps.length === 0) {
//       setShouldRenderTour(false);
//       return;
//     }

//     if (config.condition && !config.condition()) {
//       completeTour(config.tourKey, config.tourKey !== "DashboardTour");
//       setShouldRenderTour(false);
//       return;
//     }

//     const steps = getTourStepsWithWelcome(config);
//     startTour(steps, config.tourKey);
//   }, [
//     pathname,
//     isMounted,
//     companyStatus,
//     shouldRenderTour,
//     setTourState,
//     setShouldRenderTour,
//     completeTour,
//   ]);

//   useEffect(() => {
//     if (!tourState.run || tourState.stepIndex >= tourState.steps.length) {
//       if (animationFrameRef.current)
//         cancelAnimationFrame(animationFrameRef.current);
//       return;
//     }

//     const step = tourState.steps[tourState.stepIndex];
//     const target =
//       step.target === "body"
//         ? document.body
//         : document.querySelector(step.target);

//     if (!target) {
//       console.warn(`Target not found for step: ${step.target}. Skipping step.`);
//       handleNext();
//       return;
//     }

//     const matches =
//       step.target === "body"
//         ? [document.body]
//         : document.querySelectorAll(step.target);
//     if (matches.length > 1) {
//       console.warn(
//         `Multiple elements found for ${step.target}. Using first match.`,
//         matches
//       );
//     }

//     // Skip scrolling for body or welcome step
//     if (step.target !== "body" && tourState.stepIndex !== 0) {
//       target.scrollIntoView({ behavior: "smooth", block: "center" });
//     }

//     const scrollTimeout = setTimeout(() => {
//       if (animationFrameRef.current)
//         cancelAnimationFrame(animationFrameRef.current);
//       updatePosition(step, target);
//     }, 100);

//     return () => {
//       clearTimeout(scrollTimeout);
//       if (animationFrameRef.current)
//         cancelAnimationFrame(animationFrameRef.current);
//     };
//   }, [tourState.stepIndex, tourState.run, tourState.steps, updatePosition]);

//   const handleNext = () => {
//     if (tourState.stepIndex < tourState.steps.length - 1) {
//       setTourState({ stepIndex: tourState.stepIndex + 1 });
//     } else {
//       handleFinish();
//     }
//   };

//   const handleBack = () => {
//     if (tourState.stepIndex > 0) {
//       setTourState({ stepIndex: tourState.stepIndex - 1 });
//     }
//   };

//   const handleSkip = () => {
//     completeTour(tourState.tourKey, tourState.tourKey !== "DashboardTour");
//   };

//   const handleFinish = () => {
//     completeTour(tourState.tourKey, tourState.tourKey !== "DashboardTour");
//     if (
//       tourState.tourKey === "NavTour" &&
//       pathname === "/dashboard" &&
//       !isTourCompleted("DashboardTour")
//     ) {
//       const config = pageSteps["/dashboard"];
//       if (config && config.match?.(pathname)) {
//         const steps = getTourStepsWithWelcome(config);
//         const validSteps = checkTargets(steps);
//         if (validSteps.length > 0) {
//           startTour(validSteps, "DashboardTour");
//         }
//       }
//     }
//   };

//   const handleDeclineTour = () => {
//     completeTour(tourState.tourKey, tourState.tourKey !== "DashboardTour");
//   };

//   const handleRestart = () => {
//     restartTour(pathname);
//   };

//   if (!isMounted || !tourState.run || tourState.steps.length === 0) {
//     return null;
//   }

//   const currentStep = tourState.steps[tourState.stepIndex];
//   const targetElement =
//     currentStep.target === "body"
//       ? document.body
//       : document.querySelector(currentStep.target);
//   if (!targetElement) {
//     console.warn(`Current step target not found: ${currentStep.target}`);
//     handleNext();
//     return null;
//   }

//   return (
//     <>
//       <TourOverlay
//         step={currentStep}
//         targetElement={
//           currentStep.target === "body" ? document.body : targetElement
//         }
//       />
//       <TourCard
//         step={currentStep}
//         stepIndex={tourState.stepIndex}
//         totalSteps={tourState.steps.length}
//         isFirstStep={tourState.stepIndex === 0}
//         isLastStep={tourState.stepIndex === tourState.steps.length - 1}
//         isWelcomeStep={tourState.stepIndex === 0}
//         tooltipRef={tooltipRef}
//         onBack={handleBack}
//         onNext={handleNext}
//         onSkip={tourState.stepIndex === 0 ? handleDeclineTour : handleSkip}
//         onRestart={handleRestart}
//       />
//     </>
//   );
// };

// export default CustomTour;

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { getTourStepsWithWelcome, pageSteps } from "../steps/page-steps";
import { TourState, TourStep } from "../types";
import TourOverlay from "./tour-overlay";
import TourCard from "./tour-card";
import {
  checkTargets,
  debugMissingTargets,
  positionTooltip,
} from "../tour-util";
import { useTourStore } from "@/store/tour-store";

const CustomTour: React.FC = () => {
  const pathname = usePathname();
  const companyStatus = usePersonalInfoStore((state) => state.company_status);
  const {
    tour: tourState,
    shouldRenderTour,
    persist,
    setTourState,
    setShouldRenderTour,
    setPersist,
    completeTour,
    isTourCompleted,
    restartTour,
  } = useTourStore();
  const [isMounted, setIsMounted] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 15;
  const retryInterval = 1000;
  const initialDelay = 2000;
  const animationFrameRef = useRef<number | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const selectTourConfig = () => {
    for (const key in pageSteps) {
      const config = pageSteps[key];
      if (config.match?.(pathname) && !isTourCompleted(config.tourKey)) {
        setPersist(true); // All tours persist by default
        console.log(`Selected tour: ${config.tourKey}, persist: ${persist}`); // Debug
        return config;
      }
    }
    console.log("No valid tour configuration found for pathname:", pathname); // Debug
    return { steps: [], tourKey: "" };
  };

  const startTour = (steps: TourStep[], tourKey: string) => {
    console.log(
      `Starting tour: ${tourKey}, isCompleted: ${isTourCompleted(tourKey)}`
    ); // Debug
    if (isTourCompleted(tourKey)) {
      setShouldRenderTour(false);
      return;
    }

    if (retryCountRef.current >= maxRetries) {
      setShouldRenderTour(false);
      console.log(`Max retries reached for tour: ${tourKey}`); // Debug
      return;
    }

    const validSteps = steps.filter((step, index) => {
      if (index === 0 && step.target === "body") return true;
      if (tourKey === "PropertiesTour" && step.target === ".add-property-modal")
        return true;
      const element = document.querySelector(step.target);
      if (!element) {
        console.log(
          `Target ${step.target} not found for ${tourKey}. Skipping step.`
        );
        return false;
      }
      return true;
    });

    if (validSteps.length > 1) {
      setTourState({ run: true, stepIndex: 0, steps: validSteps, tourKey });
      retryCountRef.current = 0;
      console.log(`Tour started: ${tourKey}, steps: ${validSteps.length}`); // Debug
    } else {
      debugMissingTargets(steps, tourKey);
      retryCountRef.current += 1;
      setTimeout(
        () => startTour(steps, tourKey),
        retryCountRef.current === 1 ? initialDelay : retryInterval
      );
    }
  };

  const updatePosition = useCallback(
    (step: TourStep, target: Element) => {
      if (!tourState.run || !tooltipRef.current) {
        if (animationFrameRef.current)
          cancelAnimationFrame(animationFrameRef.current);
        return;
      }

      positionTooltip(target, tooltipRef, step.placement);
      animationFrameRef.current = requestAnimationFrame(() =>
        updatePosition(step, target)
      );
    },
    [tourState.run]
  );

  useEffect(() => {
    if (
      tourState.tourKey === "PropertiesTour" &&
      tourState.run &&
      tourState.stepIndex === 8
    ) {
      const modal = document.querySelector(".add-property-modal");
      if (modal) {
        setTourState({ stepIndex: tourState.stepIndex + 1 });
      } else {
        observerRef.current = new MutationObserver(() => {
          if (document.querySelector(".add-property-modal")) {
            setTourState({ stepIndex: tourState.stepIndex + 1 });
            observerRef.current?.disconnect();
          }
        });
        observerRef.current.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
    }
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [tourState, setTourState]);

  useEffect(() => {
    if (!isMounted || companyStatus === null || !shouldRenderTour) {
      console.log(
        "Tour not started: isMounted, companyStatus, or shouldRenderTour is false"
      ); // Debug
      return;
    }

    const config = selectTourConfig();
    if (!config.tourKey || config.steps.length === 0) {
      setShouldRenderTour(false);
      return;
    }

    if (config.condition && !config.condition()) {
      console.log(`Tour condition not met for ${config.tourKey}`); // Debug
      completeTour(config.tourKey, persist);
      setShouldRenderTour(false);
      return;
    }

    const steps = getTourStepsWithWelcome(config);
    startTour(steps, config.tourKey);
  }, [
    pathname,
    isMounted,
    companyStatus,
    shouldRenderTour,
    setTourState,
    setShouldRenderTour,
    completeTour,
    persist,
  ]);

  useEffect(() => {
    if (!tourState.run || tourState.stepIndex >= tourState.steps.length) {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const step = tourState.steps[tourState.stepIndex];
    const target =
      step.target === "body"
        ? document.body
        : document.querySelector(step.target);

    if (!target) {
      console.warn(`Target not found for step: ${step.target}. Skipping step.`);
      handleNext();
      return;
    }

    const matches =
      step.target === "body"
        ? [document.body]
        : document.querySelectorAll(step.target);
    if (matches.length > 1) {
      console.warn(
        `Multiple elements found for ${step.target}. Using first match.`,
        matches
      );
    }

    if (step.target !== "body" && tourState.stepIndex !== 0) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const scrollTimeout = setTimeout(() => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      updatePosition(step, target);
    }, 100);

    return () => {
      clearTimeout(scrollTimeout);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [tourState.stepIndex, tourState.run, tourState.steps, updatePosition]);

  const handleNext = () => {
    if (tourState.stepIndex < tourState.steps.length - 1) {
      setTourState({ stepIndex: tourState.stepIndex + 1 });
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (tourState.stepIndex > 0) {
      setTourState({ stepIndex: tourState.stepIndex - 1 });
    }
  };

  const handleSkip = () => {
    console.log(`Skipping tour: ${tourState.tourKey}, persist: ${persist}`); // Debug
    completeTour(tourState.tourKey, persist);
  };

  const handleFinish = () => {
    console.log(`Finishing tour: ${tourState.tourKey}, persist: ${persist}`); // Debug
    completeTour(tourState.tourKey, persist);
  };

  const handleDeclineTour = () => {
    console.log(`Declining tour: ${tourState.tourKey}, persist: ${persist}`); // Debug
    completeTour(tourState.tourKey, persist);
  };

  const handleRestart = () => {
    console.log("Restarting tour for pathname:", pathname); // Debug
    restartTour(pathname);
  };

  if (!isMounted || !tourState.run || tourState.steps.length === 0) {
    return null;
  }

  const currentStep = tourState.steps[tourState.stepIndex];
  const targetElement =
    currentStep.target === "body"
      ? document.body
      : document.querySelector(currentStep.target);
  if (!targetElement) {
    console.warn(`Current step target not found: ${currentStep.target}`);
    handleNext();
    return null;
  }

  return (
    <>
      <TourOverlay
        step={currentStep}
        targetElement={
          currentStep.target === "body" ? document.body : targetElement
        }
      />
      <TourCard
        step={currentStep}
        stepIndex={tourState.stepIndex}
        totalSteps={tourState.steps.length}
        isFirstStep={tourState.stepIndex === 0}
        isLastStep={tourState.stepIndex === tourState.steps.length - 1}
        isWelcomeStep={tourState.stepIndex === 0}
        tooltipRef={tooltipRef}
        onBack={handleBack}
        onNext={handleNext}
        onSkip={tourState.stepIndex === 0 ? handleDeclineTour : handleSkip}
        onRestart={handleRestart}
      />
    </>
  );
};

export default CustomTour;




// CUSTOM NAVIGATION

// const { goToStep, restartTour } = useTourStore();
// const pathname = usePathname();

// return (
//   <div>
//     <button
//       onClick={() => goToStep(2)}
//       className="px-4 py-2 bg-blue-500 text-white rounded"
//     >
//       Go to Step 2
//     </button>
//     <button
//       onClick={() => restartTour(pathname)}
//       className="px-4 py-2 bg-green-500 text-white rounded ml-2"
//     >
//       Restart Tour
//     </button>
//   </div>
