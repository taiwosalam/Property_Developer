"use client";

import React, { useEffect, useRef } from "react";

// Types
import type { DefaultSettingsModalProps } from "../types";

// Imports
import PinField from "react-pin-field";
import Button from "@/components/Form/Button/button";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";

const SettingsOTPModal: React.FC<DefaultSettingsModalProps> = ({
  changeStep,
}) => {
  const pinFieldRef = useRef<HTMLInputElement[] | null>(null);

  useEffect(() => {
    if (pinFieldRef.current && pinFieldRef.current.length > 0) {
      pinFieldRef.current[0].focus();
    }
  }, []);

  return (
    <WalletModalPreset
      title="Input OTP"
      style={{ width: 390, borderRadius: 20 }}
    >
      <div className="custom-flex-col gap-20">
        <div className="custom-flex-col gap-10">
          <p className="text-text-tertiary text-center text-sm font-medium">
            To authenticate your request, please input the OTP sent to the email
            you used during registration (amo****@gmail.com) to complete your
            request.
          </p>
          <div className="flex gap-6 justify-center">
            <PinField
              length={4}
              ref={pinFieldRef}
              validate={/^[0-9]$/}
              className="w-10 h-10 text-center border border-solid border-[#2B2B2B] rounded-lg custom-primary-outline"
            />
          </div>
        </div>
        <Button
          onClick={() => changeStep("next")}
          size="sm_medium"
          className="py-2 px-8"
        >
          update
        </Button>
      </div>
    </WalletModalPreset>
  );
};

export default SettingsOTPModal;
