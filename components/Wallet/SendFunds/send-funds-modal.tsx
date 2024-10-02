import React from "react";

// Imports
import Input from "@/components/Form/Input/input";
import FundsBeneficiary from "./funds-beneficiary";
import Button from "@/components/Form/Button/button";
import WalletModalPreset from "../wallet-modal-preset";

const SendFundsModal = () => {
  return (
    <WalletModalPreset title="Send Funds">
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
                  <FundsBeneficiary key={idx} />
                ))}
            </div>
          </div>
        </div>
        <Button size="sm_medium" className="py-2 px-8">
          continue
        </Button>
      </div>
    </WalletModalPreset>
  );
};

export default SendFundsModal;
