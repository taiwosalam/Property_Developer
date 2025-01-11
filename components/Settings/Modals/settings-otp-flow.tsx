"use client";

import React from "react";

// Imports
import useStep from "@/hooks/useStep";
import SettingsOTPModal from "./settings-otp-modal";
import SettingsUpdateModal from "./settings-update-modal";
import ForgetWalletModal from "./forget-wallet";

const SettingsOTPFlow = ({
  isForgetWallet,
}: {
  isForgetWallet: boolean;
}) => {
  const { activeStep, changeStep } = useStep(3);

  return activeStep === 1 ? (
    isForgetWallet ? (
      <ForgetWalletModal changeStep={changeStep} />
    ) : (
      <SettingsOTPModal changeStep={changeStep} />
    )
  ) : activeStep === 3 ? (
    <SettingsUpdateModal />
  ) : activeStep === 2 ? (
    <SettingsOTPModal changeStep={changeStep} />
  ) : null;
};

export default SettingsOTPFlow;