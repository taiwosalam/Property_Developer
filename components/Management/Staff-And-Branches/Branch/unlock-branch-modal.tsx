import { useEffect, useState } from "react";

// Imports
import useStep from "@/hooks/useStep";
import Button from "@/components/Form/Button/button";
import { ModalTrigger, useModal } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import { AuthPinField } from "@/components/Auth/auth-components";
import { XIcon, ReloadIcon } from "@/public/icons/icons";
import useBranchStore from "@/store/branch-store";
import { useAuthStore } from "@/store/authStore";
import { getEmailVerificationOTP, unLockBranch } from "../data";
import { toast } from "sonner";
import obfuscateEmail from "@/utils/obfuscateEmail";
import { useRouter } from "next/navigation";

const UnLockBranchModal: React.FC<{
  branchId: string;
}> = ({ branchId }) => {
  const router = useRouter();
  const { activeStep, changeStep } = useStep(3);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(40);
  const [loading, setLoading] = useState(false)
  const [resendReqLoading, setResendReqLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const { branch } = useBranchStore()
  const email = useAuthStore.getState().email || "";
  const { setIsOpen } = useModal();

  const branch_id = branch.branch_id;

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
    try {
      setLoading(true)
      const res = await getEmailVerificationOTP(email);
      if (res) {
        changeStep("next");
      }
    } catch (error) {
      toast.error("Can't Send OTP, Please try again!")
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (canResend) {
      setResendReqLoading(true);
      const status = await getEmailVerificationOTP(email);
      if (status) {
        setCountdown(40);
        setCanResend(false);
      }
      setResendReqLoading(false);
    }
  };

  const handleUnLockVerfiyLock = async () => {
    try {
      setRequestLoading(true);
      const res = await unLockBranch(branch_id, otp);
      if (res) {
        toast.success("Branch Unlocked Successfully")
        // router.push("/management/staff-branch");
        // window.dispatchEvent(new Event("refectch-branch"));
        changeStep(3);
      }
    } catch (err) {
      toast.error("Failed to UnLock Branch");
    } finally {
      setRequestLoading(false);
    }
  }

  const handleCloseModal = ()=> {
    setIsOpen(false)
    window.dispatchEvent(new Event("refectch-branch"));
  }

  return activeStep === 1 ? (
    <ModalPreset type="warning" className="md:max-w-[440px]">
      <p className="text-text-disabled text-sm font-normal">
        Are you sure you want to unlock the branch? This will allow branch staff
        to regain access to their accounts, and all operational activities will
        resume as normal within the branch.
      </p>
      <div className="flex flex-col items-center gap-4">
        <Button
          disabled={loading}
          onClick={handleConfirmLock}
        >
           {loading ? 'Please wait...' : 'Proceed'}
        </Button>
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
          <span className="text-support-1">({obfuscateEmail(email)})</span>
          <br /> for confirmation.
        </p>
        <div className="mb-[72px]">
          <AuthPinField
            length={4}
            onChange={setOtp}
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
            // onClick={() => {
            //   changeStep("next");
            // }}
            disabled={requestLoading}
            onClick={handleUnLockVerfiyLock}
          >
            {requestLoading ? 'Please wait...' : 'Proceed'}
          </Button>
        </div>
      </div>
    </div>
  ) : activeStep === 3 ? (
    <ModalPreset type="success">
      <p className="text-text-disabled text-sm font-normal">
        The branch has been successfully unlocked, and all activities have
        resumed as normal. Staff members now have full access to their accounts
        and can continue their operations.
      </p>
      <div className="flex justify-center">
        {/* <ModalTrigger close asChild> */}
          <Button onClick={handleCloseModal}>ok</Button>
        {/* </ModalTrigger> */}
      </div>
    </ModalPreset>
  ) : null;
};

export default UnLockBranchModal;
