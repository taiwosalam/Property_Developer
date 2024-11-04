"use client";
import { useState } from "react";
import type { LabelValuePairProps } from "../property-requests/types";
import type { DepositRequestModalProps, DetailsCheckProps } from "./types";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import ModalPreset from "@/components/Wallet/wallet-modal-preset";
import Checkbox from "@/components/Form/Checkbox/checkbox";

const LabelValuePair: React.FC<LabelValuePairProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between font-medium">
      <p className="text-text-tertiary dark:text-darkText-1 text-base">
        {label}
      </p>
      <p className="text-text-secondary text-sm text-right dark:text-darkText-2">
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
}) => {
  const [isEscrowChecked, setIsEscrowChecked] = useState(false);
  const commonClasses =
    "bg-neutral-3 dark:bg-[#3C3D37] px-[18px] py-2 rounded-[4px] flex-row-reverse justify-between items-center w-full";
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
        </div>
        <div className="border-t border-brand-7 my-5 -mx-6 border-dashed" />
        <form className="space-y-4">
          <p className="text-text-tertiary dark:text-white">
            Caution Deposits Details:
          </p>
          <div className="space-y-2">
            <Checkbox className={commonClasses}>Check Inventory</Checkbox>
            <Checkbox className={commonClasses}>Request for Examine</Checkbox>
            <Checkbox className={commonClasses}>
              Request for Maintenance
            </Checkbox>
          </div>
          <div className="space-y-5">
            <Checkbox
              sm
              checked={isEscrowChecked}
              onChange={setIsEscrowChecked}
            >
              Request from OurProperty Administrator Escrow
            </Checkbox>
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:justify-between">
              <Input
                id="refund_amount"
                label="Amount to be Refunded"
                CURRENCY_SYMBOL="₦"
                formatNumber
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
