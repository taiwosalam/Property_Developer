"use client";

import { useState } from "react";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import type { ActivateWalletOptions } from "@/components/Wallet/types";
import { useAuthStore } from "@/store/authStore";
import { AuthPinField } from "@/components/Auth/auth-components";
import Button from "@/components/Form/Button/button";
import obfuscateEmail from "@/utils/obfuscateEmail";
import { getOtpToActivateWallet, setWalletPin } from "@/components/Wallet/data";
import { toast } from "sonner";
import useBranchStore from "@/store/branchStore";
import { verifyEmailOTP } from "./data";


const VerifyEmailModal = ({
  setOpenVerifyModal,
  modalOpen,
  setModalOpen,
  setEmailStatus,
}: {
  setOpenVerifyModal: (value: boolean) => void;
  modalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  setEmailStatus: (value: "pending" | "verified") => void;
}) => {
  const [requestLoading, setRequestLoading] = useState(false);
  const { branchEmail } = useBranchStore();
  const [verifyEmailLoading, setVerifyEmailLoading] = useState(false);
  const email = useAuthStore((state) => state.email);
  const [confirmPin, setConfirmPin] = useState("");
  const [otp, setOtp] = useState("");

  const handleChangeEmail = () => {
    setModalOpen(true);
    setOpenVerifyModal(false);
  };

  const activeStep = "confirm-email";

  const flow = {
    "confirm-email": {
      heading: "Verify Branch Email",
      content: (
        <>
          <p>
            To create a branch, you will need to attach an email, we have sent a
            one-time (OTP) to your email address (
            {obfuscateEmail(branchEmail || "")}). Please enter the OTP to
            complete the validation process.
          </p>
          <p className=""> 02:00 </p>
          <AuthPinField onChange={setOtp} key="confirm-email" />
          <button className="text-brand-9" onClick={handleChangeEmail}>
            Change Email
          </button>
        </>
      ),
    },
  };

  const handleNext = async () => {
    setVerifyEmailLoading(true);
    const status = await verifyEmailOTP(otp);
    if (status) {
      toast.success("Email verified successfully");
      setModalOpen(true);
      setOpenVerifyModal(false);
      setEmailStatus("verified");
    }
    setVerifyEmailLoading(false);
  };

  return (
    <WalletModalPreset
      style={{ width: "80%", maxWidth: "390px" }}
      title={flow[activeStep].heading}
      back={undefined}
    >
      <div className="space-y-7 text-text-secondary dark:text-white text-sm font-medium text-center">
        {flow[activeStep].content}
      </div>
      <Button
        onClick={handleNext}
        size="sm_medium"
        className="mt-[90px] w-full py-2 px-8"
        disabled={verifyEmailLoading}
      >
        {verifyEmailLoading ? "Please wait..." : "Proceed"}
      </Button>
    </WalletModalPreset>
  );
};

export default VerifyEmailModal;
