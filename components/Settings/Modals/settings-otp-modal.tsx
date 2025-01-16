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
import { changePassword, getPasswordResetOTP, verifyPasswordOTP } from "@/app/(nav)/settings/security/data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { useAuthStore } from "@/store/authStore";
import obfuscateEmail from "@/utils/obfuscateEmail";
import { ReloadIcon } from "@/public/icons/icons";
import { usePersonalInfoStore } from "@/store/personal-info-store";

const SettingsOTPModal: React.FC<DefaultSettingsModalProps> = ({
  changeStep,
  isForgetWallet,
  saveOtp,
  resetPass,
}) => {
  const pinFieldRef = useRef<HTMLInputElement[] | null>(null);
  const setWalletStore = useWalletStore((s) => s.setWalletStore)
  const userId = usePersonalInfoStore((state) => state.user_id);
  const email = useAuthStore((state) => state.email);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [otp, setOtp] = React.useState("");
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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChangeWalletPin = async () => {
    const payload = {
      wallet_id: walletId as string,
      current_pin: current_pin,
      new_pin: new_pin,
      new_pin_confirmation: confirm_pin,
      otp: otp
    };
    try {
      setLoading(true)
      const res = await changeWalletPin(payload);
      if (res) {
        toast.success("Wallet pin changed successfully")
        changeStep(3);
      }
    } catch (err) {
      toast.error("Failed to change wallet pin")
    } finally {
      setLoading(false)
    }
  }

  const handleIsForgetWallet = async () => {
    setWalletStore("otp", otp);
    changeStep(4);
  }

  // const handleGetPassWordOTP = async () => {
  //   if (canResend) {
  //     setCountdown(60);
  //     setCanResend(false);
  //     try{
  //       setLoading(true)
  //       const res = await getPasswordResetOTP()
  //       if (res) {
  //         toast.success("Check Email For OTP")
  //       }
  //     } catch(err) {
  //       toast.error("Failed to send OTP")
  //     } finally {
  //       setLoading(false)
  //     }
  //   } 
  // }

  const verifyOTP =  async()=> {
    try{
      setLoading(true)
      const res = await verifyPasswordOTP(otp, userId as string)
      if (res) {
        changeStep(4)
      }
    }catch(err){
      toast.error("Failed to verify OTP")
    }finally{
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    const payload = {
      current_password: current_pin,
      password: new_pin,
      password_confirmation: confirm_pin,
      otp: otp,
    }
    try {
      setLoading(true)
      if (otp !== null) {
        console.log("otp", otp)
        const res = await changePassword(objectToFormData(payload))
        if (res) {
          toast.success("Password changed successfully")
          changeStep(3)
        }
      }
    } catch (err) {
      toast.error("Failed to change password")
    } finally {
      setLoading(false)
    }
  };

  const handleButtonClick = () => {
    if (saveOtp) {
      handleChangePassword();
      changeStep(2);
      return
    }

    if (resetPass) {
      return verifyOTP()
    }

    if (isForgetWallet) return handleIsForgetWallet()

    return handleChangeWalletPin()
  }

  const handleGetPassWordOTP = async () => {
    if (canResend) {
      setCountdown(60);
      setCanResend(false);
    }
    try {
      setLoading(true)
      const res = await getPasswordResetOTP();
      if(res){
        toast.success("Check Email For OTP")
        setCountdown(60);
        setCanResend(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <WalletModalPreset
      title="Input OTP"
      style={{ width: 390, borderRadius: 20 }}
    >
      <div className="custom-flex-col gap-20">
        <div className="custom-flex-col gap-">
          <p className="text-text-tertiary text-center text-sm font-medium">
            To authenticate your request, please input the OTP sent to the email
            you used during registration ({obfuscateEmail(email as string)}) to complete your
            request.
          </p>
          {!canResend ? (
            <p className="w-full my-4 flex justify-center items-center text-text-tertiary text-sm font-medium">
              {`${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(
                countdown % 60
              ).padStart(2, "0")}`}
            </p>
          ) : (
            <p className="w-full my-4 flex justify-center items-center text-text-tertiary text-sm font-medium">
              00:00
            </p>
          )}
          <div className="flex gap-6 justify-center">
            <PinField
              length={4}
              onChange={setOtp}
              ref={pinFieldRef}
              validate={/^[0-9]$/}
              className="w-10 h-10 text-center border border-solid border-[#2B2B2B] rounded-lg custom-primary-outline"
            />
          </div>
          <button
            type="button"
            onClick={handleGetPassWordOTP}
            className="flex gap-1 mt-4 custom-secondary-color text-base font-medium"
            disabled={!canResend}
          >
            <span className="custom-primary-color">
              <ReloadIcon />
            </span>
            <p className="custom-primary-color">Resend code</p>
          </button>
        </div>
        <Button
          onClick={handleButtonClick}
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
