"use client";

import React from "react";

// Imports
import useStep from "@/hooks/useStep";
import SettingsOTPModal from "./settings-otp-modal";
import SettingsUpdateModal from "./settings-update-modal";

const SettingsOTPFlow = () => {
  const { activeStep, changeStep } = useStep(2);

  return activeStep === 1 ? (
    <SettingsOTPModal changeStep={changeStep} />
  ) : activeStep === 2 ? (
    <SettingsUpdateModal />
  ) : null;
};

export default SettingsOTPFlow;
