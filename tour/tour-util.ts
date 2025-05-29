import { getLocalStorage, saveLocalStorage } from "@/utils/local-storage";
import { TourStep } from "./types";

// Position tooltip based on target and placement
export const positionTooltip = (
  target: Element,
  tooltipRef: React.RefObject<HTMLDivElement>,
  placement: TourStep["placement"]
) => {
  if (!tooltipRef.current) return;
  const targetRect = target.getBoundingClientRect();
  const tooltipRect = tooltipRef.current.getBoundingClientRect();
  const padding = 20;

  let top = 0;
  let left = 0;

  switch (placement) {
    case "top":
      top = targetRect.top - tooltipRect.height - padding;
      left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
      break;
    case "bottom":
      top = targetRect.bottom + padding;
      left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
      break;
    case "left":
      top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
      left = targetRect.left - tooltipRect.width - padding;
      break;
    case "right":
      top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
      left = targetRect.right + padding;
      break;
    case "center":
      top = window.innerHeight / 2 - tooltipRect.height / 2;
      left = window.innerWidth / 2 - tooltipRect.width / 2;
      break;
  }

  top = Math.max(
    10,
    Math.min(top, window.innerHeight - tooltipRect.height - 10)
  );
  left = Math.max(
    10,
    Math.min(left, window.innerWidth - tooltipRect.width - 10)
  );

  tooltipRef.current.style.top = `${top}px`;
  tooltipRef.current.style.left = `${left}px`;
};

// Check if targets exist in the DOM
export const checkTargets = (tourSteps: TourStep[]): TourStep[] => {
  return tourSteps.filter((step) => {
    const element = document.querySelector(step.target);
    if (!element) {
      console.log(`CustomTour: Target ${step.target} not found`);
    }
    return !!element;
  });
};

// Get tour completion status
export const getTourCompletionStatus = (tourKey: string): boolean => {
  return getLocalStorage(`hasCompleted${tourKey}`) === "true";
};

// Save tour completion
export const saveTourCompletion = (tourKey: string): void => {
  saveLocalStorage(`hasCompleted${tourKey}`, "true");
};

// Debug missing targets
export const debugMissingTargets = (steps: TourStep[], tourKey: string) => {
  steps.forEach((step) => {
    if (!document.querySelector(step.target)) {
      console.warn(`CustomTour: Missing target ${step.target} for ${tourKey}`);
    }
  });
};
