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
    isGoToStepActive,
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
      if (config.match?.(pathname)) {
        if (!isGoToStepActive && isTourCompleted(config.tourKey)) {
          return { steps: [], tourKey: "" };
        }
        setPersist(true);
        return config;
      }
    }
    return { steps: [], tourKey: "" };
  };

  const startTour = (steps: TourStep[], tourKey: string) => {
    if (!isGoToStepActive && isTourCompleted(tourKey)) {
      setShouldRenderTour(false);
      return;
    }

    if (retryCountRef.current >= maxRetries) {
      setShouldRenderTour(false);
      return;
    }

    const validSteps = steps.filter((step, index) => {
      if (index === 0 && step.target === "body") return true;
      if (tourKey === "PropertiesTour" && step.target === ".add-property-modal")
        return true;
      const element = document.querySelector(step.target);
      if (!element) {
        console.warn(
          `Target ${step.target} not found for ${tourKey}. Skipping step.`
        );
        return false;
      }
      return true;
    });

    if (validSteps.length > 1) {
      const stepIndex = isGoToStepActive ? tourState.stepIndex : 0;
      setTourState({ run: true, stepIndex, steps: validSteps, tourKey });
      retryCountRef.current = 0;
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
    if (!isMounted || !shouldRenderTour) {
      console.warn("Tour not started: isMounted or shouldRenderTour is false");
      return;
    }

    if (pathname === "/setup" || companyStatus !== null) {
      const config = selectTourConfig();
      if (!config.tourKey || config.steps.length === 0) {
        setShouldRenderTour(false);
        return;
      }

      if (config.condition && !config.condition()) {
        console.warn(`Tour condition not met for ${config.tourKey}`);
        completeTour(config.tourKey, persist);
        setShouldRenderTour(false);
        return;
      }

      const steps = getTourStepsWithWelcome(config);
      // If isGoToStepActive, wait briefly to ensure state is updated
      if (isGoToStepActive) {
        setTimeout(() => startTour(steps, config.tourKey), 20);
      } else {
        startTour(steps, config.tourKey);
      }
    } else {
      console.warn(
        "Tour not started: companyStatus is null for non-/setup route"
      );
    }
  }, [
    pathname,
    isMounted,
    companyStatus,
    shouldRenderTour,
    setTourState,
    setShouldRenderTour,
    completeTour,
    persist,
    isGoToStepActive,
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
    completeTour(tourState.tourKey, persist);
  };

  const handleFinish = () => {
    completeTour(tourState.tourKey, persist);
  };

  const handleDeclineTour = () => {
    completeTour(tourState.tourKey, persist);
  };

  const handleRestart = () => {
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
