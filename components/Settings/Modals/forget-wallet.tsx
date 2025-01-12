
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
import { useWalletStore } from "@/store/wallet-store";
import { WalletDataResponse } from "@/app/(nav)/wallet/data";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";
import { ForgetWalletPinPassword } from "@/app/(nav)/settings/profile/data";

const ForgetWalletModal: React.FC<DefaultSettingsModalProps> = ({
  changeStep,
}) => {
  const pinFieldRef = useRef<HTMLInputElement[] | null>(null);
  const [loading, setLoading] = useState(false)
  const walletId = useWalletStore((s) => s.walletId);

  console.log("walletId", walletId)

  useEffect(() => {
    if (pinFieldRef.current && pinFieldRef.current.length > 0) {
      pinFieldRef.current[0].focus();
    }
  }, []);

  const hanldeForgetPassword = async(data: Record<string, string>)=>{
    try{
      setLoading(true)
      const payload = {
        wallet_id: walletId as string,
        password: data.password
      }
      console.log("payload", payload)
      const res = await ForgetWalletPinPassword(payload);
      if(res){
        toast.success("Check Email For OTP")
        changeStep("next");
      }
    } catch (err){
        toast.error("Failed to forget wallet password")
    } finally{
      setLoading(false)
    }
  }

  return (
    <WalletModalPreset
      title="Forget Wallet PIN"
      style={{ width: 390, borderRadius: 20 }}
    >
    <AuthForm onFormSubmit={hanldeForgetPassword} autoComplete="off">
      <div className="custom-flex-col gap-20">
        <div className="custom-flex-col gap-10">
          <p className="text-text-tertiary text-center text-sm font-medium">
          Please enter your password to proceed with resetting your wallet PIN securely. This ensures your account remains protected and only authorized changes are made.
          </p>
          <div className="flex gap-6 justify-center">
           <Input
            id="password"
            label="Enter Password"
            type="password"
            inputClassName="w-full"
            className="w-full"
           />
          </div>
        </div>
        <Button
          size="sm_medium"
          type="submit"
          className="py-2 px-8"
        >
          {loading ? "Please wait..." : "Proceed"}
        </Button>
      </div>
      </AuthForm>
    </WalletModalPreset>
  );
};

export default ForgetWalletModal;