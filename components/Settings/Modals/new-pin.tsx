"use client";

import React, { useEffect, useRef, useState } from "react";

// Types
import type { DefaultSettingsModalProps } from "../types";

// Imports
import PinField from "react-pin-field";
import Button from "@/components/Form/Button/button";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import Input from "@/components/Form/Input/input";
import { AuthForm } from "@/components/Auth/auth-components";
import useFetch from "@/hooks/useFetch";
import { WalletDataResponse } from "@/app/(nav)/wallet/data";
import { useWalletStore } from "@/store/wallet-store";
import { createNewWalletPin } from "@/app/(nav)/settings/profile/data";
import { toast } from "sonner";

const NewPinModal: React.FC<DefaultSettingsModalProps> = ({
  changeStep,
}) => {
  const pinFieldRef = useRef<HTMLInputElement[] | null>(null);
  const walletId = useWalletStore((s) => s.walletId);
  const [loading, setLoading] = useState(false)
  const current_pin = useWalletStore((s) => s.current_pin);
  const new_pin = useWalletStore((s) => s.new_pin);
  const confirm_pin = useWalletStore((s) => s.confirm_pin);
  const otp = useWalletStore((s) => s.otp);

  
  useEffect(() => {
    if (pinFieldRef.current && pinFieldRef.current.length > 0) {
      pinFieldRef.current[0].focus();
    }
  }, []);

  const handleIsForgetWallet = async(data: Record<string, string>)=> {
    const payload = {
      wallet_id: walletId as string,
      otp: otp,
      new_pin: data.new_pin,
      new_pin_confirmation: data.confirm_pin,
    };
    
    try{
      setLoading(true) 
      const res = await createNewWalletPin(payload);
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

  return (
    <WalletModalPreset
      title="New Wallet PIN"
      style={{ width: 390, borderRadius: 20 }}
    >
    <AuthForm onFormSubmit={handleIsForgetWallet} autoComplete="off">
      <div className="custom-flex-col gap-20">
        <div className="custom-flex-col gap-4">
          <p className="text-text-tertiary text-center text-sm font-medium">
          Please enter your password to proceed with resetting your wallet PIN securely. This ensures your account remains protected and only authorized changes are made.
          </p>
          <div className="flex">
           <Input
            id="new_pin"
            label="Enter New Wallet PIN"
            type="password"
            inputClassName="w-full"
            className="w-full"
            maxLength={4}
            isPinField
           />
          </div>
        <div>
           <Input
            id="confirm_pin"
            label="Confirm New Wallet PIN"
            type="password"
            inputClassName="w-full"
            className="w-full"
            maxLength={4}
            isPinField
           />
        </div>
        </div>
        <Button
          type="submit"
          size="sm_medium"
          className="py-2 px-8"
        >
          { loading ? "Please wait..." : "Proceed"}
        </Button>
      </div>
      </AuthForm>
    </WalletModalPreset>
  );
};

export default NewPinModal;
