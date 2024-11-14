"use client";

import { useState } from "react";

// Types
import type { FormSteps } from "../types";

// Imports
import FlowProgress from "@/components/FlowProgress/flow-progress";
import SignUp from "@/components/Auth/Flow/create-your-account";
import VerifyEmailAddress from "@/components/Auth/Flow/verify-email-address";
import { useSearchParams } from "next/navigation";

const SignUpFlow = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  // Define the index of the last step in the flow
  const last_step = 1;

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
      className="custom-flex-col"
      style={{ position: "sticky", top: 0, padding: "24px 0" }}
    >
      {activeStep === 0 ? (
        <SignUp changeStep={handleStepChange} />
      ) : activeStep === 1 ? (
        <VerifyEmailAddress type="sign up" changeStep={handleStepChange} />
      ) : null}
    </FlowProgress>
  );
};

export default SignUpFlow;
