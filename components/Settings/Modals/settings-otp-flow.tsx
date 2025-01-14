"use client";

import React, { useEffect } from "react";

// Imports
import useStep from "@/hooks/useStep";
import SettingsOTPModal from "./settings-otp-modal";
import SettingsUpdateModal from "./settings-update-modal";
import ForgetWalletModal from "./forget-wallet";
import NewPinModal from "./new-pin";
import useFetch from "@/hooks/useFetch";
import { WalletDataResponse } from "@/app/(nav)/wallet/data";
import { useWalletStore } from "@/store/wallet-store";

const SettingsOTPFlow = ({
  isForgetWallet,
  saveOtp,
  resetPass
}: {
  isForgetWallet?: boolean;
  saveOtp?: boolean;
  resetPass?: boolean;
}) => {
  const setWalletStore = useWalletStore((s) => s.setWalletStore)
  const { data, error, refetch } =
    useFetch<WalletDataResponse>("/wallets/dashboard");

  useEffect(() => {
    const wallet_id = data?.balance.wallet_id;
    setWalletStore("walletId", wallet_id as string);
  }, [data, setWalletStore]);


  const { activeStep, changeStep } = useStep(4);
  console.log("active step", activeStep);

  return activeStep === 1 ? (
    isForgetWallet ? (
      <ForgetWalletModal
        changeStep={changeStep}
      />
    ) : (
      <SettingsOTPModal
        changeStep={changeStep}
        saveOtp={saveOtp}
        resetPass={resetPass}
      />
    )
  ) : activeStep === 3 ? (
    <SettingsUpdateModal />
  ) : activeStep === 4 ? (
    <NewPinModal
      resetPass={resetPass}
      changeStep={changeStep}
    />
  ) : activeStep === 2 ? (
    <SettingsOTPModal
      changeStep={changeStep}
      isForgetWallet={isForgetWallet}
      saveOtp={saveOtp}
      resetPass={resetPass}
    />
  ) : null;
};

export default SettingsOTPFlow;