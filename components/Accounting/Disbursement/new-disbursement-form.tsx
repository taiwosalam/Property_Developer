// Types
import type { NewDisbursementFormProps } from "./types";

// Imports
import { useState } from "react";
import Label from "@/components/Form/Label/label";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import Button from "@/components/Form/Button/button";
import TextArea from "@/components/Form/TextArea/textarea";
import ModalPreset from "@/components/Wallet/wallet-modal-preset";
import {
  currencySymbols,
  formatCostInputValue,
} from "@/utils/number-formatter";

const NewDisbursementForm: React.FC<NewDisbursementFormProps> = ({
  nextStep,
}) => {
  const CURRENCY_SYMBOL = currencySymbols["NAIRA"]; // Make this dynamic
  const [amountDisburse, setAmountDisburse] = useState("");
  const handleAmountDisburseChange = (value: string) => {
    setAmountDisburse(formatCostInputValue(value));
  };
  return (
    <ModalPreset title="New Disbursement">
      <div className="custom-flex-col gap-6">
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-3">
          <Select
            required
            id="property"
            label="property"
            options={["apartment", "house", "land"]}
          />
          <Select
            required
            id="tenant-occupant"
            label="tenant / occupany"
            options={["tenant 1", "tenant 2"]}
          />
          <Select
            required
            isSearchable={false}
            label="disbursement mode"
            id="disbursement-mode"
            options={[
              "bank transfer",
              "wallet",
              "cash deposit",
              "bank deposit",
              "other mode of payment",
            ]}
          />
          <Input
            required
            CURRENCY_SYMBOL={CURRENCY_SYMBOL}
            id="amount-disburse"
            label="amount disburse"
            inputClassName="bg-white"
            value={amountDisburse}
            onChange={handleAmountDisburseChange}
          />
        </div>
        <div className="custom-flex-col gap-1">
          <Label required id="transaction-description">
            transaction description
          </Label>
          <TextArea id="transaction-description" />
        </div>
        <Button size="sm_medium" className="py-2 px-8" onClick={nextStep}>
          create
        </Button>
      </div>
    </ModalPreset>
  );
};

export default NewDisbursementForm;
