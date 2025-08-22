"use client";

import ActionModalPreset from "@/components/Modal/modal-preset";
import { ModalTrigger, useModal } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import DepositRequestModal from "@/components/tasks/deposit-requests/deposit-request-modal";
import Switch from "@/components/Form/Switch/switch";
import Select from "@/components/Form/Select/select";
import { tenantRejectOptions } from "@/app/(nav)/management/tenants/data";
import { flagTenant } from "@/app/(nav)/management/tenants/[tenantId]/manage/data";
import { moveOut } from "./Edit-Rent/data";
import { toast } from "sonner";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { Currency } from "@/utils/number-formatter";
import api from "@/services/api";
import { useEffect, useState } from "react";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import { useGlobalStore } from "@/store/general-store";

type MoveOutModalProps = {
  unit_id: string;
  tenant_id: number;
  cautionDepositStatus: boolean;
  tenantAgent?: "web" | "mobile";
  currency?: Currency;
  unitData: any;
};

const MoveOutModal = ({
  unit_id,
  tenant_id,
  cautionDepositStatus,
  tenantAgent,
  currency,
  unitData,
}: MoveOutModalProps) => {
  const isNaira = currency === "naira";
  const isWeb = tenantAgent?.toLowerCase() === "web";
  const { setIsOpen } = useModal();
  const [modalView, setModalView] = useState<
    "menu" | "warning" | "success" | "deposit" | "flag"
  >(isWeb ? "warning" : "menu");
  const [isLoading, setIsLoading] = useState(false);
  const [flagReason, setFlagReason] = useState<string | null>(null);
  const [isFlagged, setIsFlagged] = useState(false);

  // Get the store functions
  const { setGlobalInfoStore, caution_unit_occupant } = useGlobalStore();
  useEffect(() => {
    if (unitData?.caution_unit_occupant) {
      setGlobalInfoStore(
        "caution_unit_occupant",
        unitData.caution_unit_occupant
      );
    }
  }, [unitData, setGlobalInfoStore]);
  // Get caution unit occupant data from global store
  const cautionUnitOccupant = useGlobalStore(
    (state) => state.caution_unit_occupant
  );

  const handleMoveOut = async () => {
    try {
      setIsLoading(true);
      const payload = { unit_id, reason: isFlagged ? ["Flag Tenant"] : [] };
      const res = await moveOut(payload);
      if (res) {
        if (isNaira && cautionDepositStatus) {
          setModalView("success");
        } else {
          toast.success("Tenant moved out successfully.");
          setIsOpen(false);
          window.dispatchEvent(new Event("refetchRentUnit"));
          window.dispatchEvent(new Event("property-updated"));
          window.dispatchEvent(new Event("refetchtenant"));
        }
      }
    } catch (error) {
      toast.error("Failed to move out. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlag = async () => {
    if (!flagReason) {
      toast.warning("Please select a reason before flagging");
      return;
    }
    try {
      setIsLoading(true);
      const payload = { is_flagged: 1, reason: flagReason };
      const res = await flagTenant(tenant_id, objectToFormData(payload));
      if (res) {
        toast.success("Tenant flagged successfully");
        setIsFlagged(true);
        setModalView("menu");
      }
    } catch (error) {
      toast.error("Failed to flag tenant. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const allowedStatuses = [
    "progress",
    "pending",
    "completed",
    "approved",
  ] as const;
  const status = allowedStatuses.includes(
    caution_unit_occupant.request_status as any
  )
    ? (caution_unit_occupant.request_status as (typeof allowedStatuses)[number])
    : undefined;

  const renderMenu = () => (
    <WalletModalPreset title="Move Out">
      <div className="space-y-6">
        <p className="text-sm text-text-secondary dark:text-darkText-1">
          Your actions indicate that the tenants have moved out from the current
          unit. The unit will be available for listing to other potential
          tenants. Proceeding will remove unit data, and tenants will await
          caution deposit approval.
        </p>
        <div className="space-y-4">
          {isNaira && !cautionDepositStatus && (
            <>
              <div className="bg-gray-200 dark:bg-darkText-primary dark:border dark:border-gray-600 p-2 rounded-md shadow-sm">
                <p className="text-text-secondary dark:text-white text-sm font-medium">
                  <span className="text-red-500">*</span> No caution deposit was
                  recorded when the occupant moved in, meaning no financial
                  security was submitted to cover potential damages or breaches
                  of the tenancy agreement.
                </p>
              </div>
              <div className="py-2 rounded-[4px] flex justify-between items-center w-full">
                <span className="text-text-secondary dark:text-white">
                  Flag Tenant
                </span>
                <Switch
                  onClick={() => setModalView("flag")}
                  checked={isFlagged}
                />
              </div>
            </>
          )}
          {/* {isNaira && !cautionDepositStatus ? (
            <div className="bg-gray-200 dark:bg-darkText-primary dark:border dark:border-gray-600 p-2 rounded-md shadow-sm">
              <p className="text-text-secondary dark:text-white text-sm font-medium">
                <span className="text-red-500">*</span> No caution deposit was
                recorded when the occupant moved in, meaning no financial
                security was submitted to cover potential damages or breaches of
                the tenancy agreement.
              </p>
            </div>
          ) : (
            <div className="py-2 rounded-[4px] flex justify-between items-center w-full">
              <span className="text-text-secondary dark:text-white">
                Flag Tenant
              </span>
              <Switch
                onClick={() => setModalView("flag")}
                checked={isFlagged}
              />
            </div>
          )} */}
        </div>
        <button
          className="w-full bg-status-error-1 text-status-error-2 py-2 rounded mt-10"
          onClick={() =>
            isNaira && cautionDepositStatus
              ? handleMoveOut()
              : setModalView("warning")
          }
          disabled={isLoading}
        >
          {isLoading ? "Please wait..." : "Move Out"}
        </button>
      </div>
    </WalletModalPreset>
  );

  const renderWarning = () => (
    <ActionModalPreset type="warning">
      <div className="flex flex-col gap-8">
        <p className="text-text-tertiary text-[14px]">
          Are you sure you want to proceed with removing the tenant&apos;s
          records from the unit?
        </p>
        <div className="flex flex-col gap-2">
          <Button onClick={handleMoveOut} disabled={isLoading}>
            {isLoading ? "Please wait..." : "Proceed"}
          </Button>
          {!isWeb && (
            <Button
              variant="blank"
              className="text-brand-9 font-medium"
              onClick={() => setModalView("menu")}
            >
              Back
            </Button>
          )}
        </div>
      </div>
    </ActionModalPreset>
  );

  const renderSuccess = () => (
    <ActionModalPreset type="success">
      <div className="flex flex-col gap-8">
        <p className="text-text-tertiary text-[14px]">
          You have successfully removed the tenant&apos;s record from the unit,
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

  const renderDeposit = () => (
    <DepositRequestModal
      requestId={caution_unit_occupant.requestId || ""}
      propertyName={caution_unit_occupant.propertyName || ""}
      state={caution_unit_occupant.state || ""}
      unitDetails={caution_unit_occupant.unitDetails || ""}
      branch={caution_unit_occupant.branch || ""}
      amount={caution_unit_occupant.amount || ""}
      status={status}
      isRent
    />
  );

  const renderFlag = () => (
    <ActionModalPreset
      type="warning"
      back={() => setModalView("menu")}
      customWidth="w-[60%] md:w-[40%] max-h-[85%]"
      className="overflow-visible w-full"
    >
      <div className="flex flex-col items-center">
        <p className="my-2">Are you sure you want to flag this user?</p>
        <div className="w-full my-2 relative z-[1000]">
          <Select
            label="Please select a reason before proceeding."
            id="reason"
            options={tenantRejectOptions}
            value={flagReason ?? ""}
            onChange={setFlagReason}
            className="w-full z-[100]"
          />
        </div>
        <div className="flex gap-2 items-center mt-4">
          <Button
            size="base_medium"
            variant="light_red"
            className="py-2 px-8 w-full"
            onClick={handleFlag}
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : "Flag"}
          </Button>
        </div>
      </div>
    </ActionModalPreset>
  );

  return (
    <>
      {modalView === "menu" && renderMenu()}
      {modalView === "warning" && renderWarning()}
      {modalView === "success" && renderSuccess()}
      {modalView === "deposit" && renderDeposit()}
      {modalView === "flag" && renderFlag()}
    </>
  );
};

export default MoveOutModal;
