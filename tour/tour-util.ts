import { getLocalStorage, saveLocalStorage } from "@/utils/local-storage";
import { TourStep } from "./types";

export const positionTooltip = (
  target: Element,
  tooltipRef: React.RefObject<HTMLDivElement>,
  placement: TourStep["placement"]
) => {
  if (!tooltipRef.current) {
    console.warn("Tooltip ref is not available");
    return;
  }

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

export const checkTargets = (tourSteps: TourStep[]): TourStep[] => {
  return tourSteps.filter((step) => {
    const elements = document.querySelectorAll(step.target);
    if (elements.length === 0) {
      console.log(`CustomTour: Target ${step.target} not found`);
      return false;
    }
    if (elements.length > 1 && step.target !== "body") {
      console.warn(`Multiple elements found for ${step.target}`, elements);
    }
    return true;
  });
};

// export const getTourCompletionStatus = (tourKey: string): boolean => {
//   return getLocalStorage(`hasCompleted${tourKey}`) === "true";
// };

// export const saveTourCompletion = (tourKey: string): void => {
//   saveLocalStorage(`hasCompleted${tourKey}`, "true");
// };

export const getTourCompletionStatus = (tourKey: string): boolean => {
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
};

export const saveTourCompletion = (tourKey: string): void => {
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
};

export const debugMissingTargets = (steps: TourStep[], tourKey: string) => {
  steps.forEach((step) => {
    const elements = document.querySelectorAll(step.target);
    if (elements.length === 0) {
      console.warn(`CustomTour: Missing target ${step.target} for ${tourKey}`);
    }
  });
};
