"use client";

import React, { useState } from "react";

// Types
import type { FormSteps } from "../types";

// Imports
import FlowProgress from "@/components/FlowProgress/flow-progress";
import ForgotPassword from "@/components/Auth/Flow/forgot-password";
import CreateNewPassword from "@/components/Auth/Flow/create-new-password";
import VerifyEmailAddress from "@/components/Auth/Flow/verify-email-address";

const ForgotPasswordFlow = () => {
  // Define the index of the last step in the flow
  const last_step = 2;

  // State to track the current step in the flow
  const [activeStep, setActiveStep] = useState(0);

  // Function to handle changing steps
  const handleStepChange = (step: FormSteps) => {
    setActiveStep((num) => {
      // If the step is "next", increment the step number but clamp to last_step
      if (step === "next") {
        return Math.min(num + 1, last_step); // Ensure step does not exceed last_step
      } else {
        // If the step is not "next", decrement the step number but clamp to 0
        return Math.max(num - 1, 0); // Ensure step does not go below 0
      }
    });
  };

  return (
    <FlowProgress
      steps={last_step + 1}
      activeStep={activeStep}
      className="custom-flex-col gap-4"
    >
      {activeStep === 0 ? (
        <ForgotPassword changeStep={handleStepChange} />
      ) : activeStep === 1 ? (
        <VerifyEmailAddress changeStep={handleStepChange} />
      ) : activeStep === 2 ? (
        <CreateNewPassword />
      ) : null}
    </FlowProgress>
  );
};

export default ForgotPasswordFlow;
