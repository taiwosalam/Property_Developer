import { useEffect, useState } from "react";

// Imports
import useStep from "@/hooks/useStep";
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import { AuthPinField } from "@/components/Auth/auth-components";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import { ReloadIcon } from "@/public/icons/icons";
import obfuscateEmail from "@/utils/obfuscateEmail";

const LockBranchModal: React.FC<{
  branchId: string;
}> = ({ branchId }) => {
  const { activeStep, changeStep } = useStep(3);
  const [canResend, setCanResend] = useState(false);
  const [resendReqLoading, setResendReqLoading] = useState(false);
  const [countdown, setCountdown] = useState(40);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleConfirmLock = async () => {
    changeStep("next");
  };

  const handleResendCode = async () => {
    if (canResend) {
      setResendReqLoading(true);
      // const status = await getEmailVerificationOTP(email);
      if (true) {
        setCountdown(40);
        setCanResend(false);
      }
      setResendReqLoading(false);
    }
  };

  return activeStep === 1 ? (
    <ModalPreset type="warning" className="max-w-[360px]">
      <p className="text-text-disabled text-sm font-normal">
        Are you sure you want to lock this branch? By proceeding with this
        action, all branch staff will be unable to log in, and access to the
        branch will be restricted. Additionally, the branch&lsquo;s listing will
        be hidden, and all branch-related activities will be temporarily
        disabled. Please confirm if you wish to continue, as this change could
        affect ongoing operations and employee access.
      </p>
      <div className="flex flex-col items-center gap-4">
        <Button onClick={handleConfirmLock}>proceed</Button>
        <ModalTrigger
          close
          className="text-brand-primary text-sm font-medium px-3"
        >
          Back
        </ModalTrigger>
      </div>
    </ModalPreset>
  ) : activeStep === 2 ? (
    <WalletModalPreset
      style={{ width: "80%", maxWidth: "390px" }}
      title="Input Pin"
    >
      <div className="space-y-7 text-text-secondary dark:text-white text-sm font-medium text-center">
        <p>
          An OTP code has been sent to your email{" "}
          <span className="text-supporting-1">
            ({obfuscateEmail("email@mail.com")})
          </span>
          for confirmation
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
        <AuthPinField length={4} onChange={setOtp} />
      </div>

      <Button
        size="sm_medium"
        className="mt-[80px] w-full py-2 px-8"
        // disabled={requestLoading}
        // onClick={handleVerifyEmail}
      >
        {/* {requestLoading ? "Please wait..." : "Proceed"} */}
        Proceed
      </Button>
    </WalletModalPreset>
  ) : activeStep === 3 ? (
    <ModalPreset type="success">
      <p className="text-text-disabled text-sm font-normal">
        The branch has been successfully locked, and all activities are now
        temporarily suspended.
      </p>
      <div className="flex justify-center">
        <ModalTrigger close asChild>
          <Button>ok</Button>
        </ModalTrigger>
      </div>
    </ModalPreset>
  ) : null;
};

export default LockBranchModal;
