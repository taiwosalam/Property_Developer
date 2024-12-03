'use client'

import React from "react";
import WalletModalPreset from "./wallet-modal-preset";
import Button from "../Form/Button/button";
import FundsBeneficiary from "./SendFunds/funds-beneficiary";
import Input from "../Form/Input/input";
import useDarkMode from "@/hooks/useCheckDarkMode";

const BeneficiaryList = () => {
  const isDarkMode = useDarkMode()
  return (
    <WalletModalPreset title="Beneficiary List">
      <div className="custom-flex-col gap-6">
        <div className="flex gap-6">
          <Input
            id="add=beneficiary"
            label="add beneficiary"
            placeholder="Input Wallet ID"
            className="flex-1"
            style={{ backgroundColor: isDarkMode ? "#3C3D37" : "white" }}
          />
          <div className="flex items-end">
            <Button size="sm_medium" className="py-[11px] px-8">
              add
            </Button>
          </div>
        </div>
        <div className="custom-flex-col gap-4 py-[18px] rounded-2xl bg-neutral-2 dark:bg-darkText-primary">
          <p className="pl-[18px] text-[#010A23] dark:text-white text-base font-medium">
            Beneficiaries
          </p>
          <div className="custom-flex-col gap-2 sections">
            {Array(3)
              .fill(null)
              .map((_, idx) => (
                <FundsBeneficiary
                  key={idx}
                  remove={() => {}}
                  picture={""}
                  name={""}
                  wallet_id={""}
                />
              ))}
          </div>
        </div>
        <Button size="sm_medium" className="py-2 px-8">
          continue
        </Button>
      </div>
    </WalletModalPreset>
  );
};

export default BeneficiaryList;
