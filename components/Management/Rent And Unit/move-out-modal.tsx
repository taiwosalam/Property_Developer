"use client";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import { useState } from "react";
import ActionModalPreset from "@/components/Modal/modal-preset";
import { ModalTrigger, useModal } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import DepositRequestModal from "@/components/tasks/deposit-requests/deposit-request-modal";
import { toast } from "sonner";
import { moveOut } from "./Edit-Rent/data";
import Switch from "@/components/Form/Switch/switch";
import Select from "@/components/Form/Select/select";
import { tenantRejectOptions } from "@/app/(nav)/management/tenants/data";
import { flagTenant } from "@/app/(nav)/management/tenants/[tenantId]/manage/data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";

const FLAG_REASON = "Flag Tenant";
type MoveOutModalProps = {
  unit_id: string;
  tenant_id: number;
  cautionDeposit: number;
  tenantAgent?: "web" | "mobile";
};

const MoveOutModal = ({
  unit_id,
  tenantAgent,
  tenant_id,
  cautionDeposit,
}: MoveOutModalProps) => {
  const commonClasses =
    "py-2 rounded-[4px] flex justify-between items-center w-full";
  const [modalView, setModalView] = useState<
    "warning" | "menu" | "success" | "deposit" | "flag"
  >("menu");
  const isWebUser = tenantAgent?.toLowerCase() === "web";
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [flagSelectValue, setFlagSelectValue] = useState<string | null>(null);
  const [reqLoading, setReqLoading] = useState(false);
  const [flagLoading, setFlagLoading] = useState(false);
  const { setIsOpen } = useModal();

  const reasonOptions = [
    "Check Inventory",
    "Create Examine",
    "Create Maintenance",
    FLAG_REASON,
  ];

  // Helper: is flag toggle visible in this modal (menu)?
  const isFlagOptionVisible =
    cautionDeposit > 0 ? reasonOptions.includes(FLAG_REASON) : true; // Caution deposit 0 always shows Flag Tenant toggle

  // Toggle for all except "Flag Tenant"
  const toggleReason = (reason: string) => {
    if (reason === FLAG_REASON) {
      if (!selectedReasons.includes(FLAG_REASON)) {
        setModalView("flag");
      } else {
        setSelectedReasons((prev) => prev.filter((r) => r !== FLAG_REASON));
      }
    } else {
      setSelectedReasons((prev) =>
        prev.includes(reason)
          ? prev.filter((r) => r !== reason)
          : [...prev, reason]
      );
    }
  };

  const handleFlagProceed = async () => {
    if (!flagSelectValue) {
      toast.warning("Please select a reason before flagging");
      return;
    }
    const payload = {
      is_flagged: 1,
      reason: flagSelectValue,
    };
    try {
      setFlagLoading(true);
      const res = await flagTenant(tenant_id, objectToFormData(payload));
      if (res) {
        toast.success("Flagged Successfully");
        if (!selectedReasons.includes(FLAG_REASON)) {
          setSelectedReasons((prev) => [...prev, FLAG_REASON]);
        }
        // Immediately move out and skip warning!
        await handleMoveOut();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong, try again");
    } finally {
      setFlagLoading(false);
    }
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
        window.dispatchEvent(new Event("property-updated"));
        window.dispatchEvent(new Event("refetchtenant"));
        setModalView("success");
      }
    } catch (error) {
      toast.error("Fail to Move out. Please try again later.");
    } finally {
      setReqLoading(false);
    }
  };

  // If web user, go straight to warning modal
  if (isWebUser) {
    return (
      <ActionModalPreset type="warning">
        <div className="flex flex-col gap-8">
          <p className="text-text-tertiary text-[14px]">
            Are you sure you want to proceed with your action of removing a
            tenant&apos;s records from the unit?
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={handleMoveOut} disabled={reqLoading}>
              {reqLoading ? "Please wait..." : "Proceed"}
            </Button>
            <Button
              variant="blank"
              className="text-brand-9 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Back
            </Button>
          </div>
        </div>
      </ActionModalPreset>
    );
  }

  if (modalView === "menu") {
    return (
      <WalletModalPreset title="Move Out">
        <div className="space-y-6">
          <p className="text-sm text-text-secondary dark:text-darkText-1">
            Your actions indicate that the tenants have already moved out from
            the current unit of the property, and the said unit is now available
            for listing to other potential tenants. If you proceed, you will
            lose unit data, and the tenants will await caution deposit approval.
          </p>
          <div className="space-y-4">
            {cautionDeposit > 0 ? (
              <>
                <h3 className="text-black dark:text-white text-base font-medium">
                  Caution Deposit Requirement
                </h3>
                <div className="space-y-3">
                  <div className="custom-flex-col gap-4">
                    {reasonOptions.map((option) => (
                      <div key={option} className={commonClasses}>
                        <span className="text-text-secondary">{option}</span>
                        <Switch
                          onClick={() => toggleReason(option)}
                          checked={selectedReasons.includes(option)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="custom-flex-col gap-2">
                <div className="bg-gray-200 p-2 rounded-md shadow-sm">
                  <p className="text-text-secondary dark:text-darkText-1 text-sm font-medium">
                    <span className="text-red-500">*</span> At the time the
                    occupant moved into the apartment unit, there was no record
                    of any caution deposit being made. This means that no
                    financial security amount was submitted or documented to
                    cover potential damages or breaches of the tenancy agreement
                    during their stay.
                  </p>
                </div>
                <div className={commonClasses}>
                  <span className="text-text-secondary"> Flag Tenant </span>
                  <Switch
                    onClick={() => toggleReason("Flag Tenant")}
                    checked={selectedReasons.includes("Flag Tenant")}
                  />
                </div>
              </div>
            )}
          </div>
          <button
            className="w-full bg-status-error-1 text-status-error-2 py-2 rounded mt-10"
            // HERE is the main logic change:
            onClick={() => {
              if (isFlagOptionVisible) {
                handleMoveOut();
              } else {
                setModalView("warning");
              }
            }}
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
            Are you sure you want to proceed with your action of removing a
            tenant&apos;s records from the unit?
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
  if (modalView === "flag") {
    return (
      <ActionModalPreset
        type="warning"
        back={() => setModalView("menu")}
        customWidth="w-[60%] md:w-[40%] max-h-[85%]"
        className="overflow-visible w-full"
      >
        <div className="flex items-center flex-col">
          <p className="my-2">Are you sure you want to flag this user?</p>
          <div className="flex w-full my-2 items-center relative z-[1000]">
            <Select
              label="Please select a reason from the options provided before proceeding."
              id="reason"
              options={tenantRejectOptions}
              value={flagSelectValue ?? ""}
              onChange={setFlagSelectValue}
              className="w-full z-[100]"
            />
          </div>
          <div className="flex gap-2 items-center mt-4">
            <Button
              size="base_medium"
              variant="light_red"
              className="py-2 px-8 w-full"
              onClick={handleFlagProceed}
              disabled={flagLoading}
            >
              {flagLoading ? "Please wait..." : "Flag"}
            </Button>
          </div>
        </div>
      </ActionModalPreset>
    );
  }
  return null;
};

export default MoveOutModal;
