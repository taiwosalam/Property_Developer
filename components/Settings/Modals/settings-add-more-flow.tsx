"use client";

import React from "react";

// Imports
import useStep from "@/hooks/useStep";
import SettingsOTPFlow from "./settings-otp-flow";
import SettingsAddMoreModal from "./settings-add-more-modal";

const SettingsAddMoreFlow = () => {
  const { activeStep, changeStep } = useStep(3);

  return activeStep === 1 ? (
    <SettingsAddMoreModal changeStep={changeStep} />
  ) : activeStep === 2 ? (
    <SettingsOTPFlow />
  ) : null;
};

export default SettingsAddMoreFlow;
