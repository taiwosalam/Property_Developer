"use client";
import ModalPreset from "@/components/Wallet/wallet-modal-preset";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import { useState } from "react";
import ActionModalPreset from "@/components/Modal/modal-preset";
import { ModalTrigger } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import DepositRequestModal from "@/components/tasks/deposit-requests/deposit-request-modal";
import { toast } from "sonner";
import { moveOut } from "./Edit-Rent/data";

const MoveOutModal = ({ unit_id }: { unit_id: string; }) => {
  const commonClasses =
    "bg-neutral-3 dark:bg-[#3C3D37] px-[18px] py-2 rounded-[4px] flex-row-reverse justify-between items-center w-full";
  const [modalView, setModalView] = useState<
    "warning" | "menu" | "success" | "deposit"
  >("menu");
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [reqLoading, setReqLoading] = useState(false);

  const reasonOptions = [
    "Check Inventory",
    "Create Examine",
    "Create Maintenance",
    "Flag Tenant",
  ];
  
  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  const handleMoveOut = async () => {
    const payload = {
      unit_id,
      reason: selectedReasons,
    };
    try {
      setReqLoading(true);
      const res = await moveOut(payload);
      if (res) {
        window.dispatchEvent(new Event("refetchRentUnit"));
        setModalView("success");
      }
    } catch (error) {
      toast.error("Fail to Move out. Please try again later.");
    }

    console.log("payload", payload);
  };


  if (modalView === "menu") {
    return (
      <ModalPreset title="Move Out">
        <div className="space-y-6">
          <p className="text-sm text-text-secondary dark:text-darkText-1">
            Your actions indicate that the tenants have already moved out from
            the current unit of the property, and the said unit is now available
            for listing to other potential tenants. If you proceed, you will
            lose unit data, and the tenants will await caution deposit approval.
          </p>
          <div className="space-y-4">
            <h3 className="text-black dark:text-white text-base font-medium">
              Caution Deposit Requirement
            </h3>
            <div className="space-y-3">
              {reasonOptions.map((option) => (
                <Checkbox
                  key={option}
                  checked={selectedReasons.includes(option)}
                  onChange={() => toggleReason(option)}
                  className={commonClasses}
                >
                  {option}
                </Checkbox>
              ))}
            </div>
          </div>
          <button
            className="w-full bg-status-error-1 text-status-error-2 py-2 rounded mt-10"
            onClick={() => setModalView("warning")}
          >
            Move Out
          </button>
        </div>
      </ModalPreset>
    );
  }
  if (modalView === "warning") {
    return (
      <ActionModalPreset type="warning">
        <div className="flex flex-col gap-8">
          <p className="text-text-tertiary text-[14px]">
            Are you sure you want to proceed with your action of removing a
            tenant&apos;s records from the unit?
          </p>
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleMoveOut}
              disabled={reqLoading}
            >
            { reqLoading ? "Please wait..." : "Proceed" }
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
            You have successfully removed the tenant&apos;s record from the unit
            and the property has been automatically listed on the platforms.
          </p>
          <div className="flex flex-col gap-2">
            <ModalTrigger asChild close>
              <Button>OK</Button>
            </ModalTrigger>
            <Button
              variant="blank"
              className="text-brand-9 font-medium"
              onClick={() => setModalView("deposit")}
            >
              Refund Deposits
            </Button>
          </div>
        </div>
      </ActionModalPreset>
    );
  }
  if (modalView === "deposit") {
    return (
      <DepositRequestModal
        requestId="123"
        propertyName="Moniya"
        state="Oyo"
        unitDetails="Akinleye"
        branch="Moniya"
        amount="₦200"
      />
    );
  }
  return null;
};

export default MoveOutModal;
