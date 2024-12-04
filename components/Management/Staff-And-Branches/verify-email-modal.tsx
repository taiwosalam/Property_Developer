"use client";

import { useEffect, useState } from "react";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import { AuthPinField } from "@/components/Auth/auth-components";
import Button from "@/components/Form/Button/button";
import obfuscateEmail from "@/utils/obfuscateEmail";
import { ReloadIcon } from "@/public/icons/icons";
import { getEmailVerificationOTP, verifyEmailOTP } from "./data";

const VerifyEmailModal: React.FC<{
  email: string;
  setVerifyEmailModal: (value: boolean) => void;
  setEmailStatus: (value: "verified" | "pending") => void;
  setVerifiedEmail: (value: string) => void;
}> = ({ email, setVerifyEmailModal, setEmailStatus, setVerifiedEmail }) => {
  const [requestLoading, setRequestLoading] = useState(false);
  const [resendReqLoading, setResendReqLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [otp, setOtp] = useState("");

  const handleResendCode = async () => {
    if (canResend) {
      setResendReqLoading(true);
      const status = await getEmailVerificationOTP(email);
      if (status) {
        setCountdown(60);
        setCanResend(false);
      }
      setResendReqLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    setRequestLoading(true);
    const status = await verifyEmailOTP(otp);
    if (status) {
      setEmailStatus("verified");
      setVerifyEmailModal(false);
      setVerifiedEmail(email);
    }
    setRequestLoading(false);
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
      title="Verify Branch Email"
    >
      <div className="space-y-7 text-text-secondary dark:text-white text-sm font-medium text-center">
        <p>
          To create a branch, you will need to attach an email. We have sent a
          one-time (OTP) to your email address{" "}
          <span className="text-supporting-1">
            ({obfuscateEmail(email || "")})
          </span>
          . Please enter the OTP to complete the validation process.
        </p>
        {!canResend ? (
          <p className="text-black">
            {`${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(
              countdown % 60
            ).padStart(2, "0")}`}
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResendCode}
            className="mx-auto flex gap-1 text-brand-9 text-base font-medium"
            disabled={resendReqLoading}
          >
            <ReloadIcon />
            Resend code
          </button>
        )}
        <AuthPinField onChange={setOtp} />
        <button
          type="button"
          className="text-brand-9"
          onClick={() => setVerifyEmailModal(false)}
        >
          Change Email
        </button>
      </div>
      <Button
        size="sm_medium"
        className="mt-[80px] w-full py-2 px-8"
        disabled={requestLoading}
        onClick={handleVerifyEmail}
      >
        {requestLoading ? "Please wait..." : "Proceed"}
      </Button>
    </WalletModalPreset>
  );
};

export default VerifyEmailModal;
