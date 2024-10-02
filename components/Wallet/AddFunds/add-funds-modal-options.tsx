import React from "react";

// Types
import type { WalletModalDefaultProps } from "../types";

// Imports
import WalletBankTransferCard from "../wallet-bank-transfer-card";
import WalletOnlineFundingCard from "../wallet-online-funding-card";

const AddFundsModalOptions: React.FC<WalletModalDefaultProps> = ({
  changeStep,
}) => {
  const handleBankTransfer = () => {
    changeStep("bank transfer");
  };

  const handleOnlineFunding = () => {
    changeStep("online funding");
  };

  return (
    <div className="custom-flex-col gap-4">
      <WalletBankTransferCard proceed={handleBankTransfer} />
      <WalletOnlineFundingCard proceed={handleOnlineFunding} />
    </div>
  );
};

export default AddFundsModalOptions;
