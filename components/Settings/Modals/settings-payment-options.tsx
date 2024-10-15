import React from "react";

// Types
import type { DefaultSettingsPaymentModalProps } from "../types";
import WalletBankTransferCard from "@/components/Wallet/wallet-bank-transfer-card";
import WalletOnlineFundingCard from "@/components/Wallet/wallet-online-funding-card";

const SettingsPaymentOptionsComponent: React.FC<
  DefaultSettingsPaymentModalProps
> = ({ changeStep }) => {
  const handleBankTransfer = () => {
    changeStep("bank transfer");
  };

  const handleOnlineFunding = () => {
    changeStep("online funding");
  };

  return (
    <div className="custom-flex-col gap-4">
      <WalletBankTransferCard proceed={handleBankTransfer} />
      <WalletOnlineFundingCard proceed={handleOnlineFunding} noInput />
    </div>
  );
};

export default SettingsPaymentOptionsComponent;
