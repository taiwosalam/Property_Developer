"use client";
import { useState } from "react";
import { ModalTrigger } from "@/components/Modal/modal";
import { XIcon } from "@/public/icons/icons";
import type { LabelValuePairProps } from "../property-requests/types";
import type { DepositRequestModalProps, DetailsCheckProps } from "./types";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { formatCostInputValue } from "@/utils/number-formatter";
import ModalPreset from "@/components/Wallet/wallet-modal-preset";

const LabelValuePair: React.FC<LabelValuePairProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between">
      <p className="text-text-tertiary dark:text-darkText-1 text-base">
        {label}
      </p>
      <p className="text-text-secondary text-sm text-right dark:text-darkText-2">
        {value}
      </p>
    </div>
  );
};
const DetailsCheck: React.FC<DetailsCheckProps> = ({ label }) => {
  return (
    <label
      htmlFor={`${label}-check`}
      className="flex items-center justify-between gap-2 rounded-[4px] bg-neutral-3 dark:bg-darkText-primary dark:border dark:border-[#3C3D37] px-[18px] py-[10px]"
    >
      <span className="text-sm text-text-secondary dark:text-darkText-2">
        {label}
      </span>
      <input
        type="checkbox"
        id={`${label}-check`}
        className="w-6 h-6 rounded-[4px] checked:bg-brand-7 checked:border-brand-7"
      />
    </label>
  );
};

const DepositRequestModal: React.FC<DepositRequestModalProps> = ({
  requestId,
  propertyName,
  state,
  unitDetails,
  branch,
  amount,
}) => {
  const [refundAmount, setRefundAmount] = useState("");
  const [isEscrowChecked, setIsEscrowChecked] = useState(false);
  return (
    <ModalPreset title="Property Request Details">
      <div className="pb-[45px] text-base">
        <div className="space-y-2">
          <LabelValuePair label="ID" value={requestId} />
          <LabelValuePair label="Property Name" value={propertyName} />
          <LabelValuePair label="Location (State)" value={state} />
          <LabelValuePair label="Unit Details" value={unitDetails} />
          <LabelValuePair label="Branch" value={branch} />
          <LabelValuePair label="Deposit Amount" value={amount} />
        </div>
        <div className="border-t border-brand-7 my-5 -mx-6 border-dashed" />
        <form className="space-y-4">
          <p className="text-text-tertiary dark:text-white">
            Caution Deposits Details:
          </p>
          <div className="space-y-2">
            <DetailsCheck label="Check Inventory" />
            <DetailsCheck label="Request for Examine" />
            <DetailsCheck label="Request for Maintenance" />
          </div>
          <div className="space-y-5">
            <label htmlFor="escrow" className="flex items-center gap-1">
              <input
                type="checkbox"
                id="escrow"
                className="w-[18px] h-[18px] checked:bg-brand-7 checked:border-brand-7"
                onChange={(e) => setIsEscrowChecked(e.target.checked)}
              />
              <span className="text-text-secondary dark:text-white text-sm font-normal">
                Request from OurProperty Administrator Escrow
              </span>
            </label>
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:justify-between">
              <Input
                id="refund_amount"
                label="Amount to be Refunded"
                CURRENCY_SYMBOL="₦"
                value={refundAmount}
                onChange={(value) =>
                  setRefundAmount(formatCostInputValue(value))
                }
              />
              <Button type="submit" size="xs_normal" className="py-2 px-6">
                {isEscrowChecked ? "Request Refund" : "Refund Now"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </ModalPreset>
  );
};

export default DepositRequestModal;
