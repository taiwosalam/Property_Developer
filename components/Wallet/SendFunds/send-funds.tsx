import React from "react";

// Types
import type { WalletModalDefaultProps, WalletSendFundsOptions } from "../types";

// Imports
import Input from "@/components/Form/Input/input";
import FundsBeneficiary from "./funds-beneficiary";
import Button from "@/components/Form/Button/button";

const SendFunds: React.FC<WalletModalDefaultProps<WalletSendFundsOptions>> = ({
  changeStep,
}) => {
  const handleBenefeciary = () => {
    changeStep("send fund to beneficiary");
  };

  return (
    <div className="custom-flex-col gap-16">
      <div className="custom-flex-col gap-6">
        <Input
          id="wallet-id"
          placeholder="Description"
          label="Recipient Wallet ID"
          style={{ backgroundColor: "white" }}
        />
        <div className="custom-flex-col gap-4 py-[18px] rounded-2xl bg-neutral-2">
          <p className="pl-[18px] text-[#010A23] text-base font-medium">
            Beneficiaries
          </p>
          <div className="custom-flex-col gap-2 sections">
            {Array(3)
              .fill(null)
              .map((_, idx) => (
                <FundsBeneficiary key={idx} seeMore={handleBenefeciary} />
              ))}
          </div>
        </div>
      </div>
      <Button size="sm_medium" className="py-2 px-8">
        continue
      </Button>
    </div>
  );
};

export default SendFunds;
