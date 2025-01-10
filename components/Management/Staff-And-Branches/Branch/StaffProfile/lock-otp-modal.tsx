"use client";
import { useState, useEffect } from "react";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import { AuthPinField } from "@/components/Auth/auth-components";
import Button from "@/components/Form/Button/button";
import useStep from "@/hooks/useStep";
import ModalPreset from "@/components/Modal/modal-preset";
import { ModalTrigger } from "@/components/Modal/modal";
import { ReloadIcon } from "@/public/icons/icons";
import { useAuthStore } from "@/store/authStore";
import { useObfuscatedEmail } from "@/hooks/useObfuscateEmail";
import { sendVerifyStaffOTP } from "@/app/(nav)/management/staff-branch/[branchId]/branch-staff/[staffId]/data";

interface LockOTPModalProps {
  action: () => Promise<void>;
  otp: string;
  setOtp: (otp: string) => void;
}

const LockOTPModal: React.FC<LockOTPModalProps> = ({ action, otp, setOtp }) => {
  const [countdown, setCountdown] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const { activeStep, changeStep } = useStep(2);
  const email = useAuthStore((state) => state.email);
  const obfuscatedEmail = useObfuscatedEmail(email || "");

  const handleResendCode = async () => {
    if (canResend) {
      setCountdown(120);
      setCanResend(false);
    }
    try {
      const status = await sendVerifyStaffOTP();
      if (status) {
        setCountdown(120);
        setCanResend(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAction = async () => {
    const res = await action();
    console.log("res", res)
    // changeStep("next");
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


  const handlePinChange = (pin: string) => {
    setOtp(pin);
  };

  return activeStep === 1 ? (
    <WalletModalPreset title="Enter OTP" style={{ maxWidth: "390px" }}>
      <div className="space-y-[28px]">
        <div className="space-y-3 text-center text-sm font-medium">
          <p className="text-text-tertiary">
            To validate your request, we&apos;ve sent a one-time password (OTP)
            to your email (<span className="text-supporting-1">{obfuscatedEmail}</span>). Please input it to confirm your request.
          </p>
          {!canResend && (
            <p>
              {`${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(
                countdown % 60
              ).padStart(2, "0")}`}
            </p>
          )}
        </div>
        <AuthPinField onChange={handlePinChange} length={4} />
        <button
          type="button"
          onClick={handleResendCode}
          className="flex gap-1 custom-secondary-color text-base font-medium"
          disabled={!canResend}
        >
          <span className="custom-primary-color">
            <ReloadIcon />
          </span>
          <p>Resend code</p>
        </button>
      </div>
      <Button
        className="w-full mx-auto mt-[50px]"
        onClick={handleAction}
      >
        proceed
      </Button>
    </WalletModalPreset>
  ) : (
    <ModalPreset type="success">
      <p className="text-text-disabled text-sm font-normal">
        Your action has been made successfully. Click the OK button to continue.
      </p>
      <div className="flex justify-center">
        <ModalTrigger close asChild>
          <Button>ok</Button>
        </ModalTrigger>
      </div>
    </ModalPreset>
  );
};

export default LockOTPModal;
