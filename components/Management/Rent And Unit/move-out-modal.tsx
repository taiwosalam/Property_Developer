"use client";
import ModalPreset from "@/components/Wallet/wallet-modal-preset";
import DocumentCheckbox from "@/components/Documents/DocumentCheckbox/document-checkbox";
import { useState } from "react";
import ActionModalPreset from "@/components/Modal/modal-preset";
import { ModalTrigger } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import DepositRequestModal from "@/components/tasks/deposit-requests/deposit-request-modal";

const MoveOutModal = () => {
  const commonClasses =
    "bg-neutral-3 dark:bg-[#3C3D37] px-[18px] py-2 rounded-[4px] flex-row-reverse justify-between items-center";
  const [modalView, setModalView] = useState<
    "warning" | "menu" | "success" | "deposit"
  >("menu");
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
              <DocumentCheckbox
                title="Check Inventory"
                className={commonClasses}
                alignCheckboxCenter
              />
              <DocumentCheckbox
                title="Create Examine"
                className={commonClasses}
                alignCheckboxCenter
              />
              <DocumentCheckbox
                title="Create Maintenance"
                className={commonClasses}
                alignCheckboxCenter
              />
              <DocumentCheckbox
                title="Flag Tenant"
                className={commonClasses}
                alignCheckboxCenter
              />
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
