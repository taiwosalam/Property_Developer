"use client";

// Imports
import useStep from "@/hooks/useStep";
import { useState } from "react";
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";

const DeleteAccountModal: React.FC<{
  accountType?: string;
  action?: () => Promise<boolean>;
  afterAction?: () => void;
}> = ({ accountType, action, afterAction }) => {
  const { activeStep, changeStep } = useStep(2);
  const [reqLoading, setReqLoading] = useState(false);

  const handleAction = async () => {
    setReqLoading(true);
    const success = action ? await action?.() : true;
    if (success) {
      changeStep("next");
      setTimeout(() => afterAction?.(), 1000);
    }
    setReqLoading(false);
  };

  return activeStep === 1 ? (
    <ModalPreset type="warning">
      <p className="text-text-disabled text-sm font-normal">
        Are you certain you want to proceed with deleting this {accountType}{" "}
        profile?
      </p>
      <div className="flex flex-col items-center gap-4">
        <Button onClick={handleAction} disabled={reqLoading}>
          {reqLoading ? "deleting..." : "proceed"}
        </Button>
        <ModalTrigger
          close
          className="text-brand-primary text-sm font-medium px-3"
        >
          Back
        </ModalTrigger>
      </div>
    </ModalPreset>
  ) : (
    <ModalPreset type="success">
      <p className="text-text-disabled text-sm font-normal">
        <span className="capitalize">{accountType}</span> Profile has been
        successfully deleted.
      </p>

      <ModalTrigger close asChild>
        <Button className="!w-fit mx-auto">ok</Button>
      </ModalTrigger>
    </ModalPreset>
  );
};

export default DeleteAccountModal;
