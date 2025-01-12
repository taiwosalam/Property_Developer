"use client";

import React, { useEffect, useRef, useState } from "react";

// Types
import type { DefaultSettingsModalProps } from "../types";

// Imports
import PinField from "react-pin-field";
import Button from "@/components/Form/Button/button";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import { useWalletStore } from "@/store/wallet-store";
import { toast } from "sonner";
import { changeWalletPin, createNewWalletPin } from "@/app/(nav)/settings/profile/data";

const SettingsOTPModal: React.FC<DefaultSettingsModalProps> = ({
  changeStep,
  isForgetWallet,
}) => {
  const pinFieldRef = useRef<HTMLInputElement[] | null>(null);
  const [otp, setOtp] = React.useState("");
  const setWalletStore = useWalletStore((s) => s.setWalletStore)
  const walletId = useWalletStore((s) => s.walletId);
  const [loading, setLoading] = useState(false)
  const current_pin = useWalletStore((s) => s.current_pin);
  const new_pin = useWalletStore((s) => s.new_pin);
  const confirm_pin = useWalletStore((s) => s.confirm_pin);

  useEffect(() => {
    if (pinFieldRef.current && pinFieldRef.current.length > 0) {
      pinFieldRef.current[0].focus();
    }
  }, []);

  const handleChangeWalletPin = async()=> {
    const payload = {
      wallet_id: walletId as string,
      current_pin: current_pin,
      new_pin: new_pin,
      new_pin_confirmation: confirm_pin,
      otp: otp
    };
    try{
     setLoading(true) 
      const res = await changeWalletPin(payload);
      if(res){
        toast.success("Wallet pin changed successfully")
        changeStep(3);
      }
    } catch(err){
      toast.error("Failed to change wallet pin")
    } finally{
      setLoading(false)
    }
  }

  const handleIsForgetWallet = async()=> {
    console.log("otp", otp)
    setWalletStore("otp", otp);
    changeStep(4);
  }


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
              onChange={setOtp}
              ref={pinFieldRef}
              validate={/^[0-9]$/}
              className="w-10 h-10 text-center border border-solid border-[#2B2B2B] rounded-lg custom-primary-outline"
            />
          </div>
        </div>
        <Button
          onClick={() => isForgetWallet ? handleIsForgetWallet() : handleChangeWalletPin()}
          size="sm_medium"
          disabled={loading}
          className="py-2 px-8"
        >
          {loading ? "Please wait..." : "Proceed"}
        </Button>
      </div>
    </WalletModalPreset>
  );
};

export default SettingsOTPModal;
