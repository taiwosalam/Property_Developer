"use client";

import { useState, useEffect } from "react";
import WalletModalPreset from "./wallet-modal-preset";
import type { ActivateWalletOptions } from "./types";
import { useAuthStore } from "@/store/authStore";
import { AuthPinField } from "../Auth/auth-components";
import Button from "../Form/Button/button";
import obfuscateEmail from "@/utils/obfuscateEmail";
import { getOtpToActivateWallet, setWalletPin } from "./data";
import { toast } from "sonner";
import { useModal } from "../Modal/modal";
import { useWalletStore } from "@/store/wallet-store";
import { ReloadIcon } from "@/public/icons/icons";

const ActivateWalletModal = () => {
  const { setIsOpen } = useModal();
  const [requestLoading, setRequestLoading] = useState(false);
  const [resendReqLoading, setResendReqLoading] = useState(false);
  const email = useAuthStore((state) => state.email);
  const walletId = useWalletStore((state) => state.walletId);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [activeStep, setActiveStep] =
    useState<ActivateWalletOptions>("setup-pin");

  const handleResendOtp = async () => {
    if (canResend) {
      setResendReqLoading(true);
      const status = await getOtpToActivateWallet();
      if (status) {
        setCountdown(60);
        setCanResend(false);
      }
      setResendReqLoading(false);
    }
  };

  const flow: Record<
    ActivateWalletOptions,
    {
      heading: string;
      content: React.ReactNode;
    }
  > = {
    "setup-pin": {
      heading: "Set Up Wallet PIN",
      content: (
        <>
          <p>
            This PIN will be used to authorize wallet transactions. It&apos;s
            essential to choose something you can easily remember, while
            ensuring it&apos;s a 4-digit number that others can&apos;t easily
            guess for security reasons.
          </p>
          <AuthPinField onChange={setPin} key="setup-pin" />
        </>
      ),
    },
    "confirm-pin": {
      heading: "Re-enter Wallet PIN",
      content: (
        <>
          <p>Please re-enter your PIN to confirm.</p>
          <AuthPinField onChange={setConfirmPin} key="confirm-pin" />
        </>
      ),
    },
    "enter-otp": {
      heading: "Enter OTP",
      content: (
        <>
          <p>
            To authenticate your request, please input the OTP sent to the email
            you used during registration ({obfuscateEmail(email || "")}) to
            complete your request.
          </p>
          <AuthPinField onChange={setOtp} key="enter-otp" />
          {!canResend ? (
            <p className="text-black">
              {`${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(
                countdown % 60
                
              ).padStart(2, "0")}`}
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              className="mx-auto flex gap-1 text-brand-9 text-base font-medium"
              disabled={resendReqLoading}
            >
              <ReloadIcon />
              Resend code
            </button>
          )}
        </>
      ),
    },
  };

  const handleNext = async () => {
    if (!walletId) return;
    if (activeStep === "setup-pin") {
      if (pin.length !== 4) {
        toast.warning("Please enter a valid 4-digit PIN.");
        return;
      }
      setActiveStep("confirm-pin");
    } else if (activeStep === "confirm-pin") {
      if (pin !== confirmPin) {
        toast.warning("PINs do not match. Please try again.");
        return;
      }
      setRequestLoading(true);
      const status = await getOtpToActivateWallet();
      if (status) {
        setActiveStep("enter-otp");
        setCountdown(60);
        setCanResend(false);
      }
      setRequestLoading(false);
    } else if (activeStep === "enter-otp") {
      if (otp.length !== 4) {
        toast.warning("Please enter a valid 4-digit OTP.");
        return;
      }
      setRequestLoading(true);
      const status = await setWalletPin(pin, confirmPin, otp, walletId);
      if (status) {
        setIsOpen(false);
      }
      setRequestLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <WalletModalPreset
      style={{ width: "80%", maxWidth: "390px" }}
      title={flow[activeStep].heading}
      back={
        activeStep !== "setup-pin"
          ? () => {
              setActiveStep("setup-pin");
            }
          : undefined
      }
    >
      <div className="space-y-7 text-text-secondary dark:text-white text-sm font-medium text-center">
        {flow[activeStep].content}
      </div>
      <Button
        onClick={handleNext}
        size="sm_medium"
        className="mt-[90px] w-full py-2 px-8"
        disabled={requestLoading}
      >
        {requestLoading
          ? "Please wait..."
          : activeStep === "enter-otp"
          ? "Update"
          : "Next"}
      </Button>
    </WalletModalPreset>
  );
};

export default ActivateWalletModal;
