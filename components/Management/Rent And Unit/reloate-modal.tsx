"use client";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import { useState } from "react";
import ActionModalPreset from "@/components/Modal/modal-preset";
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";
import { moveOut } from "./Edit-Rent/data";
import { toast } from "sonner";

const RelocateModal = ({ unit_id }: { unit_id: string }) => {
  const [modalView, setModalView] = useState<"warning" | "menu" | "success">(
    "menu"
  );
  const [reqLoading, setReqLoading] = useState(false);

  const handleMoveOut = async () => {
    const payload = {
      unit_id,
      // reason: selectedReasons,
    };
    try {
      setReqLoading(true);
      const res = await moveOut(payload);
      if (res) {
        setModalView("success");
        window.dispatchEvent(new Event("refetchRentUnit"));
      }
    } catch (error) {
      toast.error("Fail to Move out. Please try again later.");
    }
  };

  if (modalView === "menu") {
    return (
      <WalletModalPreset title="Relocate">
        <div className="custom-flex-col gap-6 justify-between">
          <p className="text-sm dark:text-darkText-1">
            Your action suggests that the occupant has already relocated or
            moved out of the facility or estate unit. If you choose to proceed,
            the occupant&apos;s record will be permanently removed from the unit&apos;s
            data.
          </p>
          <button
            className="bg-status-error-1 text-status-error-2 py-2 rounded mt-20"
            onClick={() => setModalView("warning")}
          >
            Move Out
          </button>
        </div>
      </WalletModalPreset>
    );
  }

  if (modalView === "warning") {
    return (
      <ActionModalPreset type="warning">
        <div className="flex flex-col gap-8">
          <p className="text-text-tertiary text-[14px]">
            Are you sure you want to proceed with your action of removing an
            occupant&apos;s records from the unit?
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={handleMoveOut} disabled={reqLoading}>
              {reqLoading ? "Please wait..." : "Proceed"}
            </Button>
            <Button
              variant="blank"
              className="text-brand-9 font-medium"
              onClick={() => setModalView("menu")}
            >
              Back
            </Button>
          </div>
        </div>
      </ActionModalPreset>
    );
  }
  if (modalView === "success") {
    return (
      <ActionModalPreset type="success">
        <div className="flex flex-col gap-8">
          <p className="text-text-tertiary text-[14px]">
            You have successfully removed the occupant&apos;s record from the
            unit
          </p>

          <ModalTrigger asChild close>
            <Button>OK</Button>
          </ModalTrigger>
        </div>
      </ActionModalPreset>
    );
  }
  return null;
};

export default RelocateModal;
