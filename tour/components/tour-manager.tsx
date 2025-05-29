"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { useWalletStore } from "@/store/wallet-store";
import { useChatStore } from "@/store/message";
import { navSteps } from "../steps/nav-steps";
import { dashboardSteps } from "../steps/dashboard-steps";
import { getTourStepsWithWelcome, pageSteps } from "../steps/page-steps";
import { TourState, TourStep } from "../types";
import TourOverlay from "./tour-overlay";
import TourCard from "./tour-card";
import {
  checkTargets,
  debugMissingTargets,
  getTourCompletionStatus,
  positionTooltip,
  saveTourCompletion,
} from "../tour-util";
import { useGlobalStore } from "@/store/general-store";
import { useTourStore } from "@/store/tour-store";
import { propertiesSteps } from "../steps/properties-step";

const CustomTour: React.FC = () => {
  const pathname = usePathname();
  const companyStatus = usePersonalInfoStore((state) => state.company_status);
  const {
    tour: tourState,
    shouldRenderTour,
    setTourState,
    setShouldRenderTour,
    setPersist, // Add setPersist
    completeTour,
    isTourCompleted,
  } = useTourStore();
  const [isMounted, setIsMounted] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 20;
  const retryInterval = 2000;
  const initialDelay = 8000;
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    setIsMounted(true);
    console.log("CustomTour: Component mounted");
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    console.log("CustomTour Debug:", {
      pathname,
      companyStatus,
      shouldRenderTour,
      tourState,
    });
  }, [isMounted, pathname, companyStatus, shouldRenderTour, tourState]);

  const selectTourConfig = () => {
    // Check NavTour first on dashboard
    if (pathname === "/dashboard" && !isTourCompleted("NavTour")) {
      const navConfig = pageSteps["/"];
      if (navConfig) {
        setPersist(false); // Set persist to false for NavTour
        return navConfig;
      }
    }

    // Check current pathname
    const config = pageSteps[pathname];
    if (!config) {
      console.log(`CustomTour: No tour config for ${pathname}`);
      return { steps: [], tourKey: "" };
    }

    if (isTourCompleted(config.tourKey)) {
      return { steps: [], tourKey: "" };
    }

    // Set persist based on tourKey
    if (config.tourKey === "DashboardTour") {
      setPersist(false); // Set persist to false for DashboardTour
    } else {
      setPersist(true); // Default to persisting for other tours (e.g., PropertiesTour)
    }

    return config;
  };

  const startTour = (steps: TourStep[], tourKey: string) => {
    if (retryCountRef.current >= maxRetries) {
      console.error(
        `CustomTour: Max retries reached for ${tourKey}, aborting tour`
      );
      return;
    }

    const allTargetsPresent = steps.every((step, index) => {
      if (index === 0 && step.target === "body") return true;
      if (
        tourKey === "PropertiesTour" &&
        step.target === ".add-property-modal"
      ) {
        return true; // Defer modal check
      }
      const exists = !!document.querySelector(step.target);
      if (!exists) {
        console.log(`CustomTour: Target ${step.target} missing for ${tourKey}`);
      }
      return exists;
    });

    if (allTargetsPresent) {
      console.log(`CustomTour: Starting ${tourKey} with steps`, steps);
      setTourState({ run: true, stepIndex: 0, steps, tourKey });
      retryCountRef.current = 0;
    } else {
      debugMissingTargets(steps, tourKey);
      console.log(
        `CustomTour: Retry ${retryCountRef.current + 1}/${maxRetries}`
      );
      retryCountRef.current += 1;
      const delay = retryCountRef.current === 1 ? initialDelay : retryInterval;
      setTimeout(() => startTour(steps, tourKey), delay);
    }
  };

  useEffect(() => {
    if (
      tourState.tourKey === "PropertiesTour" &&
      tourState.run &&
      tourState.stepIndex === 8
    ) {
      const modal = document.querySelector(".add-property-modal");
      if (modal) {
        console.log("CustomTour: Modal detected, proceeding to next step");
        setTourState({ stepIndex: tourState.stepIndex + 1 });
      } else {
        console.log("CustomTour: Waiting for modal to open");
        observerRef.current = new MutationObserver(() => {
          if (document.querySelector(".add-property-modal")) {
            console.log("CustomTour: Modal opened, proceeding");
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
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [tourState, setTourState]);

  useEffect(() => {
    if (!isMounted || companyStatus === null || !shouldRenderTour) {
      console.log("CustomTour: Not starting tour", {
        isMounted,
        companyStatus,
        shouldRenderTour,
      });
      return;
    }

    const config = selectTourConfig();
    if (!config.tourKey || config.steps.length === 0) {
      setShouldRenderTour(false);
      return;
    }

    // Check condition
    if (config.condition && !config.condition()) {
      console.log(`CustomTour: Condition not met for ${config.tourKey}`);
      // Pass persist flag based on tourKey
      const persist = config.tourKey === "NavTour" || config.tourKey === "DashboardTour" ? false : true;
      completeTour(config.tourKey, persist);
      setShouldRenderTour(false);
      return;
    }

    const steps = getTourStepsWithWelcome(config);
    const validSteps = checkTargets(steps);
    if (validSteps.length > 0) {
      startTour(validSteps, config.tourKey);
    } else {
      console.log(`CustomTour: No valid steps for ${config.tourKey}`);
      setShouldRenderTour(false);
    }
  }, [
    pathname,
    isMounted,
    companyStatus,
    shouldRenderTour,
    setTourState,
    setShouldRenderTour,
    completeTour,
  ]);

  useEffect(() => {
    if (!tourState.run || tourState.stepIndex >= tourState.steps.length) {
      console.log(
        "CustomTour: Not rendering - tour not running or steps exhausted"
      );
      return;
    }
    const step = tourState.steps[tourState.stepIndex];
    const target =
      step.target === "body"
        ? document.body
        : document.querySelector(step.target);
    if (target) {
      console.log(`CustomTour: Positioning tooltip for ${step.target}`);
      positionTooltip(target, tooltipRef, step.placement);
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      console.log(`CustomTour: Target ${step.target} not found, skipping`);
      handleNext();
    }
  }, [tourState.stepIndex, tourState.run, tourState.steps]);

  const handleNext = () => {
    if (tourState.stepIndex === 0) {
      console.log("CustomTour: Welcome step - proceeding to next");
      setTourState({ stepIndex: tourState.stepIndex + 1 });
    } else if (tourState.stepIndex < tourState.steps.length - 1) {
      setTourState({ stepIndex: tourState.stepIndex + 1 });
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (tourState.stepIndex > 0) {
      console.log("CustomTour: Going back");
      setTourState({ stepIndex: tourState.stepIndex - 1 });
    }
  };

  const handleSkip = () => {
    console.log(`CustomTour: Skipped ${tourState.tourKey}`);
    // Pass persist flag based on tourKey
    const persist = tourState.tourKey === "NavTour" || tourState.tourKey === "DashboardTour" ? false : true;
    completeTour(tourState.tourKey, persist);
  };

  const handleFinish = () => {
    console.log(`CustomTour: Completed ${tourState.tourKey}`);
    // Pass persist flag based on tourKey
    const persist = tourState.tourKey === "NavTour" || tourState.tourKey === "DashboardTour" ? false : true;
    completeTour(tourState.tourKey, persist);
    // Chain NavTour to DashboardTour
    if (
      tourState.tourKey === "NavTour" &&
      pathname === "/dashboard" &&
      !isTourCompleted("DashboardTour")
    ) {
      const config = pageSteps["/dashboard"];
      if (config) {
        const steps = getTourStepsWithWelcome(config);
        const validSteps = checkTargets(steps);
        if (validSteps.length > 0) {
          console.log("CustomTour: Starting DashboardTour after NavTour");
          startTour(validSteps, "DashboardTour");
        }
      }
    }
  };

  const handleDeclineTour = () => {
    console.log(`CustomTour: Declined ${tourState.tourKey}`);
    // Pass persist flag based on tourKey
    const persist = tourState.tourKey === "NavTour" || tourState.tourKey === "DashboardTour" ? false : true;
    completeTour(tourState.tourKey, persist);
  };

  if (!isMounted || !tourState.run || tourState.steps.length === 0) {
    console.log("CustomTour: Not rendering - conditions not met", {
      isMounted,
      tourRun: tourState.run,
      stepsLength: tourState.steps.length,
    });
    return null;
  }

  const currentStep = tourState.steps[tourState.stepIndex];
  const targetElement =
    currentStep.target === "body"
      ? document.body
      : document.querySelector(currentStep.target);
  if (!targetElement) {
    console.log(
      `CustomTour: Target ${currentStep.target} not found, skipping step`
    );
    handleNext();
    return null;
  }

  console.log("CustomTour: Rendering TourCard for step", currentStep);

  const targetRect = targetElement.getBoundingClientRect();
  const isFirstStep = tourState.stepIndex === 0;
  const isLastStep = tourState.stepIndex === tourState.steps.length - 1;

  return (
    <>
      <TourOverlay
        step={currentStep}
        isFirstStep={isFirstStep}
        targetRect={targetRect}
      />
      <TourCard
        step={currentStep}
        stepIndex={tourState.stepIndex}
        totalSteps={tourState.steps.length}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        tooltipRef={tooltipRef}
        onBack={handleBack}
        onNext={handleNext}
        onSkip={isFirstStep ? handleDeclineTour : handleSkip}
        isWelcomeStep={isFirstStep}
      />
    </>
  );
};

export default CustomTour;