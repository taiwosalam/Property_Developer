"use client";

import { useState } from "react";
import WalletModalPreset from "./wallet-modal-preset";
import type { ActivateWalletOptions } from "./types";
import { useAuthStore } from "@/store/authStore";
import { AuthPinField } from "../Auth/auth-components";
import Button from "../Form/Button/button";
import obfuscateEmail from "@/utils/obfuscateEmail";
import { getOtpToActivateWallet, setWalletPin } from "./data";
import { toast } from "sonner";
import { useModal } from "../Modal/modal";

const ActivateWalletModal = () => {
  const { setIsOpen } = useModal();
  const [requestLoading, setRequestLoading] = useState(false);
  const email = useAuthStore((state) => state.email);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [otp, setOtp] = useState("");
  const [activeStep, setActiveStep] =
    useState<ActivateWalletOptions>("setup-pin");
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
      heading: "Input OTP",
      content: (
        <>
          <p>
            To authenticate your request, please input the OTP sent to the email
            you used during registration ({obfuscateEmail(email || "")}) to
            complete your request.
          </p>
          <AuthPinField onChange={setOtp} key="enter-otp" />
        </>
      ),
    },
  };

  const handleNext = async () => {
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
      }
      setRequestLoading(false);
    } else if (activeStep === "enter-otp") {
      setRequestLoading(true);
      const status = await setWalletPin(pin, confirmPin, otp);
      if (status) {
        toast.success("PIN set successfully!");
        setIsOpen(false);
      }
      setRequestLoading(false);
    }
  };
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
