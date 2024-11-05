import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import { useState } from "react";
import ActionModalPreset from "@/components/Modal/modal-preset";
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";

const RelocateModal = () => {
  const [modalView, setModalView] = useState<"warning" | "menu" | "success">(
    "menu"
  );
  if (modalView === "menu") {
    return (
      <WalletModalPreset title="Relocate">
        <div className="custom-flex-col gap-6 justify-between">
          <p className="text-sm dark:text-darkText-1">
            Your actions indicate that the occupant have already relocated from
            the current unit of the estate. If you proceed, you will lose unit
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
            <Button onClick={() => setModalView("success")}>Proceed</Button>
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
