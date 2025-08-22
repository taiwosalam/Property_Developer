"use client";

import React from "react";

// Import
import useStep from "@/hooks/useStep";
import SettingsOTPFlow from "./settings-otp-flow";
import SettingsRemoveModal from "./settings-remove-modal";

const SettingsRemoveFlow = () => {
  const { activeStep, changeStep } = useStep(3);

  return activeStep === 1 ? (
    <SettingsRemoveModal changeStep={changeStep} />
  ) : activeStep === 2 ? (
    <SettingsOTPFlow />
  ) : null;
};

export default SettingsRemoveFlow;
