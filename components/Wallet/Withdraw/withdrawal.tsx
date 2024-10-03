import React from "react";

// Types
import type {
  WalletModalDefaultProps,
  WalletWithdrawFundsOptions,
} from "../types";

// Images
import InfoWarningIcon from "@/public/icons/info-warning-circle.svg";

// Imports
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import FundingCard from "../AddFunds/funding-card";
import Button from "@/components/Form/Button/button";

const Withdrawal: React.FC<
  WalletModalDefaultProps<WalletWithdrawFundsOptions>
> = ({ changeStep }) => {
  return (
    <div className="custom-flex-col gap-8">
      <div className="custom-flex-col gap-[18px]">
        <FundingCard
          type="sterling"
          title="0068190063"
          desc="David Ajala"
          cta="Sterling Bank"
          notRounded
        />
        <div className="custom-flex-col gap-4">
          <Input
            id="amount"
            label="amount"
            placeholder="₦"
            style={{ backgroundColor: "white" }}
          />
          <Input
            id="description"
            label="description"
            placeholder="Description"
            style={{ backgroundColor: "white" }}
          />
        </div>
      </div>
      <div className="custom-flex-col gap-3">
        <Button
          onClick={() => changeStep("input pin")}
          size="sm_medium"
          className="py-2 px-8"
        >
          continue
        </Button>
        <div className="py-3 px-4 flex gap-2 rounded-[4px] bg-status-caution-1">
          <div className="flex items-start">
            <Picture src={InfoWarningIcon} alt="warning" size={26} />
          </div>
          <p className="text-[#606060] text-sm font-normal">
            For security purposes, you can only withdraw money from your wallet
            to a verified account details. You can modify these details only
            from your profile.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;
