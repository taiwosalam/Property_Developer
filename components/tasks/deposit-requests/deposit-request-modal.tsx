"use client";
import { useState } from "react";
import type { LabelValuePairProps } from "../property-requests/types";
import { PointerDownSVG } from "@/public/icons/icons";
import type { DepositRequestModalProps } from "./types";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import ModalPreset from "@/components/Wallet/wallet-modal-preset";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import {
  depositChecklist,
  updateCautionDeposit,
  IDepositPayload,
} from "@/app/(nav)/tasks/deposits/data";
import { toast } from "sonner";
import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
import { parseCurrencyToNumber } from "@/lib/utils";
dayjs.extend(utc);

const LabelValuePair: React.FC<LabelValuePairProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between font-medium">
      <p className="text-text-tertiary dark:text-darkText-1 text-base capitalize">
        {label}
      </p>
      <p className="text-text-secondary text-sm text-right dark:text-darkText-2 capitalize">
        {value}
      </p>
    </div>
  );
};

const DepositRequestModal: React.FC<DepositRequestModalProps> = ({
  requestId,
  propertyName,
  state,
  unitDetails,
  branch,
  amount,
  is_examine,
  is_inventory,
  is_maintain,
  inventory_at,
  inventory_by,
  examine_by,
  rejected_at,
  maintain_by,
  examined_at,
  maintain_at,
  created_at,
  status,
  request_from,
  refunded_amount,
  resolved_by,
  resolved_date,
}) => {
  const [isEscrowChecked, setIsEscrowChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // New state to track which checkboxes are locked (successfully updated)
  const [lockedCheckboxes, setLockedCheckboxes] = useState({
    is_inventory: is_inventory || false,
    is_examine: is_examine || false,
    is_maintain: is_maintain || false,
  });

  const commonClasses =
    "bg-neutral-3 dark:bg-[#3C3D37] px-[18px] py-2 rounded-[4px] flex-row-reverse justify-between items-center w-full";

  const HoverContent = ({ field }: { field: keyof typeof checkboxStates }) => {
    const details = {
      is_inventory: { by: inventory_by, at: inventory_at },
      is_examine: { by: examine_by, at: examined_at },
      is_maintain: { by: maintain_by, at: maintain_at },
    };

    const { by, at } = details[field];

    // Only render if the checkbox is checked
    if (!checkboxStates[field]) return null;

    const formattedTime = dayjs(at).format("hh:mm A");
    const formattedDate = dayjs(at).format("DD/MM/YYYY");

    return (
      <div className="w-[250px] absolute bottom-full right-[12px] z-10 bg-brand-10 py-2 px-4 space-y-[10px] text-white text-sm font-normal">
        <p className="flex gap-2">
          <span>Approved by:</span>
          <span className="capitalize">{by || "Unknown"}</span>
        </p>
        <p className="flex gap-2">
          <span>Date:</span>
          <span>{formattedDate}</span>
        </p>
        <p className="flex gap-2">
          <span>Time:</span>
          <span>{formattedTime}</span>
        </p>
        <div className="!m-0 absolute right-2 top-full text-brand-10">
          <PointerDownSVG />
        </div>
      </div>
    );
  };

  const [refundAmount, setRefundAmount] = useState<number | undefined>(
    undefined
  );
  const [checkboxStates, setCheckboxStates] = useState({
    is_inventory: is_inventory || false,
    is_examine: is_examine || false,
    is_maintain: is_maintain || false,
  });

  const formattedRefundAmount =
    refundAmount !== undefined
      ? refundAmount.toLocaleString("en-NG", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : "";

  const handleRefundAmountChange = (value: string) => {
    // Remove non-numeric characters (e.g., commas, currency symbols)
    const numericValue = value.replace(/[^0-9]/g, "");
    // Convert to number or undefined if empty
    setRefundAmount(numericValue ? Number(numericValue) : undefined);
  };

  const handleCheckboxChange = async (field: keyof typeof checkboxStates) => {
    // Prevent changes if the checkbox is already locked
    if (lockedCheckboxes[field]) {
      toast.warning(
        "This checkbox has already been updated and cannot be changed."
      );
      return;
    }

    const newCheckedState = !checkboxStates[field];

    // Update local state
    const newCheckboxStates = {
      ...checkboxStates,
      [field]: newCheckedState,
    };
    setCheckboxStates(newCheckboxStates);

    const payload: { [key: string]: any } = {
      [field]: newCheckedState,
      status: "progress",
    };

    try {
      const success = await updateCautionDeposit(requestId, payload);
      if (!success) {
        // Revert state on failure
        setCheckboxStates((prev) => ({
          ...prev,
          [field]: !newCheckedState,
        }));
        toast.error("Failed to update deposit status");
      } else {
        // Lock the checkbox on successful update
        setLockedCheckboxes((prev) => ({
          ...prev,
          [field]: newCheckedState,
        }));
        toast.success("Deposit status updated successfully");
      }
    } catch (error) {
      // Revert state on error
      setCheckboxStates((prev) => ({
        ...prev,
        [field]: !newCheckedState,
      }));
      toast.error("Failed to update deposit status");
    }
  };

  const handleDepositRequest = async () => {
    if (!requestId) return;

    const allCheckboxesChecked = Object.values(checkboxStates).every(Boolean);
    if (!allCheckboxesChecked) {
      toast.warning(
        "All checkboxes must be checked before requesting a refund"
      );
      return;
    }

    if (!refundAmount) {
      toast.warning("You need to provide refund amount");
      return;
    }

    const depositAmount = parseCurrencyToNumber(amount);
    if (refundAmount > depositAmount) {
      toast.error("Refund amount is more than the deposit amount");
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        refunded_amount: refundAmount,
        //status: isEscrowChecked ? "pending" : "completed",
        status: request_from === "company" ? "completed" : "approved",
      };
      const success = await updateCautionDeposit(requestId, payload);
      if (success) {
        window.dispatchEvent(new Event("dispatchDeposit"));
        toast.success("Updated successfully");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // Map checklist items to payload fields and dynamic labels
  const checklistMapping: Record<
    string,
    { field: keyof typeof checkboxStates; label: string }
  > = {
    "check inventory": {
      field: "is_inventory",
      label:
        checkboxStates.is_inventory &&
        (status === "completed" || status === "progress")
          ? "Checked inventory"
          : "check inventory",
    },
    "request for examine": {
      field: "is_examine",
      label:
        checkboxStates.is_examine &&
        (status === "completed" || status === "progress")
          ? "Done with examine"
          : "request for examine",
    },
    "request for maintenance": {
      field: "is_maintain",
      label:
        checkboxStates.is_maintain &&
        (status === "completed" || status === "progress")
          ? "Done with maintenance"
          : "request for maintenance",
    },
  };

  return (
    <ModalPreset title="Caution Deposit Request">
      <div className="pb-[45px] text-base">
        <div className="space-y-2">
          <LabelValuePair label="ID" value={requestId} />
          <LabelValuePair label="Property Name" value={propertyName} />
          <LabelValuePair label="Location (State)" value={state} />
          <LabelValuePair label="Unit Details" value={unitDetails} />
          <LabelValuePair label="Branch" value={branch} />
          <LabelValuePair label="Deposit Amount" value={amount} />

          {status === "completed" && (
            <div className="space-y-2">
              <LabelValuePair
                label="Amount Refunded"
                value={refunded_amount || "--- ---"}
              />
              <LabelValuePair
                label="Resolved By"
                value={resolved_by || "--- ---"}
              />
              <LabelValuePair
                label="Resolved Date"
                value={resolved_date || "--- ---"}
              />
            </div>
          )}
        </div>
        <div className="border-t border-brand-7 my-5 -mx-6 border-dashed" />
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleDepositRequest();
          }}
        >
          <p className="text-text-tertiary dark:text-white">
            Caution Deposits Details:
          </p>
          <div className="space-y-2 relative">
            {depositChecklist.map((deposit, index) => (
              <Checkbox
                key={index}
                id={deposit}
                name={checklistMapping[deposit].field}
                className={commonClasses}
                checked={checkboxStates[checklistMapping[deposit].field]}
                onChange={() =>
                  handleCheckboxChange(checklistMapping[deposit].field)
                }
                hoverContent={
                  <HoverContent field={checklistMapping[deposit].field} />
                }
              >
                {checklistMapping[deposit].label}
              </Checkbox>
            ))}
          </div>
          {status !== "completed" && (
            <div className="space-y-5">
              <div className="flex gap-1 items-center">
                <p className="text-red-500">*</p>
                <p className="text-text-tertiary dark:text-white">
                  Caution deposit held in escrow by the{" "}
                  {request_from === "company"
                    ? "Management Company"
                    : request_from === "landlord"
                    ? "Landlord/Landlady"
                    : request_from === "escrow"
                    ? "Administrator"
                    : "Management Company"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:justify-between">
                <Input
                  id="refund_amount"
                  label="Amount to be Refunded"
                  CURRENCY_SYMBOL="₦"
                  formatNumber
                  value={formattedRefundAmount}
                  onChange={handleRefundAmountChange}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="xs_normal"
                  className="py-2 px-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Please wait..." : "Refund Now"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </ModalPreset>
  );
};

export default DepositRequestModal;
