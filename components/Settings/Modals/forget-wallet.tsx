"use client";

import React, { useEffect, useRef } from "react";

// Types
import type { DefaultSettingsModalProps } from "../types";

// Imports
import PinField from "react-pin-field";
import Button from "@/components/Form/Button/button";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import Input from "@/components/Form/Input/input";
import { AuthForm } from "@/components/Auth/auth-components";

const ForgetWalletModal: React.FC<DefaultSettingsModalProps> = ({
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
      title="Forget Wallet PIN"
      style={{ width: 390, borderRadius: 20 }}
    >
    <AuthForm onFormSubmit={()=>{}} autoComplete="off">
      <div className="custom-flex-col gap-20">
        <div className="custom-flex-col gap-10">
          <p className="text-text-tertiary text-center text-sm font-medium">
          Please enter your password to proceed with resetting your wallet PIN securely. This ensures your account remains protected and only authorized changes are made.
          </p>
          <div className="flex gap-6 justify-center">
           <Input
            id="passord"
            label="Enter Password"
            type="password"
            inputClassName="w-full"
            className="w-full"
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
      </AuthForm>
    </WalletModalPreset>
  );
};

export default ForgetWalletModal;
