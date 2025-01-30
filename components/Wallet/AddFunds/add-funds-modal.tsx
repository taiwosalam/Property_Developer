"use client"

import { empty } from "@/app/config";
import SendFundRecipient from "../SendFunds/send-fund-beneficiary";
import WalletBankTransferCard from "../wallet-bank-transfer-card";
import WalletModalPreset from "../wallet-modal-preset";
import WalletOnlineFundingCard from "../wallet-online-funding-card";
import useBranchStore from "@/store/branch-store";
import { useWalletStore } from "@/store/wallet-store";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { useState } from "react";
import { WalletSendFundsOptions } from "../types";

const AddFundsModal = ({branch}: {branch?: boolean}) => {
  const { branch: branch_details, setBranch } = useBranchStore();
  const {sub_wallet} = useWalletStore();
  const company_name = usePersonalInfoStore((state) => state.company_name);
  const [activeStep, setActiveStep] =
  useState<WalletSendFundsOptions>("send funds menu");

  return (
    <WalletModalPreset
      title={branch ? "Add Funds" : "Select payment method"}
      back={
        activeStep !== "send funds menu"
          ? () => {
              setActiveStep("send funds menu");
            }
          : undefined
      }
    >
      <div className="custom-flex-col gap-4">
      {branch ? (
        <SendFundRecipient
          name={`${company_name} / ${branch_details?.branch_name}`}
          picture={branch_details?.branch_picture || empty}
          wallet_id={`${sub_wallet.wallet_id}`}
          badge_color={'green'}
          branch
        />
        ): (
          <>
          <WalletBankTransferCard />
          <WalletOnlineFundingCard />
          </>
        )}
      </div>
    </WalletModalPreset>
  );
};

export default AddFundsModal;
