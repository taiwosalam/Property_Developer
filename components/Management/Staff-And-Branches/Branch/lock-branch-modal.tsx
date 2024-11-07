import { useEffect, useState } from "react";

// Imports
import useStep from "@/hooks/useStep";
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import { AuthPinField } from "@/components/Auth/auth-components";
import { ReloadIcon, XIcon } from "@/public/icons/icons";

const LockBranchModal = () => {
  const { activeStep, changeStep } = useStep(3);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(40);

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
      setCountdown(40);
      setCanResend(false);
    }
  };

  return activeStep === 1 ? (
    <ModalPreset type="warning" className="md:max-w-[440px]">
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
    <div className="w-full custom-flex-col gap-4 rounded-[40px] bg-white dark:bg-black overflow-hidden text-center max-w-[400px] relative">
      <ModalTrigger
        close
        className="absolute top-7 -right-[340px] w-fit cursor-pointer"
      >
        <XIcon />
      </ModalTrigger>
      <div
        className="bg-[#EFF6FF] w-full py-7"
        style={{ boxShadow: "0px 2px 10px 0px #00000005" }}
      >
        <p className="text-text-secondary font-medium text-[16px]">Input Pin</p>
      </div>
      <div className="p-6">
        <p className="text-text-label text-xs font-normal mb-10">
          An OTP code has been sent to your email <br />
          <span className="text-support-1">(************oke@gmail.com)</span>
          <br /> for confirmation.
        </p>
        <div className="mb-[72px]">
          <AuthPinField
            length={4}
            onChange={
              // Handle changes in the input values
              () => {}
            }
          />
        </div>
        <button
          type="button"
          onClick={handleResendCode}
          className="flex gap-1 custom-secondary-color text-base font-medium mb-10"
          disabled={!canResend}
        >
          <span className="custom-primary-color">
            <ReloadIcon />
          </span>
          <p>Resend code</p>
          {!canResend && <p>({countdown}s)</p>}
        </button>
        <div className="w-full px-6 mb-4">
          <Button
            className="w-full"
            onClick={() => {
              changeStep("next");
            }}
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  ) : activeStep === 3 ? (
    <ModalPreset type="success">
      <p className="text-text-disabled text-sm font-normal">
        The branch has been successfully locked, and all activities are now
        temporarily suspended.
      </p>
      <div className="flex justify-center">
        <ModalTrigger close asChild>
          <Button onClick={() => {}}>ok</Button>
        </ModalTrigger>
      </div>
    </ModalPreset>
  ) : null;
};

export default LockBranchModal;
