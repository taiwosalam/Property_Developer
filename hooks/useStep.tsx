"use client";

import { useState } from "react";

// Types
import type { FormSteps } from "@/app/(onboarding)/auth/types";

/**
 * Custom hook for managing step-based flows.
 *
 * @param {number} lastStep - The highest possible step number. Must be 2 or higher.
 * @returns {object} An object containing the current active step and a function to change steps.
 * @property {number} activeStep - The current step in the flow, starting from 1.
 *                               The first step is always 1, and it cannot exceed `lastStep`.
 * @property {function} changeStep - Function to change the current step.
 *                                         Pass "next" to move forward and "prev" to move back.
 */
const useStep = (lastStep: number) => {
  // Ensure lastStep is at least 2 or more
  if (lastStep < 2) {
    throw new Error("lastStep must be 2 or higher.");
  }

  // State to track the current step in the flow, starting from 1
  const [activeStep, setActiveStep] = useState(1);

  /**
   * Handle changing the step based on input.
   * - If "next", the step increments but is clamped to the `lastStep`.
   * - Otherwise, it decrements but is clamped to 1.
   *
   * @param {FormSteps} step - Either "next" to go forward or "prev" to go backward.
   */
  const changeStep = (step: FormSteps) => {
    setActiveStep((num) => {
      if (step === "next") {
        // Increment step but don't exceed lastStep
        return Math.min(num + 1, lastStep);
      } else {
        // Decrement step but don't go below 1
        return Math.max(num - 1, 1);
      }
    });
  };

  return { activeStep, changeStep };
};

export default useStep;
